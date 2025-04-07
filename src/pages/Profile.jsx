import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.status) {
          setProfile(data.data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("Not authenticated. Please log in.");
    }
  }, [accessToken]);

  const handleEditProfile = () => {
    // Navigate to edit profile page or open modal
    console.log("Edit profile clicked");
    // Implement navigation or modal opening logic here
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Navigate to login page
    window.location.href = "/login";
  };

  if (loading)
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div
          className={`text-center p-10 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Loading...
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="text-center p-10 text-red-500">{error}</div>
      </div>
    );

  if (!profile)
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div
          className={`text-center p-10 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Profile not found
        </div>
      </div>
    );

  // Safely extract counts
  const followerCount = profile._count?.followers || profile.followerCount || 0;
  const followingCount =
    profile._count?.following || profile.followingCount || 0;
  const postsCount = profile._count?.posts || profile.postsCount || 0;

  // Safely get posts array
  const posts = profile.posts || [];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto mt-8 shadow-md rounded-lg overflow-hidden">
        <div
          className={`p-6 text-center ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <img
            src={profile.profile_picture || "/api/placeholder/150/150"}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-gray-200 object-cover"
            onError={(e) => {
              e.target.src = "/api/placeholder/150/150";
            }}
          />

          <h2 className="text-2xl font-bold mt-4">
            {profile.firstName} {profile.lastName}
          </h2>

          <p
            className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {profile.email}
          </p>

          {profile.bio && (
            <p
              className={`mt-3 max-w-lg mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {profile.bio}
            </p>
          )}

          <div className="flex justify-center gap-8 mt-6">
            <div>
              <span className="text-xl font-semibold">{followerCount}</span>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                Followers
              </p>
            </div>
            <div>
              <span className="text-xl font-semibold">{followingCount}</span>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                Following
              </p>
            </div>
            <div>
              <span className="text-xl font-semibold">{postsCount}</span>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                Posts
              </p>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleEditProfile}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="max-w-6xl mx-auto mt-8 px-4 pb-12">
        <h3
          className={`text-2xl font-semibold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Posts
        </h3>

        {posts.length === 0 ? (
          <div
            className={`text-center py-12 rounded-lg shadow ${
              isDarkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-white text-gray-500"
            }`}
          >
            <p>No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`rounded-lg shadow overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Post Image */}
                <div className="relative aspect-square">
                  {post.media_url && post.media_url.length > 0 ? (
                    <img
                      src={post.media_url[0]}
                      alt={post.title || "Post"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/300";
                      }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <h4
                    className={`font-semibold text-lg truncate ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {post.title || "Untitled"}
                  </h4>
                  {post.content && (
                    <p
                      className={`mt-1 line-clamp-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className={isDarkMode ? "text-white" : ""}>
                          {post.likes || post.likesCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className={isDarkMode ? "text-white" : ""}>
                          {post.comments || post.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
