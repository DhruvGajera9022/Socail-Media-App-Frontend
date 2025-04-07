import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostFeed from "../components/PostFeed";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle responsive layout changes
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(localStorage.getItem("darkMode") === "true" || prefersDark);

    // Set up responsive listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle dark mode handler
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

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
        <div className="max-w-5xl mx-auto px-4">
          {/* Content Header */}
          <div
            className={`pt-6 pb-4 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            <h1 className="text-2xl font-bold">Home</h1>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Latest posts from your network
            </p>
          </div>

          {/* Layout for desktop: two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - Posts */}
            <div className="lg:col-span-2">
              <PostFeed isDarkMode={isDarkMode} />
            </div>

            {/* Sidebar (visible only on desktop) */}
            <div className="hidden lg:block">
              <div
                className={`sticky top-4 ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                } rounded-lg shadow-md p-4 transition-colors duration-300`}
              >
                <h3 className="font-semibold text-lg mb-3">Trending</h3>
                <div className="space-y-4">
                  {/* Trending topics */}
                  {[
                    "#programming",
                    "#technology",
                    "#webdev",
                    "#reactjs",
                    "#uidesign",
                  ].map((tag, index) => (
                    <div
                      key={index}
                      className={`${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } p-2 rounded-md cursor-pointer transition-colors`}
                    >
                      <p
                        className={`font-medium ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {tag}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {Math.floor(Math.random() * 1000) + 100} posts
                      </p>
                    </div>
                  ))}
                </div>

                {/* Suggestions section */}
                <h3 className="font-semibold text-lg mt-6 mb-3">Suggestions</h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Jane Cooper",
                      username: "@jane",
                      img: "/api/placeholder/40/40",
                    },
                    {
                      name: "Alex Morgan",
                      username: "@alexm",
                      img: "/api/placeholder/40/40",
                    },
                    {
                      name: "Devon Lane",
                      username: "@devonlane",
                      img: "/api/placeholder/40/40",
                    },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={user.img}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="ml-2">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {user.username}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                          isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                        }`}
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
