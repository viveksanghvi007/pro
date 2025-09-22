import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { companyAPI } from '../services/api';
import CompanyCard from '../components/CompanyCard';
import AddCompanyModal from '../components/AddCompanyModal';
import locationIcon from '../assets/location-gradient-icon-free-png.webp';

const CompanyList = ({ onCompanyClick }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Search and filter states
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Fetch companies
  const fetchCompanies = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        city: cityFilter || undefined,
        sort: sortBy === 'newest' ? 'date' : sortBy === 'rating' ? 'rating' : 'name'
      };

      console.log('Fetching companies with params:', params);
      const response = await companyAPI.getAll(params);
      console.log('API response:', response);
      setCompanies(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      console.error('Detailed error fetching companies:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack
      });
      setError('Failed to fetch companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filters
  const handleSearch = () => {
    setCurrentPage(1);
    fetchCompanies(1);
  };


  // Handle add company
  const handleAddCompany = async (companyData) => {
    try {
      setIsAdding(true);
      await companyAPI.create(companyData);
      setShowAddModal(false);
      fetchCompanies(currentPage); // Refresh current page
    } catch (err) {
      console.error('Error adding company:', err);
      alert('Failed to add company. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  // Load companies on component mount and when filters change
  useEffect(() => {
    fetchCompanies();
  }, [sortBy]);

  // Debounced search for city filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (cityFilter) {
        fetchCompanies();
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [cityFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-3/4 mx-auto px-4">
          <div className="py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
              <p className="mt-1 text-gray-600">
                Discover and review companies
              </p>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-700">Select City</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Indore, Madhya Pradesh, India"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="input-field w-80"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{
                    background: 'linear-gradient(to right, #ff00cc, #333399)'
                  }}
                >
                  Find Company
                </button>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{
                    background: 'linear-gradient(to right, #ff00cc, #333399)'
                  }}
                >
                  Add Company
                </button>
              </div>
              
              <div className="flex flex-col space-y-1 ml-auto">
                <span className="text-sm font-medium text-gray-700">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field w-32"
                >
                  <option value="name">Name</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-3/4 mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => fetchCompanies()} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or add a new company.
            </p>
             <button
               onClick={() => setShowAddModal(true)}
               className="px-6 py-2 text-white font-medium rounded-lg transition-colors"
              style={{
                background: 'linear-gradient(to right, #333399, #ff00cc)'
              }}
             >
               Add First Company
             </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Result Found: {pagination.totalCompanies || companies.length}
              </h2>
            </div>

            {/* Company Row */}
            <div className="flex flex-col space-y-4 w-full">
              {companies.map((company) => (
                <div key={company._id} className="w-full">
                  <CompanyCard
                    company={company}
                    onClick={() => onCompanyClick(company._id)}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => fetchCompanies(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchCompanies(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => fetchCompanies(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCompany}
        isLoading={isAdding}
      />
    </div>
  );
};

export default CompanyList;
