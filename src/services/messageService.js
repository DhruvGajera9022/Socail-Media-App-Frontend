import api from './api';

const messageService = {
    // Get all conversations
    getConversations: async (page = 1, limit = 10) => {
        const response = await api.get(`/messages/conversations?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get messages in a conversation
    getMessages: async (conversationId, page = 1, limit = 20) => {
        const response = await api.get(`/messages/conversations/${conversationId}?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Send a message
    sendMessage: async (conversationId, content, attachments = []) => {
        const formData = new FormData();
        formData.append('content', content);
        attachments.forEach(file => {
            formData.append('attachments', file);
        });

        const response = await api.post(`/messages/conversations/${conversationId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Create a new conversation
    createConversation: async (userId) => {
        const response = await api.post('/messages/conversations', { userId });
        return response.data;
    },

    // Mark conversation as read
    markConversationAsRead: async (conversationId) => {
        const response = await api.put(`/messages/conversations/${conversationId}/read`);
        return response.data;
    },

    // Delete a message
    deleteMessage: async (messageId) => {
        const response = await api.delete(`/messages/${messageId}`);
        return response.data;
    },

    // Delete a conversation
    deleteConversation: async (conversationId) => {
        const response = await api.delete(`/messages/conversations/${conversationId}`);
        return response.data;
    },

    // Search conversations
    searchConversations: async (query, page = 1, limit = 10) => {
        const response = await api.get(`/messages/conversations/search?q=${query}&page=${page}&limit=${limit}`);
        return response.data;
    }
};

export default messageService; 