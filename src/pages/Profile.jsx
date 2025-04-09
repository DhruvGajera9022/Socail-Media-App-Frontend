import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";
import {
  Edit,
  LogOut,
  Settings,
  Users,
  UserPlus,
  UserMinus,
  Camera,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);

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

  const fetchModalData = async (type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${type}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.status) {
        setModalTitle(type === "followers" ? "followers" : "following");
        setModalData(result.data);
        setShowModal(true);
      } else {
        alert(result.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Users className={`w-12 h-12 mx-auto mb-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`} />
            <p className={`text-lg ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Profile not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  const followerCount = profile._count?.followers || profile.followerCount || 0;
  const followingCount =
    profile._count?.following || profile.followingCount || 0;
  const postsCount = profile._count?.posts || profile.postsCount || 0;
  const posts = profile.posts || [];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Followers/Following Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {modalTitle.charAt(0).toUpperCase() + modalTitle.slice(1)}
                </h3>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {modalData.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className={`w-12 h-12 mx-auto mb-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`} />
                    <p className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}>
                      No users found.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {modalData.map((user) => (
                      <motion.li
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={user.profile_picture || "/api/placeholder/50/50"}
                          alt={user.firstName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`font-medium ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}>
                                {user.firstName} {user.lastName}
                              </span>
                              <p className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}>
                                @{user.username || user.email.split("@")[0]}
                              </p>
                            </div>
                            <button className="text-blue-500 hover:text-blue-600 transition-colors">
                              <UserPlus size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg overflow-hidden`}
        >
          {/* Cover Photo */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
            <button className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <Camera size={20} />
            </button>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              <div className="relative">
                <img
                  src={profile.profile_picture || "/api/placeholder/150/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/150/150";
                  }}
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <Camera size={16} />
                </button>
              </div>

              <div className="text-center mt-4">
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className={`mt-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  @{profile.username || profile.email.split("@")[0]}
                </p>

                {profile.bio && (
                  <p className={`mt-3 max-w-lg ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {profile.bio}
                  </p>
                )}

                {/* Profile Stats */}
                <div className="flex justify-center gap-8 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => fetchModalData("followers")}
                    className="cursor-pointer text-center"
                  >
                    <span className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {followerCount}
                    </span>
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Followers
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => fetchModalData("following")}
                    className="cursor-pointer text-center"
                  >
                    <span className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {followingCount}
                    </span>
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Following
                    </p>
                  </motion.div>
                  <div className="text-center">
                    <span className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {postsCount}
                    </span>
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Posts
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditProfile}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className={`flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {profile.location && (
                    <div className={`flex items-center gap-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      } hover:underline`}
                    >
                      <LinkIcon size={16} />
                      <span>{profile.website}</span>
                    </a>
                  )}
                  <div className={`flex items-center gap-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    <Calendar size={16} />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="mt-8">
          <div className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg overflow-hidden`}>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === "posts"
                    ? isDarkMode
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-blue-600 border-b-2 border-blue-600"
                    : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === "about"
                    ? isDarkMode
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-blue-600 border-b-2 border-blue-600"
                    : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === "media"
                    ? isDarkMode
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-blue-600 border-b-2 border-blue-600"
                    : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Media
              </button>
            </div>

            <div className="p-6">
              {activeTab === "posts" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      } rounded-lg overflow-hidden aspect-square`}
                    >
                      <img
                        src={post.media_url?.[0] || "/api/placeholder/300/300"}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "about" && (
                <div className={`space-y-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div>
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p>{profile.bio || "No bio available"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p>{profile.location || "No location specified"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Website</h3>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.website || "No website specified"}
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Joined</h3>
                    <p>
                      {new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts
                    .filter((post) => post.media_url && post.media_url.length > 0)
                    .map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        } rounded-lg overflow-hidden aspect-square`}
                      >
                        <img
                          src={post.media_url[0]}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
