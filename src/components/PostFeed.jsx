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
const PostFeed = ({ isDarkMode }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/post`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        const uniquePosts = removeDuplicatePosts(data.data);
        setPosts(uniquePosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const removeDuplicatePosts = (postsArray) => {
    const map = new Map();
    postsArray.forEach((post) => map.set(post.id, post));
    return Array.from(map.values());
  };

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-200";

  return (
    <div className={`max-w-2xl mx-auto pt-6 pb-20 ${themeClasses}`}>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2">Loading posts...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading &&
        !error &&
        (posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} isDarkMode={isDarkMode} />
            ))}
          </div>
        ))}
    </div>
  );
};

// Individual Post Component
const Post = ({ post, isDarkMode }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");

  const accessToken = localStorage.getItem("accessToken");

  const mediaUrls = Array.isArray(post.media_url)
    ? post.media_url
    : post.media_url
    ? [post.media_url]
    : [];
  const hasMultipleImages = mediaUrls.length > 1;

  const postTheme = isDarkMode
    ? {
        container: "bg-gray-800 text-white border-gray-700",
        text: "text-white",
        secondaryText: "text-gray-400",
        border: "border-gray-700",
        hover: "hover:bg-gray-700",
        icon: "text-gray-300",
      }
    : {
        container: "bg-white text-gray-800 border-gray-200",
        text: "text-gray-800",
        secondaryText: "text-gray-500",
        border: "border-gray-100",
        hover: "hover:bg-gray-100",
        icon: "text-gray-600",
      };

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!accessToken) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/post/${post.id}/like/status`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
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
    if (!accessToken) return;
    try {
      const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newLikeCount);
      setLiked(!liked);

      const response = await fetch(`${API_BASE_URL}/post/${post.id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        setLikeCount(likeCount);
        setLiked(liked);
        throw new Error("Failed to update like status");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const toggleSave = async () => {
    if (!accessToken) return;
    try {
      setSaved(!saved);

      const response = await fetch(`${API_BASE_URL}/post/${post.id}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ saved: !saved }),
      });

      if (!response.ok) {
        setSaved(saved);
        throw new Error("Failed to update bookmark status");
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  const nextImage = () => {
    setSlideDirection("right");
    setCurrentImageIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const prevImage = () => {
    setSlideDirection("left");
    setCurrentImageIndex(
      (prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length
    );
  };

  const goToImage = (index) => {
    setSlideDirection(index > currentImageIndex ? "right" : "left");
    setCurrentImageIndex(index);
  };

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

  if (!accessToken) {
    return (
      <div
        className={`${postTheme.container} rounded-lg shadow-md p-4 text-center`}
      >
        Please log in to view posts
      </div>
    );
  }

  return (
    <div
      className={`${postTheme.container} rounded-lg shadow-md overflow-hidden border ${postTheme.border}`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src={post.user?.profile_picture || "/api/placeholder/40/40"}
            alt={post.user?.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className={`font-medium ${postTheme.text}`}>
                {post.user?.firstName || "User"}
              </h3>
              <span className={`${postTheme.secondaryText} text-sm ml-2`}>
                @{post.user?.lastName || "user"}
              </span>
              {post.pinned && (
                <div className="ml-2 flex items-center text-blue-400 text-xs">
                  <Pin size={12} className="mr-1" />
                  <span>Pinned</span>
                </div>
              )}
            </div>
            <p className={`text-xs ${postTheme.secondaryText}`}>
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        <button className={postTheme.icon}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {post.title && (
        <div className="px-4 pb-2">
          <h2 className={`font-bold text-lg ${postTheme.text}`}>
            {post.title}
          </h2>
        </div>
      )}

      <div className="px-4 pb-4">
        <p className={`${postTheme.text} whitespace-pre-line`}>
          {post.content}
        </p>
      </div>

      {mediaUrls.length > 0 && (
        <div className="relative w-full bg-gray-100 dark:bg-gray-700">
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
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: slideDirection === "right" ? -100 : 100,
                }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

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

      <div
        className={`px-4 py-2 ${postTheme.border} text-sm ${postTheme.secondaryText} flex items-center`}
      >
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

      <div className={`px-4 py-2 ${postTheme.border} flex justify-between`}>
        <button
          onClick={toggleLike}
          className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
            liked
              ? "text-red-500 bg-red-100 dark:bg-red-900"
              : `${postTheme.icon} ${postTheme.hover}`
          }`}
        >
          <Heart size={18} className={liked ? "fill-current" : ""} />
          <span className="ml-2">Like</span>
        </button>

        <button
          className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${postTheme.icon} ${postTheme.hover}`}
        >
          <MessageCircle size={18} />
          <span className="ml-2">Comment</span>
        </button>

        <button
          className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${postTheme.icon} ${postTheme.hover}`}
        >
          <Share2 size={18} />
          <span className="ml-2">Share</span>
        </button>

        <button
          onClick={toggleSave}
          className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
            saved
              ? "text-blue-500 bg-blue-100 dark:bg-blue-900"
              : `${postTheme.icon} ${postTheme.hover}`
          }`}
        >
          <Bookmark size={18} className={saved ? "fill-current" : ""} />
          <span className="ml-2">Save</span>
        </button>
      </div>

      {post.updated_at !== post.created_at && (
        <div
          className={`px-4 py-1 text-xs ${postTheme.secondaryText} ${postTheme.border}`}
        >
          Edited {formatDate(post.updated_at)}
        </div>
      )}
    </div>
  );
};

export default PostFeed;
