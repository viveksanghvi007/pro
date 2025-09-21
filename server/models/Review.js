import mongoose from 'mongoose';

// Define the Review Schema
const reviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
const Review = mongoose.model('Review', reviewSchema);

export default Review;