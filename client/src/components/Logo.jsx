import logoImage from '../assets/WhatsApp Image 2025-09-21 at 00.15.35_bc0bbd2e.jpg';

const Logo = ({ size = 'default', showText = true }) => {
  const sizeClasses = {
    small: 'h-8',
    default: 'h-12',
    large: 'h-16'
  };

  return (
    <div className="flex items-center space-x-2">
      <img 
        src={logoImage} 
        alt="Review & RATE Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span className="text-xl font-bold text-gray-900">Review&RATE</span>
      )}
    </div>
  );
};

export default Logo;
