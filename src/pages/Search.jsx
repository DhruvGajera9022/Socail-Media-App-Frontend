import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Search = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Debounce timeout
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
    setIsSearching(true);
    setError(null);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/search/${searchQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setSearchResults(data.data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (userId) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_BASE_URL}/profile/follow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to send follow request");

      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === userId
            ? { ...user, isFollowing: true, followRequestSent: true }
            : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Optional: Highlight matched letters in user names
  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      `<mark class="bg-yellow-300 dark:bg-yellow-600">$1</mark>`
    );
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for users..."
            className={`flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 
              ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 focus:ring-blue-400"
                  : "bg-white border-gray-300 focus:ring-blue-500"
              }`}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {isSearching && (
          <div className="text-center text-blue-500 dark:text-blue-300 py-6 animate-pulse">
            Searching for users...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
            {error}
          </div>
        )}

        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Results ({searchResults.length})
            </h2>
            <div className="space-y-4">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className={`p-5 rounded-lg shadow transition-all border hover:shadow-md 
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profile_picture || "/default-avatar.png"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Followers: {user._count.followers}, Following:{" "}
                        {user._count.following}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFollow(user.id)}
                      disabled={user.isFollowing || user.followRequestSent}
                      className={`px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${
                        user.isFollowing || user.followRequestSent
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {user.isFollowing
                        ? "Following"
                        : user.followRequestSent
                        ? "Request Sent"
                        : "Follow"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery && !isSearching ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No users found matching{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                "{searchQuery}"
              </strong>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
