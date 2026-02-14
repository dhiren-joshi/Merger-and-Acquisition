import api from './api';

const BASE_URL = '/activity';

const activityService = {
    /**
     * Get activity logs for a specific deal
     */
    getDealActivity: async (dealId, limit = 50, skip = 0) => {
        const response = await api.get(`${BASE_URL}/deal/${dealId}`, {
            params: { limit, skip }
        });
        return response.data;
    },

    /**
     * Get current user's activity history
     */
    getUserActivity: async (limit = 20) => {
        const response = await api.get(`${BASE_URL}/user`, {
            params: { limit }
        });
        return response.data;
    },

    /**
     * Get team activity (managers only)
     */
    getTeamActivity: async (limit = 50) => {
        const response = await api.get(`${BASE_URL}/team`, {
            params: { limit }
        });
        return response.data;
    }
};

export default activityService;
