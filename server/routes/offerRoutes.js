import express from 'express';
import Offer from '../models/Offer.js';
import Job from '../models/Job.js';
import WorkerProfile from '../models/WorkerProfile.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/jobs/:id/offers
// @desc    Submit an offer for a job
// @access  Private
router.post('/jobs/:id/offers', protect, async (req, res) => {
  try {
    const { amount, note, workerId } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    let resolvedWorkerId = workerId;

    if (req.user.role === 'worker') {
      const myProfile = await WorkerProfile.findOne({ user: req.user._id });
      if (!myProfile) {
        return res.status(404).json({ success: false, message: 'Worker profile not found' });
      }
      resolvedWorkerId = myProfile._id;
    }

    if (!resolvedWorkerId) {
      return res.status(400).json({ success: false, message: 'Worker ID is required' });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid offer amount is required' });
    }

    // Check if an offer already exists between this worker and job
    let offer = await Offer.findOne({ job: jobId, worker: resolvedWorkerId });

    if (offer) {
      // Add to negotiation history
      offer.amount = Number(amount);
      offer.status = req.user.role === 'customer' ? 'countered' : 'pending';
      offer.history.push({
        by: req.user.role === 'worker' ? 'worker' : 'customer',
        amount: Number(amount),
        note: note || '',
        timestamp: new Date(),
      });
      await offer.save();
    } else {
      offer = await Offer.create({
        job: jobId,
        worker: resolvedWorkerId,
        customer: job.customer,
        amount: Number(amount),
        status: 'pending',
        history: [
          {
            by: req.user.role === 'worker' ? 'worker' : 'customer',
            amount: Number(amount),
            note: note || 'Initial offer submitted',
            timestamp: new Date(),
          },
        ],
      });
    }

    const populatedOffer = await Offer.findById(offer._id)
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' },
      })
      .populate('customer', 'name phone avatar');

    // Real-time broadcast
    const io = req.app.get('io');
    if (io) {
      io.to(`job_${jobId}`).emit('new-offer', populatedOffer);
      io.emit('new-offer', populatedOffer);
    }

    return res.status(201).json({
      success: true,
      message: 'Offer submitted successfully',
      offer: populatedOffer,
    });
  } catch (error) {
    console.error('Submit offer error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/jobs/:id/offers
// @desc    Get all offers for a job
// @access  Private
router.get('/jobs/:id/offers', protect, async (req, res) => {
  try {
    const offers = await Offer.find({ job: req.params.id })
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' },
      })
      .populate('customer', 'name phone avatar')
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/offers/:id
// @desc    Update offer (accept, counter, decline)
// @access  Private
router.patch('/offers/:id', protect, async (req, res) => {
  try {
    const { action, counterAmount, note } = req.body; // action: 'accept' | 'counter' | 'decline'

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    const job = await Job.findById(offer.job);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const io = req.app.get('io');

    if (action === 'accept') {
      offer.status = 'accepted';
      offer.history.push({
        by: req.user.role === 'worker' ? 'worker' : 'customer',
        amount: offer.amount,
        note: note || 'Offer accepted! Deal finalized.',
        timestamp: new Date(),
      });
      await offer.save();

      // Lock in final price on job and set status to accepted
      job.status = 'accepted';
      job.finalPrice = offer.amount;
      job.worker = offer.worker;
      await job.save();

      // Automatically decline other offers for this job
      await Offer.updateMany(
        { job: job._id, _id: { $ne: offer._id } },
        { status: 'declined' }
      );

      const populatedJob = await Job.findById(job._id)
        .populate('customer', 'name phone avatar address')
        .populate({
          path: 'worker',
          populate: { path: 'user', select: 'name phone avatar' },
        });

      if (io) {
        io.to(`job_${job._id}`).emit('job-status-changed', {
          jobId: job._id,
          status: 'accepted',
          job: populatedJob,
        });
        io.emit('job-status-changed', {
          jobId: job._id,
          status: 'accepted',
          job: populatedJob,
        });
      }
    } else if (action === 'counter') {
      if (!counterAmount || Number(counterAmount) <= 0) {
        return res.status(400).json({ success: false, message: 'Counter amount is required' });
      }

      offer.counterAmount = Number(counterAmount);
      offer.amount = Number(counterAmount);
      offer.status = 'countered';
      offer.history.push({
        by: req.user.role === 'worker' ? 'worker' : 'customer',
        amount: Number(counterAmount),
        note: note || 'Counter offer proposed',
        timestamp: new Date(),
      });
      await offer.save();
    } else if (action === 'decline') {
      offer.status = 'declined';
      offer.history.push({
        by: req.user.role === 'worker' ? 'worker' : 'customer',
        amount: offer.amount,
        note: note || 'Offer declined',
        timestamp: new Date(),
      });
      await offer.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'accept', 'counter', or 'decline'",
      });
    }

    const populatedOffer = await Offer.findById(offer._id)
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' },
      })
      .populate('customer', 'name phone avatar');

    if (io) {
      io.to(`job_${job._id}`).emit('offer-updated', populatedOffer);
      io.emit('offer-updated', populatedOffer);
    }

    return res.json({
      success: true,
      message: `Offer ${action}ed successfully`,
      offer: populatedOffer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
