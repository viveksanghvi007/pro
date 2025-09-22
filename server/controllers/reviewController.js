import { Review, Company } from '../models/index.js';

// @desc Add review for a company
export const addReview = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Validate ObjectId format
    if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Validate required fields
    const { fullName, subject, reviewText, rating } = req.body;
    if (!fullName || !subject || !reviewText || !rating) {
      return res.status(400).json({ 
        message: 'Missing required fields: fullName, subject, reviewText, rating' 
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    const review = new Review({ ...req.body, company: companyId });
    await review.save();

    // Update avgRating
    const reviews = await Review.find({ company: companyId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    company.avgRating = avg.toFixed(1);
    await company.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Error in addReview:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all reviews for a company
export const getReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { sort, search } = req.query;

    // Validate ObjectId format
    if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    let query = { company: companyId };

    // Add search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { reviewText: { $regex: search, $options: 'i' } }
      ];
    }

    let reviews = Review.find(query);

    if (sort === 'newest') reviews = reviews.sort({ createdAt: -1 });
    if (sort === 'oldest') reviews = reviews.sort({ createdAt: 1 });
    if (sort === 'high') reviews = reviews.sort({ rating: -1 });
    if (sort === 'low') reviews = reviews.sort({ rating: 1 });

    const result = await reviews;
    res.json(result);
  } catch (error) {
    console.error('Error in getReviews:', error);
    res.status(500).json({ message: error.message });
  }
};
