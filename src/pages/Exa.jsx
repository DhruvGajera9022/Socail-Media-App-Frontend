import React, { useState, useEffect } from "react";

const Exa = () => {
  // User state with more detailed profile information
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Jane Smith",
    username: "@janesmith",
    avatar: "/api/placeholder/100/100",
    coverPhoto: "/api/placeholder/800/200",
    bio: "Digital creator | Photography enthusiast | Travel lover",
    location: "San Francisco, CA",
    website: "janesmith.design",
    joinDate: "January 2022",
    followers: 1248,
    following: 567,
    posts: 83,
    verified: true,
  });

  // More detailed post data
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/api/placeholder/100/100",
        verified: true,
      },
      content:
        "Just finished my latest photography project! Check out these stunning sunset shots from my recent trip to the mountains. The colors were absolutely breathtaking.",
      images: ["/api/placeholder/600/400", "/api/placeholder/600/400"],
      likes: 234,
      comments: 42,
      shares: 18,
      bookmarks: 76,
      timestamp: "2 hours ago",
      isLiked: false,
      isBookmarked: false,
      tags: ["photography", "nature", "travel"],
    },
    {
      id: 2,
      user: {
        name: "Sarah Parker",
        username: "@sparker",
        avatar: "/api/placeholder/100/100",
        verified: false,
      },
      content:
        "Today's coding session was super productive. Finally implemented that feature I've been working on for weeks! It's amazing how satisfying it feels when code just works exactly as you planned.",
      likes: 156,
      comments: 23,
      shares: 7,
      bookmarks: 31,
      timestamp: "4 hours ago",
      isLiked: true,
      isBookmarked: true,
      tags: ["coding", "webdev", "javascript"],
    },
    {
      id: 3,
      user: currentUser,
      content:
        "Looking for recommendations on the best coffee shops in downtown. Drop your favorites below! I'm especially interested in places with good work atmosphere and reliable WiFi.",
      likes: 89,
      comments: 37,
      shares: 5,
      bookmarks: 12,
      timestamp: "6 hours ago",
      isLiked: false,
      isBookmarked: false,
      tags: ["coffee", "recommendations", "downtown"],
    },
  ]);

  const [stories, setStories] = useState([
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/api/placeholder/100/100",
        username: "@alexj",
      },
      hasUnseenStory: true,
    },
    {
      id: 2,
      user: {
        name: "Sarah Parker",
        avatar: "/api/placeholder/100/100",
        username: "@sparker",
      },
      hasUnseenStory: true,
    },
    {
      id: 3,
      user: {
        name: "Mike Wilson",
        avatar: "/api/placeholder/100/100",
        username: "@mikew",
      },
      hasUnseenStory: true,
    },
    {
      id: 4,
      user: {
        name: "Emily Davis",
        avatar: "/api/placeholder/100/100",
        username: "@emilyd",
      },
      hasUnseenStory: false,
    },
    {
      id: 5,
      user: {
        name: "Chris Lee",
        avatar: "/api/placeholder/100/100",
        username: "@chrisl",
      },
      hasUnseenStory: true,
    },
    {
      id: 6,
      user: {
        name: "Taylor Swift",
        avatar: "/api/placeholder/100/100",
        username: "@taylors",
      },
      hasUnseenStory: false,
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: "Alex Johnson",
      content: "liked your post",
      time: "2m ago",
      read: false,
    },
    {
      id: 2,
      type: "comment",
      user: "Sarah Parker",
      content: "commented on your photo",
      time: "15m ago",
      read: false,
    },
    {
      id: 3,
      type: "follow",
      user: "Mike Wilson",
      content: "started following you",
      time: "1h ago",
      read: true,
    },
    {
      id: 4,
      type: "mention",
      user: "Emily Davis",
      content: "mentioned you in a comment",
      time: "3h ago",
      read: true,
    },
  ]);

  // Active tab state
  const [activeTab, setActiveTab] = useState("home");

  // Notification panel state
  const [showNotifications, setShowNotifications] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Animation states
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Simulate page loading
    setIsPageLoaded(true);

    // Simulate receiving a new notification
    const timer = setTimeout(() => {
      const newNotification = {
        id: notifications.length + 1,
        type: "message",
        user: "Taylor Swift",
        content: "sent you a message",
        time: "Just now",
        read: false,
      };
      setNotifications([newNotification, ...notifications]);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle new post creation
  const handleNewPost = (content, images = [], tags = []) => {
    const newPost = {
      id: posts.length + 1,
      user: currentUser,
      content,
      images,
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
      timestamp: "Just now",
      isLiked: false,
      isBookmarked: false,
      tags,
    };
    setPosts([newPost, ...posts]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        notifications={notifications}
        showNotifications={showNotifications}
        toggleNotifications={toggleNotifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div
        className={`container mx-auto px-4 py-6 transition-opacity duration-500 ${
          isPageLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Profile and Navigation */}
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileCard user={currentUser} darkMode={darkMode} />
            <NavigationMenu
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              darkMode={darkMode}
            />
          </div>

          {/* Main Content - Stories and Post Feed */}
          <div className="w-full lg:w-2/4 space-y-6">
            <StoryCarousel stories={stories} darkMode={darkMode} />
            <CreatePost
              onSubmit={handleNewPost}
              user={currentUser}
              darkMode={darkMode}
            />
            <PostFeed posts={posts} darkMode={darkMode} />
          </div>

          {/* Right Sidebar - Suggestions, Trends, and Events */}
          <div className="w-full lg:w-1/4 space-y-6">
            <SearchBar darkMode={darkMode} />
            <SuggestedUsers darkMode={darkMode} />
            <TrendingTopics darkMode={darkMode} />
            <UpcomingEvents darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* Floating message button */}
      <button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 ${
          darkMode
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <span className="text-xl">💬</span>
      </button>
    </div>
  );
};

// Enhanced Navbar Component
const Navbar = ({
  currentUser,
  darkMode,
  toggleDarkMode,
  notifications,
  showNotifications,
  toggleNotifications,
  activeTab,
  setActiveTab,
}) => {
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <nav
      className={`sticky top-0 z-50 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } shadow-md transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-blue-400" : "text-blue-600"
              } transition-colors duration-300`}
            >
              connect<span className="text-pink-500">Social</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 
                ${
                  activeTab === "home"
                    ? darkMode
                      ? "bg-gray-700 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 
                ${
                  activeTab === "explore"
                    ? darkMode
                      ? "bg-gray-700 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
              <span>🔍</span>
              <span>Explore</span>
            </button>

            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 
                ${
                  activeTab === "bookmarks"
                    ? darkMode
                      ? "bg-gray-700 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
              <span>🔖</span>
              <span>Bookmarks</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                className={`relative p-2 rounded-full transition-colors duration-300 ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
                onClick={toggleNotifications}
              >
                <span className="text-xl">🔔</span>
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2 w-80 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } rounded-md shadow-lg overflow-hidden border transition-colors duration-300`}
                >
                  <div
                    className={`px-4 py-3 border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <h3 className="text-lg font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          } ${
                            notification.read
                              ? ""
                              : darkMode
                              ? "bg-gray-700"
                              : "bg-blue-50"
                          } transition-colors duration-300`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                {notification.type === "like" && "❤️"}
                                {notification.type === "comment" && "💬"}
                                {notification.type === "follow" && "👤"}
                                {notification.type === "mention" && "@"}
                                {notification.type === "message" && "✉️"}
                              </div>
                            </div>
                            <div>
                              <p
                                className={`font-medium ${
                                  darkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                              >
                                <span className="font-bold">
                                  {notification.user}
                                </span>{" "}
                                {notification.content}
                              </p>
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 text-center border-t ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <button
                      className={`text-sm ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      } hover:underline`}
                    >
                      See all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span>{darkMode ? "🌙" : "☀️"}</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                className={`flex items-center space-x-2 ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } rounded-full transition-colors duration-300`}
              >
                <img
                  className="h-10 w-10 rounded-full border-2 border-blue-500"
                  src={currentUser.avatar}
                  alt="User profile"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Profile Card
const ProfileCard = ({ user, darkMode }) => {
  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}
    >
      {/* Cover Photo */}
      <div className="h-32 w-full relative">
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-12 left-4">
          <div
            className={`rounded-full border-4 ${
              darkMode ? "border-gray-800" : "border-white"
            } overflow-hidden h-24 w-24 transition-colors duration-300`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-14 p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h2 className="font-bold text-xl">{user.name}</h2>
              {user.verified && (
                <span className="ml-1 text-blue-500" title="Verified">
                  ✓
                </span>
              )}
            </div>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              {user.username}
            </p>
          </div>

          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Edit Profile
          </button>
        </div>

        <p
          className={`mt-3 ${
            darkMode ? "text-gray-300" : "text-gray-800"
          } text-sm`}
        >
          {user.bio}
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm">
            <span className="mr-2">📍</span>
            <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {user.location}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <span className="mr-2">🔗</span>
            <a
              href="#"
              className={`${
                darkMode ? "text-blue-400" : "text-blue-600"
              } hover:underline`}
            >
              {user.website}
            </a>
          </div>

          <div className="flex items-center text-sm">
            <span className="mr-2">📅</span>
            <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Joined {user.joinDate}
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="font-bold">{user.posts}</p>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Posts
            </p>
          </div>
          <div>
            <p className="font-bold">{user.followers}</p>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Followers
            </p>
          </div>
          <div>
            <p className="font-bold">{user.following}</p>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Following
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Menu
const NavigationMenu = ({ activeTab, setActiveTab, darkMode }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "explore", label: "Explore", icon: "🔍" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "messages", label: "Messages", icon: "✉️" },
    { id: "bookmarks", label: "Bookmarks", icon: "🔖" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}
    >
      <div className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 ${
              activeTab === item.id
                ? darkMode
                  ? "bg-gray-700 text-blue-400"
                  : "bg-blue-50 text-blue-600"
                : darkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Story Carousel
const StoryCarousel = ({ stories, darkMode }) => {
  return (
    <div
      className={`rounded-xl shadow-md transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border p-4`}
    >
      <h3 className="font-semibold mb-4">Stories</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add your own story */}
        <div className="flex-shrink-0 flex flex-col items-center space-y-1">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
              darkMode
                ? "border-gray-700 bg-gray-700"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <span className="text-2xl">+</span>
          </div>
          <span className="text-xs text-center">Add Story</span>
        </div>

        {/* User stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 flex flex-col items-center space-y-1"
          >
            <div
              className={`w-16 h-16 rounded-full ${
                story.hasUnseenStory ? "ring-2 ring-blue-500 p-0.5" : ""
              }`}
            >
              <img
                src={story.user.avatar}
                alt={story.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-center truncate w-16">
              {story.user.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Bar
const SearchBar = ({ darkMode }) => {
  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border p-4`}
    >
      <div
        className={`flex items-center px-3 py-2 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        } transition-colors duration-300`}
      >
        <span className="text-gray-400 mr-2">🔍</span>
        <input
          type="text"
          placeholder="Search..."
          className={`bg-transparent focus:outline-none w-full ${
            darkMode
              ? "text-white placeholder-gray-500"
              : "text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>
    </div>
  );
};

// Enhanced Create Post Component
const CreatePost = ({ onSubmit, user, darkMode }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    // Extract hashtags
    const hashtags = content.match(/#[\w]+/g) || [];
    const tags = hashtags.map((tag) => tag.slice(1));

    onSubmit(content, images, tags);
    setContent("");
    setImages([]);
    setIsExpanded(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const expandInput = () => {
    setIsExpanded(true);
  };

  // Mock function to add image
  const addImage = () => {
    if (images.length < 4) {
      setImages([...images, "/api/placeholder/600/400"]);
    }
  };

  // Mock function to remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border p-4`}
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex-grow">
          <form onSubmit={handleSubmit}>
            <div
              className={`border ${
                darkMode
                  ? "border-gray-700 bg-gray-700"
                  : "border-gray-200 bg-gray-50"
              } rounded-lg overflow-hidden transition-colors duration-300`}
              onClick={expandInput}
            >
              <textarea
                className={`w-full p-3 focus:outline-none resize-none ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 text-gray-900 placeholder-gray-500"
                } transition-colors duration-300`}
                placeholder="What's happening?"
                rows={isExpanded ? "4" : "2"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>

              {images.length > 0 && (
                <div
                  className={`px-3 pb-3 ${
                    images.length > 1 ? "grid grid-cols-2 gap-2" : ""
                  }`}
                >
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden"
                    >
                      <img
                        src={img}
                        alt="Post attachment"
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isExpanded && (
              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      darkMode
                        ? "hover:bg-gray-700 text-blue-400"
                        : "hover:bg-gray-100 text-blue-600"
                    }`}
                    onClick={addImage}
                    disabled={images.length >= 4}
                  >
                    <span>🖼️</span>
                  </button>
                  <button
                    type="button"
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      darkMode
                        ? "hover:bg-gray-700 text-blue-400"
                        : "hover:bg-gray-100 text-blue-600"
                    }`}
                    onClick={toggleEmojiPicker}
                  >
                    <span>😊</span>
                  </button>
                  <button
                    type="button"
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      darkMode
                        ? "hover:bg-gray-700 text-blue-400"
                        : "hover:bg-gray-100 text-blue-600"
                    }`}
                  >
                    <span>📊</span>
                  </button>
                  <button
                    type="button"
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      darkMode
                        ? "hover:bg-gray-700 text-blue-400"
                        : "hover:bg-gray-100 text-blue-600"
                    }`}
                  >
                    <span>📍</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!content.trim() && images.length === 0}
                  className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 ${
                    content.trim() || images.length > 0
                      ? darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>
            )}
            {showEmojiPicker && (
              <div
                className={`mt-2 p-2 rounded-lg shadow-lg ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
              >
                <div className="grid grid-cols-8 gap-2">
                  {[
                    "😊",
                    "😂",
                    "❤️",
                    "👍",
                    "🔥",
                    "🎉",
                    "🙏",
                    "😍",
                    "😎",
                    "🤔",
                    "😢",
                    "😮",
                    "👏",
                    "💯",
                    "⭐",
                    "🌟",
                  ].map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center rounded hover:bg-opacity-10 ${
                        darkMode ? "hover:bg-white" : "hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setContent(content + emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Enhanced Post Feed Component
const PostFeed = ({ posts, darkMode }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} darkMode={darkMode} />
      ))}

      {/* Load More Posts */}
      <div className="flex justify-center">
        <button
          className={`px-6 py-2 rounded-full ${
            darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } font-medium transition-colors duration-300`}
        >
          Load more
        </button>
      </div>
    </div>
  );
};

// Enhanced Individual Post Component
const Post = ({ post, darkMode }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const isLongContent = post.content.length > 280;

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}
    >
      <div className="p-4">
        {/* Post Header */}
        <div className="flex justify-between items-start">
          <div className="flex space-x-3">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-bold">{post.user.name}</h3>
                {post.user.verified && (
                  <span className="ml-1 text-blue-500" title="Verified">
                    ✓
                  </span>
                )}
                <span
                  className={`ml-2 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {post.user.username}
                </span>
                <span
                  className={`mx-1 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  •
                </span>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {post.timestamp}
                </span>
              </div>
            </div>
          </div>

          <button
            className={`p-1 rounded-full transition-colors duration-300 ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <span>⋯</span>
          </button>
        </div>

        {/* Post Content */}
        <div className="mt-3">
          <p className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {isLongContent && !expanded ? (
              <>
                {post.content.slice(0, 280)}...
                <button
                  className={`${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } font-medium ml-1`}
                  onClick={() => setExpanded(true)}
                >
                  Read more
                </button>
              </>
            ) : (
              post.content
            )}
          </p>

          {/* Post Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-sm ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } cursor-pointer hover:underline`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div
              className={`mt-3 ${
                post.images.length > 1 ? "grid grid-cols-2 gap-2" : ""
              }`}
            >
              {post.images.map((img, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt="Post attachment"
                    className="w-full object-cover"
                    style={{
                      maxHeight: post.images.length > 1 ? "200px" : "400px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Interactions */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <button
            className={`flex items-center space-x-1 ${
              liked
                ? darkMode
                  ? "text-red-400"
                  : "text-red-500"
                : darkMode
                ? "text-gray-400 hover:text-red-400"
                : "text-gray-600 hover:text-red-500"
            } transition-colors duration-300`}
            onClick={handleLike}
          >
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{likes}</span>
          </button>

          <button
            className={`flex items-center space-x-1 ${
              darkMode
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-600 hover:text-blue-600"
            } transition-colors duration-300`}
            onClick={toggleComments}
          >
            <span>💬</span>
            <span>{post.comments}</span>
          </button>

          <button
            className={`flex items-center space-x-1 ${
              darkMode
                ? "text-gray-400 hover:text-green-400"
                : "text-gray-600 hover:text-green-600"
            } transition-colors duration-300`}
          >
            <span>🔄</span>
            <span>{post.shares}</span>
          </button>

          <button
            className={`flex items-center space-x-1 ${
              bookmarked
                ? darkMode
                  ? "text-yellow-400"
                  : "text-yellow-500"
                : darkMode
                ? "text-gray-400 hover:text-yellow-400"
                : "text-gray-600 hover:text-yellow-500"
            } transition-colors duration-300`}
            onClick={handleBookmark}
          >
            <span>{bookmarked ? "🔖" : "📑"}</span>
            <span>{post.bookmarks}</span>
          </button>

          <button
            className={`flex items-center space-x-1 ${
              darkMode
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-600 hover:text-blue-600"
            } transition-colors duration-300`}
          >
            <span>📤</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div
            className={`mt-4 pt-3 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="space-y-3">
              {/* Comment Input */}
              <div className="flex space-x-2">
                <img
                  src="/api/placeholder/100/100"
                  alt="Your avatar"
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className={`w-full px-4 py-2 rounded-full ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
                  />
                  <div className="absolute right-3 top-2 flex space-x-1">
                    <button
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      😊
                    </button>
                    <button
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      🖼️
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Comments */}
              <div
                className={`p-3 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex space-x-2">
                  <img
                    src="/api/placeholder/100/100"
                    alt="Commenter"
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">Michael Brown</span>
                      <span
                        className={`ml-2 text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        15 min ago
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      This is amazing! I've been looking for something like
                      this.
                    </p>
                    <div className="flex space-x-3 mt-1">
                      <button
                        className={`text-xs ${
                          darkMode
                            ? "text-gray-400 hover:text-blue-400"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        Like
                      </button>
                      <button
                        className={`text-xs ${
                          darkMode
                            ? "text-gray-400 hover:text-blue-400"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className={`text-sm ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } hover:underline`}
              >
                View all {post.comments} comments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Suggested Users Component
const SuggestedUsers = ({ darkMode }) => {
  const suggestions = [
    {
      id: 1,
      name: "Emma Wilson",
      username: "@emmaw",
      avatar: "/api/placeholder/100/100",
      followers: 5634,
      mutual: 3,
    },
    {
      id: 2,
      name: "Jason Lee",
      username: "@jasonlee",
      avatar: "/api/placeholder/100/100",
      followers: 8943,
      mutual: 5,
    },
    {
      id: 3,
      name: "Sophia Chen",
      username: "@sophiac",
      avatar: "/api/placeholder/100/100",
      followers: 12.5,
      mutual: 8,
    },
  ];

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border p-4`}
    >
      <h3 className="font-semibold mb-4">Suggested for you</h3>
      <div className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">{user.name}</h4>
                </div>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {user.username}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <span>
                    {typeof user.followers === "number" && user.followers > 1000
                      ? `${user.followers}K`
                      : user.followers}
                  </span>{" "}
                  followers • <span>{user.mutual} mutual</span>
                </p>
              </div>
            </div>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Follow
            </button>
          </div>
        ))}

        <button
          className={`w-full text-center text-sm ${
            darkMode ? "text-blue-400" : "text-blue-600"
          } hover:underline py-2`}
        >
          See all suggestions
        </button>
      </div>
    </div>
  );
};

// Trending Topics Component
const TrendingTopics = ({ darkMode }) => {
  const trends = [
    { id: 1, topic: "#Photography", posts: "12.3K posts", category: "Art" },
    { id: 2, topic: "#TechNews", posts: "8.7K posts", category: "Technology" },
    { id: 3, topic: "#TravelDreams", posts: "5.9K posts", category: "Travel" },
    {
      id: 4,
      topic: "#CodingLife",
      posts: "4.2K posts",
      category: "Programming",
    },
  ];

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border p-4`}
    >
      <h3 className="font-semibold mb-4">Trending Topics</h3>
      <div className="space-y-3">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className={`cursor-pointer p-2 rounded-lg transition-colors duration-300 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between">
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {trend.category}
              </p>
              <button
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ⋯
              </button>
            </div>
            <h4 className="font-medium">{trend.topic}</h4>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {trend.posts}
            </p>
          </div>
        ))}

        <button
          className={`w-full text-center text-sm ${
            darkMode ? "text-blue-400" : "text-blue-600"
          } hover:underline py-2`}
        >
          Show more
        </button>
      </div>
    </div>
  );
};

// Upcoming Events Component
const UpcomingEvents = ({ darkMode }) => {
  const events = [
    {
      id: 1,
      title: "Photography Workshop",
      date: "Apr 15, 2025",
      time: "1:00 PM",
      location: "Downtown Art Center",
      attendees: 128,
      image: "/api/placeholder/300/150",
    },
    {
      id: 2,
      title: "Tech Meetup",
      date: "Apr 22, 2025",
      time: "6:30 PM",
      location: "Innovation Hub",
      attendees: 97,
      image: "/api/placeholder/300/150",
    },
  ];

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border p-4`}
    >
      <h3 className="font-semibold mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className={`overflow-hidden rounded-lg border ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } transition-colors duration-300`}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <h4 className="font-medium">{event.title}</h4>
              <div className="flex items-center mt-2">
                <span className="mr-1">📅</span>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {event.date} • {event.time}
                </p>
              </div>
              <div className="flex items-center mt-1">
                <span className="mr-1">📍</span>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {event.location}
                </p>
              </div>
              <div className="flex items-center mt-1">
                <span className="mr-1">👥</span>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {event.attendees} going
                </p>
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  className={`flex-1 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Interested
                </button>
                <button
                  className={`flex-1 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          className={`w-full text-center text-sm ${
            darkMode ? "text-blue-400" : "text-blue-600"
          } hover:underline py-2`}
        >
          See all events
        </button>
      </div>
    </div>
  );
};

export default Exa;
