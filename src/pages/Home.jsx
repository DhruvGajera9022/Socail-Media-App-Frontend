import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostFeed from "../components/PostFeed";
import { useDarkMode } from "../context/DarkModeProvider";
import { motion } from "framer-motion";
import { TrendingUp, Users, Sparkles, ArrowUpRight } from "lucide-react";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Handle responsive layout changes
  useEffect(() => {
    // Set up responsive listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const trendingTopics = [
    { tag: "#programming", posts: 1234, growth: "+12%" },
    { tag: "#technology", posts: 892, growth: "+8%" },
    { tag: "#webdev", posts: 756, growth: "+15%" },
    { tag: "#reactjs", posts: 654, growth: "+20%" },
    { tag: "#uidesign", posts: 543, growth: "+5%" },
  ];

  const suggestedUsers = [
    {
      name: "Jane Cooper",
      username: "@jane",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      followers: "12.5K",
    },
    {
      name: "Alex Morgan",
      username: "@alexm",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      followers: "8.2K",
    },
    {
      name: "Devon Lane",
      username: "@devonlane",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devon",
      followers: "15.7K",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Navbar component with dark mode prop */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isMobile ? "pt-16 pb-16" : "lg:ml-64 pt-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden rounded-2xl mb-8 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            <div className="relative p-8">
              <h1
                className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome to Your Feed
              </h1>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Discover the latest updates from your network and explore
                trending topics
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - Posts */}
            <div className="lg:col-span-2">
              <PostFeed isDarkMode={isDarkMode} />
            </div>

            {/* Enhanced Sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Trending Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <div className="flex items-center mb-4">
                  <TrendingUp
                    className={`w-5 h-5 mr-2 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <h3
                    className={`font-semibold text-lg ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Trending Topics
                  </h3>
                </div>
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className={`${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } p-3 rounded-lg cursor-pointer transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {topic.tag}
                        </p>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          {topic.growth}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {topic.posts.toLocaleString()} posts
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Suggestions Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <div className="flex items-center mb-4">
                  <Users
                    className={`w-5 h-5 mr-2 ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <h3
                    className={`font-semibold text-lg ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Suggested Users
                  </h3>
                </div>
                <div className="space-y-4">
                  {suggestedUsers.map((user, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={user.img}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border-2 border-blue-500"
                        />
                        <div className="ml-3">
                          <p
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user.name}
                          </p>
                          <div className="flex items-center">
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {user.username}
                            </p>
                            <span
                              className={`text-xs ml-2 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              • {user.followers} followers
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                        }`}
                      >
                        Follow
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
