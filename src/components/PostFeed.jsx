import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Pin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Main Post Feed Component
const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch posts from API
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/post`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        console.log(data.data);

        // Remove duplicate posts by filtering based on post ID
        const uniquePosts = removeDuplicatePosts(data.data);
        setPosts(uniquePosts);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to remove duplicate posts based on ID
  const removeDuplicatePosts = (postsArray) => {
    const uniquePostMap = new Map();

    // Use Map to keep only the latest version of each post by ID
    postsArray.forEach((post) => {
      uniquePostMap.set(post.id, post);
    });

    // Convert Map values back to array
    return Array.from(uniquePostMap.values());
  };

  return (
    <div className="max-w-2xl mx-auto pt-6 pb-20">
      {/* Display loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2">Loading posts...</span>
        </div>
      )}

      {/* Display error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Display posts */}
      {!loading &&
        !error &&
        (posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        ))}
    </div>
  );
};

// Individual Post Component
const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");

  const accessToken = localStorage.getItem("accessToken");

  // Handle multiple images - if post.media_urls is available use that, otherwise wrap the single media_url in an array
  const mediaUrls = post.media_url || (post.media_url ? [post.media_url] : []);
  const hasMultipleImages = mediaUrls.length > 1;

  // Check if user already liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/post/${post.id}/like/status`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked || false);
        }
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    };

    checkLikeStatus();
  }, [post.id, accessToken]);

  const toggleLike = async () => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      // Optimistically update UI
      const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newLikeCount);
      setLiked(!liked);

      // Send request to API to update like status
      const response = await fetch(`${API_BASE_URL}/post/${post.id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // Revert optimistic update if request fails
        setLikeCount(likeCount);
        setLiked(liked);
        throw new Error("Failed to update like status");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const toggleSave = async () => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      // Optimistically update UI
      setSaved(!saved);

      // Send request to API to update bookmark status
      const response = await fetch(`${API_BASE_URL}/post/${post.id}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ saved: !saved }),
      });

      if (!response.ok) {
        // Revert optimistic update if request fails
        setSaved(saved);
        throw new Error("Failed to update bookmark status");
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  // Navigation functions for image carousel
  const nextImage = () => {
    setSlideDirection("right");
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mediaUrls.length);
  };

  const prevImage = () => {
    setSlideDirection("left");
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + mediaUrls.length) % mediaUrls.length
    );
  };

  const goToImage = (index) => {
    setSlideDirection(index > currentImageIndex ? "right" : "left");
    setCurrentImageIndex(index);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Return early if no access token - moved here to avoid functional issues
  if (!accessToken) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        Please log in to view posts
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src={post.user?.profile_picture || "/api/placeholder/40/40"}
            alt={post.user?.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800">
                {post.user?.firstName || "User"}
              </h3>
              <span className="text-gray-500 text-sm ml-2">
                @{post.user?.lastName || "user"}
              </span>
              {post.pinned && (
                <div className="ml-2 flex items-center text-blue-600 text-xs">
                  <Pin size={12} className="mr-1" />
                  <span>Pinned</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Title (if available) */}
      {post.title && (
        <div className="px-4 pb-2">
          <h2 className="font-bold text-lg text-gray-900">{post.title}</h2>
        </div>
      )}

      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>

      {/* Post Media Carousel (if available) */}
      {mediaUrls.length > 0 && (
        <div className="relative w-full bg-gray-100">
          {/* Image Container */}
          <div className="overflow-hidden relative h-64">
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentImageIndex}
                src={mediaUrls[currentImageIndex]}
                alt={`Post content ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{
                  opacity: 0,
                  x: slideDirection === "right" ? 100 : -100,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: slideDirection === "right" ? -100 : 100,
                }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Navigation Arrows (only if multiple images) */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Indicators (dots) for multiple images */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {mediaUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index
                      ? "bg-white w-3"
                      : "bg-white bg-opacity-60"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-100 text-sm text-gray-500 flex items-center">
        <div className="flex items-center mr-4">
          <Heart size={16} className="mr-1" />
          <span>{likeCount} likes</span>
        </div>
        <div className="flex items-center">
          <MessageCircle size={16} className="mr-1" />
          <span>Comments</span>
        </div>
        <div className="ml-auto flex items-center">
          <span>{post.views_count} views</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-100 flex justify-between">
        <button
          onClick={toggleLike}
          className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
            liked ? "text-red-500 bg-red-50" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Heart size={18} className={liked ? "fill-current" : ""} />
          <span className="ml-2">Like</span>
        </button>

        <button className="flex items-center justify-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
          <MessageCircle size={18} />
          <span className="ml-2">Comment</span>
        </button>

        <button className="flex items-center justify-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
          <Share2 size={18} />
          <span className="ml-2">Share</span>
        </button>

        <button
          onClick={toggleSave}
          className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
            saved
              ? "text-blue-500 bg-blue-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Bookmark size={18} className={saved ? "fill-current" : ""} />
          <span className="ml-2">Save</span>
        </button>
      </div>

      {/* Post updated indicator */}
      {post.updated_at !== post.created_at && (
        <div className="px-4 py-1 text-xs text-gray-500 border-t border-gray-100">
          Edited {formatDate(post.updated_at)}
        </div>
      )}
    </div>
  );
};

export default PostFeed;
