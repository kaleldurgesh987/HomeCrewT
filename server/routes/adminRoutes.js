import express from 'express';
import WorkerProfile from '../models/WorkerProfile.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require admin role for all admin routes
router.use(protect, authorize('admin'));

// @route   GET /api/admin/pending-workers
// @desc    Get all workers with pending verification (or all workers with status)
// @access  Private (Admin)
router.get('/pending-workers', async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const filter = status === 'all' ? {} : { verificationStatus: status };

    const workers = await WorkerProfile.find(filter)
      .populate('user', 'name phone email avatar address createdAt')
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/admin/workers/:id/verify
// @desc    Approve or reject worker verification
// @access  Private (Admin)
router.patch('/workers/:id/verify', async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'verified', 'rejected', or 'pending'",
      });
    }

    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }

    worker.verificationStatus = status;
    await worker.save();

    const populatedWorker = await WorkerProfile.findById(worker._id).populate(
      'user',
      'name phone email avatar'
    );

    return res.json({
      success: true,
      message: `Worker verification status updated to ${status}`,
      worker: populatedWorker,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics for admin overview
// @access  Private (Admin)
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalCustomers, totalWorkers, pendingVerifications, verifiedWorkers, totalJobs, activeJobs, completedJobs] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        User.countDocuments({ role: 'worker' }),
        WorkerProfile.countDocuments({ verificationStatus: 'pending' }),
        WorkerProfile.countDocuments({ verificationStatus: 'verified' }),
        Job.countDocuments(),
        Job.countDocuments({ status: { $in: ['requested', 'accepted', 'on_the_way', 'in_progress'] } }),
        Job.countDocuments({ status: 'completed' }),
      ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalWorkers,
        pendingVerifications,
        verifiedWorkers,
        totalJobs,
        activeJobs,
        completedJobs,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    List all registered users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/jobs
// @desc    List all jobs across the platform
// @access  Private (Admin)
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('customer', 'name phone avatar')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name phone avatar' },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
