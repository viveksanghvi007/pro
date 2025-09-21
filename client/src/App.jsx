import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Building2, Star, Search } from 'lucide-react';
import Logo from './components/Logo';
import CompanyList from './pages/CompanyList';
import CompanyDetail from './pages/CompanyDetail';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/company/:id/reviews" element={<ReviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}/reviews`);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="small" showText={true} />
            
            {/* Center Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            
            {/* Right Side - Signup/Login */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-primary-600 font-medium">SignUp</button>
              <button className="text-gray-600 hover:text-primary-600 font-medium">Login</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <CompanyList onCompanyClick={handleCompanyClick} />
    </div>
  );
}

export default App;
