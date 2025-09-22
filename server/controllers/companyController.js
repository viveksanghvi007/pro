import { Company, Review } from '../models/index.js';

// @desc Add a new company
export const addCompany = async (req, res) => {
  try {
    // Validate required fields
    const { companyName, location, foundedOn, city } = req.body;
    if (!companyName || !location || !foundedOn || !city) {
      return res.status(400).json({ 
        message: 'Missing required fields: companyName, location, foundedOn, city' 
      });
    }

    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error in addCompany:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all companies with search, filter, sort
export const getCompanies = async (req, res) => {
  try {
    console.log('getCompanies called with query:', req.query);
    const { search, city, sort } = req.query;

    let query = {};
    if (search) query.companyName = { $regex: search, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' }; // Make city search case-insensitive and partial match

    console.log('MongoDB query:', query);
    let companies = Company.find(query);

    // Apply sorting based on database fields first
    if (sort === 'name') companies = companies.sort({ companyName: 1 });
    if (sort === 'date') companies = companies.sort({ foundedOn: -1 });

    const result = await companies;
    console.log(`Found ${result.length} companies`);
    
    // Calculate average rating for each company
    const companiesWithRatings = await Promise.all(
      result.map(async (company) => {
        const reviews = await Review.find({ company: company._id });
        const avgRating = reviews.length > 0 
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0;
        
        return {
          ...company.toObject(),
          avgRating: parseFloat(avgRating),
          reviews: reviews
        };
      })
    );

    // Sort by rating after calculating actual ratings
    if (sort === 'rating') {
      companiesWithRatings.sort((a, b) => b.avgRating - a.avgRating);
    }

    console.log(`Returning ${companiesWithRatings.length} companies with ratings`);
    res.json(companiesWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single company with reviews
export const getCompanyById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const reviews = await Review.find({ company: company._id }).sort({ createdAt: -1 });
    
    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ 
      ...company.toObject(), 
      reviews,
      avgRating: parseFloat(avgRating)
    });
  } catch (error) {
    console.error('Error in getCompanyById:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Update company
export const updateCompany = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    console.error('Error in updateCompany:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete company
export const deleteCompany = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCompany:', error);
    res.status(500).json({ message: error.message });
  }
};
