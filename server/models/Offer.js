import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    counterAmount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'countered', 'accepted', 'declined'],
      default: 'pending',
    },
    history: [
      {
        by: {
          type: String,
          enum: ['customer', 'worker'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        note: {
          type: String,
          default: '',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

offerSchema.index({ job: 1, worker: 1 });
offerSchema.index({ status: 1 });

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
