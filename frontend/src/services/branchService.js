import api from './api';

const branchService = {
  // Get all branches
  getAllBranches: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/branches?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get active branches only
  getActiveBranches: async () => {
    try {
      const response = await api.get('/branches/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get branch by ID
  getBranchById: async (id) => {
    try {
      const response = await api.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new branch
  createBranch: async (branchData) => {
    try {
      const response = await api.post('/branches', branchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update branch
  updateBranch: async (id, branchData) => {
    try {
      const response = await api.put(`/branches/${id}`, branchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete branch
  deleteBranch: async (id) => {
    try {
      const response = await api.delete(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Activate branch
  activateBranch: async (id) => {
    try {
      const response = await api.post(`/branches/${id}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Deactivate branch
  deactivateBranch: async (id) => {
    try {
      const response = await api.post(`/branches/${id}/deactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get branch settings
  getBranchSettings: async (id) => {
    try {
      const response = await api.get(`/branches/${id}/settings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update branch settings
  updateBranchSettings: async (id, settings) => {
    try {
      const response = await api.put(`/branches/${id}/settings`, { settings });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get branch statistics
  getBranchStatistics: async (id) => {
    try {
      const response = await api.get(`/branches/${id}/statistics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default branchService;
