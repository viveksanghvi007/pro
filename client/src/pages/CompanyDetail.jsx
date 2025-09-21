import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Calendar,
  Plus
} from 'lucide-react';
import { companyAPI, reviewAPI } from '../services/api';
import ReviewList from '../components/ReviewList';
import AddReviewModal from '../components/AddReviewModal';
import Logo from '../components/Logo';
import locationIcon from '../assets/location-gradient-icon-free-png.webp';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyAPI.getById(id);
      setCompany(response.data);
    } catch (err) {
      setError('Failed to fetch company details. Please try again.');
      console.error('Error fetching company:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      setIsAddingReview(true);
      await reviewAPI.create(id, reviewData);
      setShowAddReviewModal(false);
      // Refresh company data to get updated reviews
      fetchCompany();
    } catch (err) {
      console.error('Error adding review:', err);
      alert('Failed to add review. Please try again.');
    } finally {
      setIsAddingReview(false);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getLogoDesign = (companyName) => {
    // Generate dynamic logo based on company name
    const colors = [
      '#1e40af', // Blue
      '#059669', // Green
      '#ea580c', // Orange
      '#dc2626', // Red
      '#7c3aed', // Purple
      '#0891b2', // Cyan
      '#be185d', // Pink
      '#65a30d', // Lime
      '#ea580c', // Amber
      '#0f172a'  // Slate
    ];
    
    // Generate a consistent color based on company name
    let hash = 0;
    for (let i = 0; i < companyName.length; i++) {
      hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    
    // Generate initials from company name
    const words = companyName.split(' ');
    let initials = '';
    if (words.length >= 2) {
      initials = words[0].charAt(0) + words[1].charAt(0);
    } else {
      initials = companyName.substring(0, 2).toUpperCase();
    }
    
    return {
      color: colors[colorIndex],
      content: initials,
      textColor: 'white'
    };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  useEffect(() => {
    if (id) {
      fetchCompany();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchCompany} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company not found</h2>
          <p className="text-gray-600 mb-4">The company you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-3/4 mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
                  {/* Left - Logo */}
                  <button
                    onClick={() => navigate('/')}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Logo size="small" showText={true} />
                  </button>


            {/* Right - Navigation */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                SignUp
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="w-3/4 mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-4">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              {company.logo ? (
                <img 
                  src={company.logo} 
                  alt={`${company.companyName} logo`}
                  className="w-20 h-20 rounded-lg object-contain bg-gray-100 p-1"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center font-bold text-2xl ${company.logo ? 'hidden' : 'flex'}`}
                   style={{
                     backgroundColor: getLogoDesign(company.companyName).color,
                     color: getLogoDesign(company.companyName).textColor
                   }}>
                {getLogoDesign(company.companyName).content}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {company.companyName}
              </h1>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <img
                  src={locationIcon}
                  alt="Location"
                  className="w-4 h-4 mr-1 flex-shrink-0"
                />
                <span className="truncate">{company.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>Founded on {formatDate(company.foundedOn)}</span>
              </div>
              
              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {company.avgRating ? company.avgRating : '0.0'}
                  </span>
                  <div className="flex items-center">
                    {renderStars(company.avgRating || 0)}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {company.reviews ? company.reviews.length : 0} Reviews
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/company/${id}/reviews`)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Reviews
                  </button>
                  <button
                    onClick={() => setShowAddReviewModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
                  >
                    Add Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewList 
          companyId={id} 
          companyInfo={{
            companyName: company.companyName,
            averageRating: company.averageRating,
            totalReviews: company.totalReviews
          }}
        />
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        onSubmit={handleAddReview}
        isLoading={isAddingReview}
        companyName={company.companyName}
      />
    </div>
  );
};

export default CompanyDetail;

