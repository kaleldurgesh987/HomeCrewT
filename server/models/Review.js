import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: ['Punctual', 'Skilled', 'Polite'],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ worker: 1 });
reviewSchema.index({ customer: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
