import api from './api';

const postService = {
    // Get all posts with pagination
    getPosts: async (page = 1, limit = 10) => {
        const response = await api.get(`/posts?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get a single post
    getPost: async (postId) => {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    },

    // Create a new post
    createPost: async (content, images = []) => {
        const formData = new FormData();
        formData.append('content', content);
        images.forEach(image => {
            formData.append('images', image);
        });

        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update a post
    updatePost: async (postId, content) => {
        const response = await api.put(`/posts/${postId}`, { content });
        return response.data;
    },

    // Delete a post
    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },

    // Like a post
    likePost: async (postId) => {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data;
    },

    // Unlike a post
    unlikePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}/like`);
        return response.data;
    },

    // Get comments for a post
    getComments: async (postId, page = 1, limit = 10) => {
        const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Add a comment to a post
    addComment: async (postId, content) => {
        const response = await api.post(`/posts/${postId}/comments`, { content });
        return response.data;
    },

    // Delete a comment
    deleteComment: async (postId, commentId) => {
        const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
        return response.data;
    },

    // Get user's posts
    getUserPosts: async (userId, page = 1, limit = 10) => {
        const response = await api.get(`/users/${userId}/posts?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get feed posts (posts from followed users)
    getFeed: async (page = 1, limit = 10) => {
        const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Search posts
    searchPosts: async (query, page = 1, limit = 10) => {
        const response = await api.get(`/posts/search?q=${query}&page=${page}&limit=${limit}`);
        return response.data;
    },

    // Save a post
    savePost: async (id) => {
        const response = await api.post(`/posts/${id}/save`);
        return response.data;
    },

    // Unsave a post
    unsavePost: async (id) => {
        const response = await api.delete(`/posts/${id}/save`);
        return response.data;
    },

    // Get saved posts
    getSavedPosts: async (page = 1, limit = 10) => {
        const response = await api.get(`/posts/saved?page=${page}&limit=${limit}`);
        return response.data;
    }
};

export default postService; 