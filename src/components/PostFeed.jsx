import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Pin,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Globe,
  Clock,
  Loader2,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const POSTS_PER_PAGE = 10;

// Main Post Feed Component
const PostFeed = ({ isDarkMode }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const lastPostElementRef = useRef(null);

  // Function to fetch posts with pagination
  const fetchPosts = async (pageNum) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `${API_BASE_URL}/post?page=${pageNum}&limit=${POSTS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();

      // Check if we have more posts to load
      if (data.data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      // Remove duplicates and append new posts
      const newPosts = removeDuplicatePosts(data.data);
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [posts, hasMore]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading && !loadingMore) {
      setPage((prevPage) => prevPage + 1);
      fetchPosts(page + 1);
    }
  };

  const removeDuplicatePosts = (postsArray) => {
    const map = new Map();
    postsArray.forEach((post) => map.set(post.id, post));
    return Array.from(map.values());
  };

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-800";

  return (
    <div className={`max-w-2xl mx-auto pt-6 pb-20 ${themeClasses}`}>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-10"
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2">Loading posts...</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </motion.div>
      )}

      {!loading &&
        !error &&
        (posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No posts available
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Be the first to share something with your network!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
              >
                <Post post={post} isDarkMode={isDarkMode} />
              </motion.div>
            ))}

            {/* Loading indicator for more posts */}
            {loadingMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-6"
              >
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
                <span className="text-gray-500 dark:text-gray-400">
                  Loading more posts...
                </span>
              </motion.div>
            )}

            {/* No more posts indicator */}
            {!hasMore && posts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 text-gray-500 dark:text-gray-400"
              >
                No more posts to load
              </motion.div>
            )}
          </motion.div>
        ))}
    </div>
  );
};

// Helper function to check if a URL is a video
const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Media Component (renders either image or video)
const MediaItem = ({ url, currentIndex, slideDirection }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Reset video state when currentIndex changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent triggering play/pause
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isVideoUrl(url)) {
    return (
      <motion.div
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
        className="relative w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video
          ref={videoRef}
          src={url}
          className="w-full h-auto rounded-lg object-cover"
          onClick={togglePlay}
          muted={isMuted}
          controls={false}
          preload="metadata"
          poster={`${url}#t=0.1`}
        />

        {/* Video Controls Overlay - Only shows hover controls, no darkening */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Center play button - only shown when not playing and hovering */}
          {!isPlaying && isHovering && (
            <button
              onClick={togglePlay}
              className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              <Play size={24} />
            </button>
          )}
        </div>

        {/* Bottom Controls - Only visible on hover */}
        {isHovering && (
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              onClick={toggleMute}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.img
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
      src={url}
      alt={`Post media ${currentIndex + 1}`}
      className="w-full h-auto object-cover rounded-lg"
    />
  );
};

// Individual Post Component
const Post = ({ post, isDarkMode }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");
  const [showActions, setShowActions] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  // Format media URLs and check if they're videos or images
  const mediaUrls = Array.isArray(post.media_url)
    ? post.media_url
    : post.media_url
    ? [post.media_url]
    : [];
  const hasMultipleMedia = mediaUrls.length > 1;

  const postTheme = isDarkMode
    ? {
        container: "bg-gray-800 text-white border-gray-700",
        text: "text-white",
        secondaryText: "text-gray-400",
        border: "border-gray-700",
        hover: "hover:bg-gray-700",
        icon: "text-gray-300",
        card: "bg-gray-800",
        input: "bg-gray-700 text-white",
      }
    : {
        container: "bg-white text-gray-800 border-gray-200",
        text: "text-gray-800",
        secondaryText: "text-gray-500",
        border: "border-gray-100",
        hover: "hover:bg-gray-50",
        icon: "text-gray-600",
        card: "bg-white",
        input: "bg-gray-50 text-gray-800",
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
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!accessToken) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${postTheme.container} rounded-xl shadow-lg p-6 text-center`}
      >
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <Globe className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 dark:text-gray-300">
            Please log in to view posts
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`${postTheme.container} rounded-xl shadow-lg overflow-hidden border ${postTheme.border}`}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={post.user?.profile_picture || "/api/placeholder/40/40"}
            alt={post.user?.name || "User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className={`font-semibold ${postTheme.text}`}>
                {post.user?.username || "User"}
              </h3>
              {post.pinned && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-2 flex items-center text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded-full"
                >
                  <Pin size={12} className="mr-1" />
                  <span>Pinned</span>
                </motion.div>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className={`p-2 rounded-full ${postTheme.hover}`}
        >
          <MoreHorizontal className={postTheme.icon} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className={`${postTheme.text} text-lg mb-4`}>{post.content}</p>

        {/* Media Content - Now supports both images and videos */}
        {mediaUrls.length > 0 && (
          <div className="relative rounded-xl overflow-hidden mb-4">
            <AnimatePresence mode="wait">
              <MediaItem
                url={mediaUrls[currentImageIndex]}
                currentIndex={currentImageIndex}
                slideDirection={slideDirection}
              />
            </AnimatePresence>

            {/* Media Navigation */}
            {hasMultipleMedia && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {mediaUrls.map((url, index) => {
                    const isVideo = isVideoUrl(url);
                    return (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-colors flex items-center justify-center ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      >
                        {/* Optional: can add a tiny video indicator here */}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleLike}
              className={`flex items-center space-x-1 ${
                liked ? "text-red-500" : postTheme.icon
              }`}
            >
              <Heart size={20} className={liked ? "fill-current" : ""} />
              <span>{likeCount}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-1 ${postTheme.icon}`}
            >
              <MessageCircle size={20} />
              <span>{post.comments_count || 0}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-1 ${postTheme.icon}`}
            >
              <Share2 size={20} />
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleSave}
            className={`flex items-center space-x-1 ${
              saved ? "text-blue-500" : postTheme.icon
            }`}
          >
            <Bookmark size={20} className={saved ? "fill-current" : ""} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostFeed;
