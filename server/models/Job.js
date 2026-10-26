import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
      default: null,
    },
    service: {
      type: String,
      required: [true, 'Service category is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    location: {
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
    address: {
      type: String,
      default: 'Mumbai, Maharashtra',
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    isUrgent: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
    },
    initialBudget: {
      type: Number,
      default: 400,
    },
    finalPrice: {
      type: Number,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ location: '2dsphere' });
jobSchema.index({ status: 1 });
jobSchema.index({ customer: 1 });
jobSchema.index({ worker: 1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
