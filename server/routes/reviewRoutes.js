import express from 'express';
import Review from '../models/Review.js';
import Job from '../models/Job.js';
import WorkerProfile from '../models/WorkerProfile.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Submit rating and review after job completion
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, workerId, rating, comment, tags } = req.body;

    if (!jobId || !workerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Job ID, Worker ID, rating (1-5), and feedback comment are required',
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ job: jobId, customer: req.user._id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this job',
      });
    }

    const review = await Review.create({
      job: jobId,
      worker: workerId,
      customer: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
      tags: tags || ['Punctual', 'Skilled', 'Polite'],
    });

    // Recompute worker's average rating and total review count
    const allReviews = await Review.find({ worker: workerId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

    await WorkerProfile.findByIdAndUpdate(workerId, {
      avgRating,
      totalReviews: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('customer', 'name avatar')
      .populate('worker');

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for supporting local workers!',
      review: populatedReview,
      newAvgRating: avgRating,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/workers/:id/reviews
// @desc    Get all reviews for a worker
// @access  Public
router.get('/workers/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.id })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
