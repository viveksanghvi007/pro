import mongoose from 'mongoose';
import Company from './Company.js';
import Review from './Review.js';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/company-reviews';

// Database connection function
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export the models and connection function
export { Company, Review, connectDB };
export default { Company, Review, connectDB };