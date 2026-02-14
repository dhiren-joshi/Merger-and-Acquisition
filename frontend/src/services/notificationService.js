import api from './api';

const notificationService = {
    /**
     * Get user's notifications
     */
    getNotifications: async (limit = 20, skip = 0, unreadOnly = false) => {
        const response = await api.get('/notifications', {
            params: { limit, skip, unreadOnly }
        });
        return response.data;
    },

    /**
     * Get unread notification count
     */
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async () => {
        const response = await api.patch('/notifications/mark-all-read');
        return response.data;
    },

    /**
     * Delete notification
     */
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    }
};

export default notificationService;
