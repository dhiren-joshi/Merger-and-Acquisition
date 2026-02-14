import api from './api';

/**
 * Authentication service
 */
const authService = {
    /**
     * Register new user
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Get current user
     */
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Get current user's role
     */
    getUserRole: () => {
        const user = authService.getCurrentUser();
        return user?.role || null;
    },

    /**
     * Check if current user is a Manager
     */
    isManager: () => {
        return authService.getUserRole() === 'Manager';
    },

    /**
     * Check if current user is an Analyst
     */
    isAnalyst: () => {
        return authService.getUserRole() === 'Analyst';
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;
