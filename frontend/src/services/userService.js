import api from './api';

const userService = {
  // Get all users with filters
  getAllUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.branch_id) params.append('branch_id', filters.branch_id);
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);
      if (filters.per_page) params.append('per_page', filters.per_page);
      
      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.patch(`/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign roles to user
  assignRoles: async (id, roles) => {
    try {
      const response = await api.post(`/users/${id}/roles`, { roles });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign permissions to user
  assignPermissions: async (id, permissions) => {
    try {
      const response = await api.post(`/users/${id}/permissions`, { permissions });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user activity log
  getUserActivityLog: async (id, perPage = 15) => {
    try {
      const response = await api.get(`/users/${id}/activity-log?per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reset user password (admin)
  resetUserPassword: async (id, password, passwordConfirmation) => {
    try {
      const response = await api.post(`/users/${id}/reset-password`, {
        password,
        password_confirmation: passwordConfirmation,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user sessions
  getUserSessions: async (id) => {
    try {
      const response = await api.get(`/users/${id}/sessions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Revoke specific session
  revokeSession: async (userId, tokenId) => {
    try {
      const response = await api.delete(`/users/${userId}/sessions/${tokenId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Revoke all sessions
  revokeAllSessions: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}/sessions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all roles
  getRoles: async () => {
    try {
      const response = await api.get('/users/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all permissions
  getPermissions: async () => {
    try {
      const response = await api.get('/users/permissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService;
