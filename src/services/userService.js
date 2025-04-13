import api from './api';

const userService = {
    // Get user profile
    getUserProfile: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data;
    },

    // Follow a user
    followUser: async (userId) => {
        const response = await api.post(`/users/${userId}/follow`);
        return response.data;
    },

    // Unfollow a user
    unfollowUser: async (userId) => {
        const response = await api.delete(`/users/${userId}/follow`);
        return response.data;
    },

    // Get user's followers
    getFollowers: async (userId, page = 1, limit = 10) => {
        const response = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get user's following
    getFollowing: async (userId, page = 1, limit = 10) => {
        const response = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Search users
    searchUsers: async (query, page = 1, limit = 10) => {
        const response = await api.get(`/users/search?q=${query}&page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get user's notifications
    getNotifications: async (page = 1, limit = 10) => {
        const response = await api.get(`/users/notifications?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Mark notification as read
    markNotificationAsRead: async (notificationId) => {
        const response = await api.put(`/users/notifications/${notificationId}/read`);
        return response.data;
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: async () => {
        const response = await api.put('/users/notifications/read-all');
        return response.data;
    }
};

export default userService; 