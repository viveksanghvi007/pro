import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pro-baww.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Company API functions
export const companyAPI = {
  // Get all companies with search and filters
  getAll: async (params = {}) => {
    const response = await api.get('/companies', { params });
    return { data: response.data, pagination: {} };
  },

  // Get single company by ID
  getById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return { data: response.data };
  },

  // Create new company
  create: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  // Update company
  update: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  // Delete company
  delete: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },
};

// Review API functions
export const reviewAPI = {
  // Get reviews for a company
  getByCompany: async (companyId, params = {}) => {
    const response = await api.get(`/reviews/${companyId}`, { params });
    return { data: response.data, pagination: {} };
  },

  // Create new review
  create: async (companyId, reviewData) => {
    const response = await api.post(`/reviews/${companyId}`, reviewData);
    return response.data;
  },

  // Update review
  update: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  delete: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
