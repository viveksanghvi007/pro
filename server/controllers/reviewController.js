import { Review, Company } from '../models/index.js';

// @desc Add review for a company
export const addReview = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const review = new Review({ ...req.body, company: companyId });
    await review.save();

    // Update avgRating
    const reviews = await Review.find({ company: companyId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    company.avgRating = avg.toFixed(1);
    await company.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all reviews for a company
export const getReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { sort, search } = req.query;


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
    res.status(500).json({ message: error.message });
  }
};
