import express from 'express';
import WorkerProfile from '../models/WorkerProfile.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { protect, optionalAuth, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { calculateDistanceKm, computeEta } from '../utils/distanceEta.js';

const router = express.Router();

// @route   GET /api/workers
// @desc    Get workers with geospatial filtering and ETA calculation
// @access  Public (with optionalAuth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      service,
      rating,
      maxRate,
      verified,
      available,
      search,
      sort,
    } = req.query;

    // Determine reference coordinates (from query, or auth user, or Mumbai center)
    let lng = 72.8777;
    let lat = 19.0760;

    if (req.query.lng && req.query.lat) {
      lng = parseFloat(req.query.lng);
      lat = parseFloat(req.query.lat);
    } else if (req.user && req.user.location && req.user.location.coordinates) {
      lng = req.user.location.coordinates[0];
      lat = req.user.location.coordinates[1];
    }

    const maxDistanceKm = req.query.maxDistance ? parseFloat(req.query.maxDistance) : 25;

    // Build filter criteria
    const filter = {};

    if (service && service !== 'All') {
      filter.skills = { $regex: new RegExp(`^${service}$`, 'i') };
    }

    if (rating) {
      filter.avgRating = { $gte: parseFloat(rating) };
    }

    if (maxRate) {
      filter.hourlyRate = { $lte: parseFloat(maxRate) };
    }

    if (verified === 'true') {
      filter.verificationStatus = 'verified';
    }

    if (available === 'true') {
      filter.availability = true;
    }

    let workers = [];

    // Attempt geospatial query using $near
    try {
      workers = await WorkerProfile.find({
        ...filter,
        currentLocation: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: maxDistanceKm * 1000, // convert km to meters
          },
        },
      }).populate('user', 'name phone email avatar address');
    } catch (geoErr) {
      // Fallback if 2dsphere index not yet active or memory DB
      console.warn('[Workers] Geospatial query fallback:', geoErr.message);
      workers = await WorkerProfile.find(filter).populate('user', 'name phone email avatar address');
    }

    // Attach computed distance, ETA, and 30-min guarantee to each worker
    const enrichedWorkers = workers
      .map((worker) => {
        const workerObj = worker.toObject();
        const workerCoords = worker.currentLocation?.coordinates || [72.8777, 19.0760];
        const wLng = workerCoords[0];
        const wLat = workerCoords[1];

        const distanceKm = calculateDistanceKm(lat, lng, wLat, wLng);
        const { etaMinutes, isUnder30Min, etaFormatted } = computeEta(distanceKm);

        return {
          ...workerObj,
          distanceKm,
          etaMinutes,
          isUnder30Min,
          etaFormatted,
        };
      })
      .filter((w) => w.distanceKm <= maxDistanceKm);

    // Sort by requested option or default to distance
    if (sort === 'rate_asc') {
      enrichedWorkers.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sort === 'rate_desc') {
      enrichedWorkers.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sort === 'rating') {
      enrichedWorkers.sort((a, b) => b.avgRating - a.avgRating);
    } else {
      // Default: sort by distance (nearest first)
      enrichedWorkers.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return res.json({
      success: true,
      count: enrichedWorkers.length,
      userLocation: { lat, lng },
      workers: enrichedWorkers,
    });
  } catch (error) {
    console.error('GET /api/workers error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/workers/:id
// @desc    Get worker profile by WorkerProfile ID or User ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    let worker = await WorkerProfile.findById(req.params.id).populate(
      'user',
      'name phone email avatar address'
    );

    if (!worker) {
      // Try finding by user ID
      worker = await WorkerProfile.findOne({ user: req.params.id }).populate(
        'user',
        'name phone email avatar address'
      );
    }

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Get reference coordinates
    let lng = 72.8777;
    let lat = 19.0760;
    if (req.query.lng && req.query.lat) {
      lng = parseFloat(req.query.lng);
      lat = parseFloat(req.query.lat);
    } else if (req.user && req.user.location && req.user.location.coordinates) {
      lng = req.user.location.coordinates[0];
      lat = req.user.location.coordinates[1];
    }

    const workerCoords = worker.currentLocation?.coordinates || [72.8777, 19.0760];
    const distanceKm = calculateDistanceKm(lat, lng, workerCoords[1], workerCoords[0]);
    const { etaMinutes, isUnder30Min, etaFormatted } = computeEta(distanceKm);

    // Fetch reviews for this worker
    const reviews = await Review.find({ worker: worker._id })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    const workerObj = worker.toObject();

    return res.json({
      success: true,
      worker: {
        ...workerObj,
        distanceKm,
        etaMinutes,
        isUnder30Min,
        etaFormatted,
      },
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/workers/availability
// @desc    Toggle or set worker availability
// @access  Private (Worker)
router.put('/availability', protect, authorize('worker'), async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }

    if (typeof req.body.availability === 'boolean') {
      profile.availability = req.body.availability;
    } else {
      profile.availability = !profile.availability;
    }

    await profile.save();

    return res.json({
      success: true,
      message: `Status updated: Worker is now ${profile.availability ? 'Available' : 'Busy/Offline'}`,
      availability: profile.availability,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/workers/profile
// @desc    Update worker profile details (bio, rate, skills)
// @access  Private (Worker)
router.put('/profile', protect, authorize('worker'), async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }

    const { bio, hourlyRate, skills, experienceYears, serviceRadiusKm } = req.body;

    if (bio !== undefined) profile.bio = bio;
    if (hourlyRate !== undefined) profile.hourlyRate = Number(hourlyRate);
    if (skills && Array.isArray(skills)) profile.skills = skills;
    if (experienceYears !== undefined) profile.experienceYears = Number(experienceYears);
    if (serviceRadiusKm !== undefined) profile.serviceRadiusKm = Number(serviceRadiusKm);

    await profile.save();

    return res.json({
      success: true,
      message: 'Worker profile updated successfully',
      workerProfile: profile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/workers/verification
// @desc    Upload government ID document for verification (Multer local storage)
// @access  Private (Worker)
router.post('/verification', protect, authorize('worker'), upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an ID document' });
    }

    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Worker profile not found' });
    }

    // Save relative URL path to document
    const docUrl = `/uploads/documents/${req.file.filename}`;
    profile.idDocUrl = docUrl;
    profile.verificationStatus = 'pending';
    await profile.save();

    return res.json({
      success: true,
      message: 'ID document uploaded successfully! Verification is now pending admin approval.',
      idDocUrl: docUrl,
      verificationStatus: 'pending',
    });
  } catch (error) {
    console.error('Verification upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
