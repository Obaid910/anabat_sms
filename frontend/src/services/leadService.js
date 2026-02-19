import api from './api';

const leadService = {
  // Get all leads with filters
  getLeads: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  // Get single lead
  getLead: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // Create lead
  createLead: async (data) => {
    const response = await api.post('/leads', data);
    return response.data;
  },

  // Update lead
  updateLead: async (id, data) => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  // Change status
  changeStatus: async (id, status, reason) => {
    const response = await api.patch(`/leads/${id}/status`, { status, reason });
    return response.data;
  },

  // Assign lead
  assignLead: async (id, userId) => {
    const response = await api.post(`/leads/${id}/assign`, { user_id: userId });
    return response.data;
  },

  // Schedule followup
  scheduleFollowup: async (id, data) => {
    const response = await api.post(`/leads/${id}/followup`, data);
    return response.data;
  },

  // Complete followup
  completeFollowup: async (leadId, followupId, data) => {
    const response = await api.patch(`/leads/${leadId}/followup/${followupId}`, data);
    return response.data;
  },

  // Convert to student
  convertToStudent: async (id, data) => {
    const response = await api.post(`/leads/${id}/convert`, data);
    return response.data;
  },

  // Get leads needing followup
  getNeedsFollowup: async () => {
    const response = await api.get('/leads/needs-followup');
    return response.data;
  },

  // Get analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/leads/analytics', { params });
    return response.data;
  },

  // Import leads
  importLeads: async (branchId, leads) => {
    const response = await api.post('/leads/import', { branch_id: branchId, leads });
    return response.data;
  },

  // Export leads
  exportLeads: async (params = {}) => {
    const response = await api.get('/leads/export', { params });
    return response.data;
  },
};

export default leadService;
