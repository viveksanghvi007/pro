import mongoose from 'mongoose';

// Define the Company Schema
const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  foundedOn: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
  },
  avgRating: {
    type: Number,
    default: 0,
  },
});

// Add a virtual field to the Company schema to calculate average rating
companySchema.virtual('averageRating').get(async function () {
  const reviews = await this.model('Review').find({ company: this._id });
  if (reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1); // Return average with 1 decimal place
});

// Export the model
const Company = mongoose.model('Company', companySchema);

export default Company;