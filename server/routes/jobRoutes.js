import express from 'express';
import Job from '../models/Job.js';
import WorkerProfile from '../models/WorkerProfile.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job request
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
  try {
    const {
      service,
      title,
      description,
      photos,
      address,
      coordinates,
      scheduledAt,
      isUrgent,
      initialBudget,
      workerId, // Optional: if directly booking/requesting a specific worker
    } = req.body;

    if (!service || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Service category, title, and description are required',
      });
    }

    const jobCoords =
      coordinates && Array.isArray(coordinates) && coordinates.length === 2
        ? coordinates
        : req.user.location?.coordinates || [72.8777, 19.0760];

    const job = await Job.create({
      customer: req.user._id,
      worker: workerId || null,
      service,
      title,
      description,
      photos: photos || [],
      address: address || req.user.address || 'Mumbai, Maharashtra',
      location: {
        type: 'Point',
        coordinates: jobCoords,
      },
      scheduledAt: scheduledAt || Date.now(),
      isUrgent: isUrgent !== undefined ? isUrgent : true,
      initialBudget: initialBudget ? Number(initialBudget) : 400,
      status: 'requested',
    });

    const populatedJob = await Job.findById(job._id)
      .populate('customer', 'name phone avatar address')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' },
      });

    // Real-time broadcast via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('new-job', populatedJob);
      if (workerId) {
        io.to(`worker_${workerId}`).emit('new-direct-job', populatedJob);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Job request submitted successfully! Workers will respond shortly.',
      job: populatedJob,
    });
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/jobs/my
// @desc    Get all jobs for logged-in user (Customer or Worker)
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'worker') {
      const workerProfile = await WorkerProfile.findOne({ user: req.user._id });
      if (!workerProfile) {
        return res.json({ success: true, jobs: [] });
      }
      // Jobs assigned to this worker OR unassigned requested jobs matching their skills
      query = {
        $or: [
          { worker: workerProfile._id },
          { status: 'requested', service: { $in: workerProfile.skills } },
        ],
      };
    } else if (req.user.role === 'admin') {
      // Admin sees all
      query = {};
    }

    const jobs = await Job.find(query)
      .populate('customer', 'name phone avatar address')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' },
      })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('customer', 'name phone avatar address location')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar address location' },
      });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    return res.json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/jobs/:id/status
// @desc    Update job status (requested -> accepted -> on_the_way -> in_progress -> completed -> cancelled)
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, finalPrice, workerId } = req.body;
    const allowedStatuses = [
      'requested',
      'accepted',
      'on_the_way',
      'in_progress',
      'completed',
      'cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.status = status;

    if (finalPrice !== undefined) {
      job.finalPrice = Number(finalPrice);
    }

    if (workerId && !job.worker) {
      job.worker = workerId;
    }

    if (status === 'completed') {
      job.completedAt = new Date();
      // Increment completed jobs count on worker profile
      if (job.worker) {
        await WorkerProfile.findByIdAndUpdate(job.worker, {
          $inc: { completedJobsCount: 1 },
        });
      }
    }

    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate('customer', 'name phone avatar address')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' },
      });

    // Real-time broadcast via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`job_${job._id}`).emit('job-status-changed', {
        jobId: job._id,
        status: job.status,
        job: updatedJob,
      });
      io.emit('job-status-changed', {
        jobId: job._id,
        status: job.status,
        job: updatedJob,
      });
    }

    return res.json({
      success: true,
      message: `Job status updated to ${status}`,
      job: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
