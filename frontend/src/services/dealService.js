import api from './api';

/**
 * Deals service
 */
const dealService = {
    /**
     * Get all deals with filters
     */
    getDeals: async (params = {}) => {
        const response = await api.get('/deals', { params });
        return response.data;
    },

    /**
     * Get single deal by ID
     */
    getDeal: async (dealId) => {
        const response = await api.get(`/deals/${dealId}`);
        return response.data;
    },

    /**
     * Create new deal
     */
    createDeal: async (dealData) => {
        const response = await api.post('/deals', dealData);
        return response.data;
    },

    /**
     * Update deal
     */
    updateDeal: async (dealId, dealData) => {
        const response = await api.put(`/deals/${dealId}`, dealData);
        return response.data;
    },

    /**
     * Delete deal
     */
    deleteDeal: async (dealId) => {
        const response = await api.delete(`/deals/${dealId}`);
        return response.data;
    },

    /**
     * Update deal stage
     */
    updateDealStage: async (dealId, stage) => {
        const response = await api.patch(`/deals/${dealId}/stage`, { stage });
        return response.data;
    },

    /**
     * Assign deal to an analyst (Manager only)
     */
    assignDeal: async (dealId, analystId) => {
        const response = await api.post(`/deals/${dealId}/assign`, { analystId });
        return response.data;
    },

    /**
     * Reassign deal to another analyst (Manager only)
     */
    reassignDeal: async (dealId, analystId) => {
        const response = await api.patch(`/deals/${dealId}/reassign`, { analystId });
        return response.data;
    },

    /**
     * Update assignment status (Analyst can update their own)
     */
    updateAssignmentStatus: async (dealId, status) => {
        const response = await api.patch(`/deals/${dealId}/assignment-status`, { status });
        return response.data;
    },

    /**
     * Add note to deal
     */
    addNote: async (dealId, content) => {
        const response = await api.post(`/deals/${dealId}/notes`, { content });
        return response.data;
    },

    /**
     * Get pipeline analytics
     */
    getPipelineAnalytics: async () => {
        const response = await api.get('/analytics/pipeline');
        return response.data;
    }
};

export default dealService;
