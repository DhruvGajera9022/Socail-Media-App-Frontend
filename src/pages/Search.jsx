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
    }, 500); // wait 500ms after typing stops

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
      console.log(data.data);
      setSearchResults(data.data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
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
            placeholder="Search for content..."
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
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-5 rounded-lg shadow transition-all border hover:shadow-md 
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {result.title}
                  </h3>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                    Category: {result.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery && !isSearching ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No results found for "{searchQuery}"
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
