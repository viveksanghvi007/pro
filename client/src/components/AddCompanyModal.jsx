import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import locationIcon from '../assets/location-gradient-icon-free-png.webp';

const AddCompanyModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    foundedOn: '',
    city: '',
    logo: ''
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.foundedOn) {
      newErrors.foundedOn = 'Founded date is required';
    } else {
      const foundedDate = new Date(formData.foundedOn);
      const today = new Date();
      if (foundedDate > today) {
        newErrors.foundedOn = 'Founded date cannot be in the future';
      }
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (formData.logo && !isValidUrl(formData.logo)) {
      newErrors.logo = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      companyName: '',
      location: '',
      foundedOn: '',
      city: '',
      logo: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
        {/* Abstract purple quarter-circle design element */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-br-full opacity-70"></div>

        {/* Header */}
        <div className="flex items-center justify-center mb-6 z-10 relative">
          <h2 className="text-2xl font-bold text-gray-900">Add Company</h2>
          <button
            onClick={handleClose}
            className="absolute right-0 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-900 mb-2">
              Company name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.companyName ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.location ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Select Location"
              />
              <img 
                src={locationIcon} 
                alt="Location" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4" 
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Founded Date */}
          <div>
            <label htmlFor="foundedOn" className="block text-sm font-medium text-gray-900 mb-2">
              Founded on
            </label>
            <div className="relative">
              <input
                type="text"
                id="foundedOn"
                name="foundedOn"
                value={formData.foundedOn}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.foundedOn ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="DD/MM/YYYY"
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
            {errors.foundedOn && (
              <p className="mt-1 text-sm text-red-600">{errors.foundedOn}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.city ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-900 mb-2">
              Logo URL (Optional)
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.logo ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="https://example.com/logo.png"
            />
            {errors.logo && (
              <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
            )}
            {formData.logo && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-gray-100 p-1"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-sm text-red-500">Invalid image URL</div>
              </div>
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
              {isLoading ? 'Adding...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;
