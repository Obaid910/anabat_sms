import api from './api';

const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      // Store expires_at if present
      if (response.data.data.expires_at) {
        localStorage.setItem('token_expires_at', response.data.data.expires_at);
      }
    }
    // Return the data object which contains {user, token, expires_at}
    return response.data.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/me');
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/refresh');
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      if (response.data.data.expires_at) {
        localStorage.setItem('token_expires_at', response.data.data.expires_at);
      }
    }
    return response.data.data;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data; // Returns {success, message}
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await api.post('/reset-password', data);
    return response.data; // Returns {success, message}
  },

  // Change password
  changePassword: async (currentPassword, newPassword, passwordConfirmation) => {
    const response = await api.post('/change-password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: passwordConfirmation,
    });
    return response.data; // Returns {success, message}
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Get activity log
  getActivityLog: async (perPage = 15) => {
    const response = await api.get(`/activity-log?per_page=${perPage}`);
    return response.data; // Returns {success, data: pagination}
  },
};

export default authService;
