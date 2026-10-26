import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'homecrew_super_secret_jwt_key_hackathon_2026',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone (mock OTP "123456" in dev mode)
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number',
      });
    }

    const mockOtp = process.env.MOCK_OTP || '123456';

    // In a production environment, send SMS via Twilio/Fast2SMS here
    console.log(`[AUTH] Mock OTP for ${phone} is: ${mockOtp}`);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully. In dev mode, use OTP: ${mockOtp}`,
      devOtp: mockOtp,
    });
  } catch (error) {
    console.error('send-otp error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and log in / sign up user
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, role, name, skills, hourlyRate, address, coordinates } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    const validOtp = process.env.MOCK_OTP || '123456';
    if (otp !== validOtp && otp !== '123456') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please enter 123456 in dev mode',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ phone: phone.trim() });

    if (!user) {
      // Create new user
      const userCoords = coordinates && Array.isArray(coordinates) && coordinates.length === 2
        ? coordinates
        : [72.8777, 19.0760]; // Default: Mumbai center

      user = await User.create({
        phone: phone.trim(),
        name: name && name.trim() ? name.trim() : (role === 'worker' ? 'Pro Partner' : 'Customer'),
        role: role || 'customer',
        address: address || 'Mumbai, Maharashtra',
        location: {
          type: 'Point',
          coordinates: userCoords,
        },
        isPhoneVerified: true,
      });

      // If registered as worker, create WorkerProfile
      if (user.role === 'worker') {
        await WorkerProfile.create({
          user: user._id,
          skills: skills && skills.length > 0 ? skills : ['Plumber'],
          hourlyRate: hourlyRate ? Number(hourlyRate) : 350,
          currentLocation: {
            type: 'Point',
            coordinates: userCoords,
          },
          availability: true,
          verificationStatus: 'pending',
        });
      }
    }

    // Fetch worker profile if worker
    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await WorkerProfile.findOne({ user: user._id });
      if (!workerProfile) {
        // Auto-create profile if missing
        workerProfile = await WorkerProfile.create({
          user: user._id,
          skills: skills || ['Plumber'],
          hourlyRate: hourlyRate || 350,
          currentLocation: user.location,
        });
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        location: user.location,
      },
      workerProfile,
    });
  } catch (error) {
    console.error('verify-otp error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Verification failed. Please try again.',
    });
  }
});

// @route   GET /api/auth/demo-users
// @desc    Get preset demo users for instant hackathon evaluation
// @access  Public
router.get('/demo-users', async (req, res) => {
  try {
    const demoPhones = [
      { role: 'customer', name: 'Rahul Sharma (Customer)', phone: '9820011223' },
      { role: 'worker', name: 'Ramesh Patil (Plumber)', phone: '9820099881' },
      { role: 'worker', name: 'Amit Verma (Electrician)', phone: '9820099882' },
      { role: 'admin', name: 'HomeCrew Admin', phone: '9999999999' },
    ];
    return res.json({ success: true, demoUsers: demoPhones, defaultOtp: '123456' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
