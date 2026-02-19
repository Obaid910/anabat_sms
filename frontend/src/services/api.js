import axios from 'axios';
import branchContext from '../utils/branchContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and branch context
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add branch context if available
    const branchId = branchContext.getBranchId();
    if (branchId) {
      config.headers['X-Branch-Id'] = branchId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and clean responses
api.interceptors.response.use(
  (response) => {
    // Handle cases where PHP errors/warnings corrupt the JSON response
    if (typeof response.data === 'string' && response.data.includes('{')) {
      try {
        // Extract JSON from corrupted response
        const jsonStart = response.data.indexOf('{');
        const jsonString = response.data.substring(jsonStart);
        response.data = JSON.parse(jsonString);
      } catch (e) {
        console.error('Failed to parse response:', e);
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data.message);
      }

      // Handle 500 Server Error
      if (error.response.status === 500) {
        console.error('Server error:', error.response.data.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
