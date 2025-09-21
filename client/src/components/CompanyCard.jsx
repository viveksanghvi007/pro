import { Star, Calendar, Building2 } from 'lucide-react';
import locationIcon from '../assets/location-gradient-icon-free-png.webp';

const CompanyCard = ({ company, onClick }) => {
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
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Main Content Row */}
        <div className="flex items-start justify-between">
          {/* Left Side - Logo */}
          <div className="flex-shrink-0 mr-4">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={`${company.companyName} logo`}
                className="w-16 h-16 rounded-lg object-contain bg-gray-100 p-1"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl ${company.logo ? 'hidden' : 'flex'}`} 
                 style={{ 
                   backgroundColor: getLogoDesign(company.companyName).color,
                   color: getLogoDesign(company.companyName).textColor
                 }}>
              {getLogoDesign(company.companyName).content}
            </div>
          </div>

          {/* Center - Company Details and Rating */}
          <div className="flex-1 min-w-0 mr-4">
            {/* Company Name */}
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
              {company.companyName}
            </h3>
            
            {/* Address */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <img 
                src={locationIcon} 
                alt="Location" 
                className="w-4 h-4 mr-1 flex-shrink-0" 
              />
              <span className="truncate">{company.location}</span>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {company.avgRating ? company.avgRating : '0.0'}
              </span>
              <div className="flex items-center">
                {renderStars(company.avgRating || 0)}
              </div>
              {company.reviews && company.reviews.length > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {company.reviews.length} Reviews
                </span>
              )}
            </div>
          </div>

          {/* Right Side - Founded Date and Button */}
          <div className="flex flex-col items-end space-y-3">
            {/* Founded Date */}
            <div className="text-sm text-gray-500">
              Founded on {formatDate(company.foundedOn)}
            </div>
            
            {/* Action Button */}
            <button 
              onClick={onClick}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Detail Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
