import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    let workerProfile = null;
    if (req.user.role === 'worker') {
      workerProfile = await WorkerProfile.findOne({ user: req.user._id });
    }

    return res.json({
      success: true,
      user: req.user,
      workerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const { name, email, avatar, address, coordinates } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (address) user.address = address;

    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      user.location = {
        type: 'Point',
        coordinates: [Number(coordinates[0]), Number(coordinates[1])],
      };

      // If worker, also sync currentLocation
      if (user.role === 'worker') {
        await WorkerProfile.findOneAndUpdate(
          { user: user._id },
          { currentLocation: user.location }
        );
      }
    }

    await user.save();

    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await WorkerProfile.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
      workerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
