import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";
import axiosInstance from "../utils/axiosConfig";
import {
  Search as SearchIcon,
  X,
  UserPlus,
  UserMinus,
  Clock,
  Filter,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Search = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage when updated
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axiosInstance.get(`/profile/search/${searchQuery}`);
      const data = response.data;
      setSearchResults(data.data.users || []);

      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (user) => {
    const accessToken = localStorage.getItem("accessToken");
    let endpoint = "";
    let method = "POST";

    if (user.isFollowing) {
      endpoint = `${API_BASE_URL}/profile/${user.id}/unfollow`;
    } else if (user.followRequestSent) {
      endpoint = `${API_BASE_URL}/profile/${user.id}/cancel-request`;
    } else {
      endpoint = `${API_BASE_URL}/profile/${user.id}/follow`;
    }

    try {
      const response = await axiosInstance.post(endpoint);
      if (!response.data.status) throw new Error("Action failed");

      setSearchResults((prevResults) =>
        prevResults.map((u) =>
          u.id === user.id
            ? {
                ...u,
                isFollowing: user.isFollowing ? false : !user.followRequestSent,
                followRequestSent: user.isFollowing
                  ? false
                  : user.followRequestSent
                  ? false
                  : true,
              }
            : u
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      `<mark class="bg-yellow-300 dark:bg-yellow-600">$1</mark>`
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const removeRecentSearch = (search, e) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  };

  const useRecentSearch = (search) => {
    setSearchQuery(search);
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const filteredResults = () => {
    if (activeFilter === "all") return searchResults;
    if (activeFilter === "following")
      return searchResults.filter((user) => user.isFollowing);
    if (activeFilter === "not-following")
      return searchResults.filter((user) => !user.isFollowing);
    return searchResults;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div
        className={`transition-all duration-300 ${
          isMobile ? "pt-16 pb-16" : "lg:ml-64 pt-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-6">Search</h1>

            <div className="relative mb-8">
              <div className="relative flex items-center">
                <SearchIcon
                  className={`absolute left-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  size={20}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for users..."
                  className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 focus:ring-blue-400"
                        : "bg-white border-gray-300 focus:ring-blue-500"
                    }`}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className={`absolute right-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>

                {searchQuery && (
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {filteredResults().length} results
                  </span>
                )}
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`mt-3 p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow-md`}
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          activeFilter === "all"
                            ? "bg-blue-500 text-white"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setActiveFilter("following")}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          activeFilter === "following"
                            ? "bg-blue-500 text-white"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Following
                      </button>
                      <button
                        onClick={() => setActiveFilter("not-following")}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          activeFilter === "not-following"
                            ? "bg-blue-500 text-white"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Not Following
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isSearching && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <span
                  className={`ml-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Searching...
                </span>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
              >
                {error}
              </motion.div>
            )}

            {!searchQuery && recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Recent Searches
                  </h2>
                  <button
                    onClick={clearAllRecentSearches}
                    className={`text-sm ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    } hover:underline`}
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => useRecentSearch(search)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        isDarkMode
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-white hover:bg-gray-50"
                      } shadow-sm`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock
                          size={16}
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {search}
                        </span>
                      </div>
                      <button
                        onClick={(e) => removeRecentSearch(search, e)}
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {filteredResults().length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {filteredResults().map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-5 rounded-lg shadow transition-all border hover:shadow-md 
                        ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={user.profile_picture || "/default-avatar.png"}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/user/${user.id}`)}
                          />
                          {user.isFollowing && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <UserPlus size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className="text-lg font-semibold text-blue-600 dark:text-blue-400"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                `${user.firstName} ${user.lastName}`,
                                searchQuery
                              ),
                            }}
                          ></h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            @{user.username || user.email.split("@")[0]}
                          </p>
                          <div className="flex gap-4 mt-1">
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              <span className="font-medium">
                                {user._count.following}
                              </span>{" "}
                              followers
                            </span>
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              <span className="font-medium">
                                {user._count.followers}
                              </span>{" "}
                              following
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollow(user)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            user.isFollowing
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : user.followRequestSent
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {user.isFollowing ? (
                            <>
                              <UserMinus size={16} />
                              <span>Unfollow</span>
                            </>
                          ) : user.followRequestSent ? (
                            <>
                              <Clock size={16} />
                              <span>Requested</span>
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : searchQuery && !isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <SearchIcon
                    size={32}
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  />
                </div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-lg`}
                >
                  No users found matching{" "}
                  <strong className="text-blue-600 dark:text-blue-400">
                    "{searchQuery}"
                  </strong>
                </p>
                <p
                  className={`mt-2 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  } text-sm`}
                >
                  Try different keywords or check your spelling
                </p>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Search;
