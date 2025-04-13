import api from './api';

const authService = {
    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Register user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Verify 2FA
    verify2FA: async (userId, code) => {
        const response = await api.post(`/auth/verify-2fa/${userId}`, { code });
        return response.data;
    },

    // Google OAuth
    googleAuth: async (token) => {
        const response = await api.post('/auth/google', { token });
        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

export default authService; 