import { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';

const AddReviewModal = ({ isOpen, onClose, onSubmit, isLoading, companyName }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    reviewText: '',
    rating: 5
  });

  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.reviewText.trim()) {
      newErrors.reviewText = 'Review text is required';
    } else if (formData.reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters long';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      subject: '',
      reviewText: '',
      rating: 5
    });
    setErrors({});
    setHoveredRating(0);
    onClose();
  };

  const getRatingText = (rating) => {
    if (rating <= 1) return "Very Dissatisfied";
    if (rating <= 2) return "Dissatisfied";
    if (rating <= 3) return "Neutral";
    if (rating <= 4) return "Satisfied";
    return "Very Satisfied";
  };

  const renderStars = (rating, isInteractive = false) => {
    const stars = [];
    const displayRating = isInteractive ? (hoveredRating || rating) : rating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      stars.push(
        <span
          key={i}
          className={`me-1 transition-colors ${
            isFilled
              ? 'text-yellow-400'
              : 'text-gray-300 hover:text-yellow-300'
          } ${isInteractive ? 'cursor-pointer' : ''}`}
          style={{
            fontSize: '24px',
            transition: 'color 0.2s ease'
          }}
          onClick={() => isInteractive && handleRatingChange(i)}
          onMouseEnter={() => isInteractive && setHoveredRating(i)}
          onMouseLeave={() => isInteractive && setHoveredRating(0)}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
        {/* Abstract purple quarter-circle design element */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-br-full opacity-70"></div>

        {/* Header */}
        <div className="flex items-center justify-center mb-8 z-10 relative">
          <h2 className="text-2xl font-bold text-gray-900">Add Review</h2>
          <button
            onClick={handleClose}
            className="absolute right-0 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.fullName ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.subject ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-900 mb-2">
              Enter your Review
            </label>
            <textarea
              id="reviewText"
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${errors.reviewText ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Description"
            />
            {errors.reviewText && (
              <p className="mt-1 text-sm text-red-600">{errors.reviewText}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Rating
            </label>
            <div className="flex items-center">
              <div className="flex items-center me-3">
                {renderStars(formData.rating, true)}
              </div>
              <span className="text-sm text-gray-500">
                {getRatingText(formData.rating)}
              </span>
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center pt-4">
            <button
              type="submit"
              className="px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(to right, #ff00cc, #333399)'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
