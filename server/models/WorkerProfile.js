import mongoose from 'mongoose';

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: 'Experienced professional ready to assist with high quality and dedication.',
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
      default: ['Plumber'],
    },
    experienceYears: {
      type: Number,
      default: 3,
    },
    hourlyRate: {
      type: Number,
      required: true,
      default: 350,
      min: [50, 'Minimum rate is ₹50/hr'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    idDocUrl: {
      type: String,
      default: '',
    },
    avgRating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    completedJobsCount: {
      type: Number,
      default: 0,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [72.8777, 19.0760],
      },
    },
    serviceRadiusKm: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial worker search
workerProfileSchema.index({ currentLocation: '2dsphere' });
workerProfileSchema.index({ skills: 1 });
workerProfileSchema.index({ availability: 1 });
workerProfileSchema.index({ verificationStatus: 1 });

const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);
export default WorkerProfile;
