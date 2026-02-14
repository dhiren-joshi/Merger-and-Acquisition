import api from './api';

const BASE_URL = '/sharing';

const sharingService = {
    /**
     * Share a deal analysis with users
     */
    shareDealAnalysis: async (dealId, userIds, shareMessage = '', accessLevel = 'view') => {
        const response = await api.post(`${BASE_URL}/share`, {
            dealId,
            userIds,
            shareMessage,
            accessLevel
        });
        return response.data;
    },

    /**
     * Get all shared analyses (created by user or shared with user)
     */
    getSharedAnalyses: async () => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    /**
     * Revoke access to a shared analysis
     */
    revokeAccess: async (shareId, userId) => {
        const response = await api.patch(`${BASE_URL}/${shareId}/revoke/${userId}`);
        return response.data;
    }
};

export default sharingService;
