import { useState, useEffect } from 'react';
import { Star, SortAsc, SortDesc, MessageSquare } from 'lucide-react';
import { reviewAPI } from '../services/api';
import ReviewCard from './ReviewCard';

const ReviewList = ({ companyId, companyInfo }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        sort: sortBy === 'date' ? 'newest' : sortBy === 'rating-high' ? 'high' : sortBy === 'rating-low' ? 'low' : 'newest',
        page,
        limit: 10
      };

      const response = await reviewAPI.getByCompany(companyId, params);
      setReviews(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch reviews. Please try again.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    fetchReviews(1);
  };

  const handlePageChange = (page) => {
    fetchReviews(page);
  };

  useEffect(() => {
    if (companyId) {
      fetchReviews();
    }
  }, [companyId, sortBy]);

  const sortOptions = [
    { value: 'date', label: 'Newest First', icon: SortDesc },
    { value: 'rating-high', label: 'Highest Rating', icon: Star },
    { value: 'rating-low', label: 'Lowest Rating', icon: Star }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => fetchReviews()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            Be the first to review this company.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;

