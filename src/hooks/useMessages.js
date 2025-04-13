import { useState, useEffect } from 'react';
import messageService from '../services/messageService';

const useMessages = (conversationId = null) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    useEffect(() => {
        loadConversations();
    }, [page]);

    useEffect(() => {
        if (conversationId) {
            loadMessages();
        }
    }, [conversationId, page]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await messageService.getConversations(page, limit);
            setConversations(prev => page === 1 ? response.conversations : [...prev, ...response.conversations]);
            setHasMore(response.conversations.length === limit);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await messageService.getMessages(conversationId, page, limit);
            setMessages(prev => page === 1 ? response.messages : [...prev, ...response.messages]);
            setHasMore(response.messages.length === limit);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content, attachments = []) => {
        try {
            setError(null);
            const newMessage = await messageService.sendMessage(conversationId, content, attachments);
            setMessages(prev => [...prev, newMessage]);
            return newMessage;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const createConversation = async (userId) => {
        try {
            setError(null);
            const newConversation = await messageService.createConversation(userId);
            setConversations(prev => [newConversation, ...prev]);
            return newConversation;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            setError(null);
            await messageService.deleteMessage(messageId);
            setMessages(prev => prev.filter(message => message.id !== messageId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            setError(null);
            await messageService.deleteConversation(conversationId);
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const markAsRead = async (conversationId) => {
        try {
            setError(null);
            await messageService.markConversationAsRead(conversationId);
            setConversations(prev => prev.map(conv =>
                conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const searchConversations = async (query) => {
        try {
            setLoading(true);
            setError(null);
            const response = await messageService.searchConversations(query);
            setConversations(response.conversations);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const refresh = () => {
        setPage(1);
        if (conversationId) {
            setMessages([]);
            loadMessages();
        } else {
            setConversations([]);
            loadConversations();
        }
    };

    return {
        conversations,
        messages,
        loading,
        error,
        hasMore,
        sendMessage,
        createConversation,
        deleteMessage,
        deleteConversation,
        markAsRead,
        searchConversations,
        loadMore,
        refresh
    };
};

export default useMessages; 