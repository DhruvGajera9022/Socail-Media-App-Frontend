import { useState, useEffect } from 'react';
import postService from '../services/postService';

const usePosts = (type = 'all', userId = null) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;

    useEffect(() => {
        loadPosts();
    }, [type, userId, page]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            let response;

            switch (type) {
                case 'feed':
                    response = await postService.getFeed(page, limit);
                    break;
                case 'user':
                    response = await postService.getUserPosts(userId, page, limit);
                    break;
                case 'saved':
                    response = await postService.getSavedPosts(page, limit);
                    break;
                default:
                    response = await postService.getPosts(page, limit);
            }

            setPosts(prev => page === 1 ? response.posts : [...prev, ...response.posts]);
            setHasMore(response.posts.length === limit);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (content, images) => {
        try {
            setLoading(true);
            setError(null);
            const newPost = await postService.createPost(content, images);
            setPosts(prev => [newPost, ...prev]);
            return newPost;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (postId, content) => {
        try {
            setLoading(true);
            setError(null);
            const updatedPost = await postService.updatePost(postId, content);
            setPosts(prev => prev.map(post =>
                post.id === postId ? updatedPost : post
            ));
            return updatedPost;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (postId) => {
        try {
            setLoading(true);
            setError(null);
            await postService.deletePost(postId);
            setPosts(prev => prev.filter(post => post.id !== postId));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const likePost = async (postId) => {
        try {
            setError(null);
            const updatedPost = await postService.likePost(postId);
            setPosts(prev => prev.map(post =>
                post.id === postId ? updatedPost : post
            ));
            return updatedPost;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const unlikePost = async (postId) => {
        try {
            setError(null);
            const updatedPost = await postService.unlikePost(postId);
            setPosts(prev => prev.map(post =>
                post.id === postId ? updatedPost : post
            ));
            return updatedPost;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addComment = async (postId, content) => {
        try {
            setError(null);
            const updatedPost = await postService.addComment(postId, content);
            setPosts(prev => prev.map(post =>
                post.id === postId ? updatedPost : post
            ));
            return updatedPost;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteComment = async (postId, commentId) => {
        try {
            setError(null);
            const updatedPost = await postService.deleteComment(postId, commentId);
            setPosts(prev => prev.map(post =>
                post.id === postId ? updatedPost : post
            ));
            return updatedPost;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const refresh = () => {
        setPage(1);
        setPosts([]);
        loadPosts();
    };

    return {
        posts,
        loading,
        error,
        hasMore,
        createPost,
        updatePost,
        deletePost,
        likePost,
        unlikePost,
        addComment,
        deleteComment,
        loadMore,
        refresh
    };
};

export default usePosts; 