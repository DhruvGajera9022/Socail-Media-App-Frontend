import React, { useEffect, useState, useRef } from "react";
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
  X,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

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
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    isPrivate: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showModal]);

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
          setEditForm({
            firstName: data.data.firstName || "",
            lastName: data.data.lastName || "",
            username: data.data.username || "",
            bio: data.data.bio || "",
            location: data.data.location || "",
            website: data.data.website || "",
            isPrivate: data.data.is_private || false,
          });
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
      console.log(`Fetching ${type} data...`);
      const response = await fetch(`${API_BASE_URL}/profile/${type}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(`Response status: ${response.status}`);
      const result = await response.json();
      console.log(`${type} data:`, result);

      if (response.ok) {
        // Handle different response formats
        let users = [];
        
        if (result.status && result.data) {
          // Handle the nested format where data contains followers/following array
          if (result.data.followers) {
            users = result.data.followers;
          } else if (result.data.following) {
            users = result.data.following;
          } else if (Array.isArray(result.data)) {
            users = result.data;
          } else if (typeof result.data === 'object') {
            users = [result.data];
          }
        } else if (Array.isArray(result)) {
          // If result is directly an array
          users = result;
        } else if (result.data && Array.isArray(result.data)) {
          // If result has a data property that is an array
          users = result.data;
        } else if (result.data && typeof result.data === 'object') {
          // If result.data is an object with user properties
          users = [result.data];
        } else if (typeof result === 'object') {
          // If result is an object with user properties
          users = [result];
        }
        
        console.log(`Processed users:`, users);
        
        // Map the users to ensure they have the required properties
        const formattedUsers = users.map(user => {
          console.log(`Processing user:`, user);
          return {
            id: user.id || user.userId || '',
            firstName: user.firstName || user.first_name || '',
            lastName: user.lastName || user.last_name || '',
            username: user.username || user.email?.split('@')[0] || '',
            profile_picture: user.profile_picture || user.profilePicture || '',
            isFollowing: user.isFollowing || false
          };
        });
        
        console.log(`Formatted users:`, formattedUsers);
        setModalTitle(type === "followers" ? "Followers" : "Following");
        setModalData(formattedUsers);
        setShowModal(true);
      } else {
        console.error(`API error:`, result);
        toast.error(result.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      toast.error("Something went wrong!");
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
    setEditForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      username: profile.username || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      isPrivate: profile.is_private || false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setEditError(null);

    try {
      // Create a clean profile data object with all fields
      const profileData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        username: editForm.username,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        is_private: editForm.isPrivate
      };

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...data.data,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          username: editForm.username,
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
          is_private: editForm.isPrivate,
        }));
        setIsEditing(false);
      } else {
        setEditError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setEditError("Network error. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploadingPicture(true);
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      // Create a temporary URL for immediate display
      const imageUrl = URL.createObjectURL(file);

      // Update the profile picture immediately for better UX
      const profileImage = document.querySelector('img[alt="Profile"]');
      if (profileImage) {
        profileImage.src = imageUrl;
      }

      const response = await fetch(`${API_BASE_URL}/profile/profile-picture`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // Update the profile state with the new profile picture URL
        setProfile((prevProfile) => {
          if (!prevProfile) return null;
          return {
            ...prevProfile,
            profile_picture: data.data.profile_picture,
          };
        });
      } else {
        // If the update fails, revert to the original image
        if (profileImage && profile.profile_picture) {
          profileImage.src = profile.profile_picture;
        }
        alert(data.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      // If there's an error, revert to the original image
      const profileImage = document.querySelector('img[alt="Profile"]');
      if (profileImage && profile.profile_picture) {
        profileImage.src = profile.profile_picture;
      }
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Add this new function to handle following/unfollowing users
  const handleFollowUser = async (userId, isFollowing) => {
    try {
      const endpoint = isFollowing 
        ? `${API_BASE_URL}/profile/${userId}/unfollow`
        : `${API_BASE_URL}/profile/${userId}/follow`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.status) {
        // Update the user in the modal data
        setModalData(prevData => 
          prevData.map(user => 
            user.id === userId 
              ? { ...user, isFollowing: !isFollowing } 
              : user
          )
        );
        
        // Update the profile counts
        setProfile(prevProfile => ({
          ...prevProfile,
          _count: {
            ...prevProfile._count,
            followers: isFollowing 
              ? prevProfile._count.followers - 1 
              : prevProfile._count.followers + 1
          }
        }));
        
        toast.success(isFollowing ? "User unfollowed" : "User followed");
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
      toast.error("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span
            className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
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
            <Users
              className={`w-12 h-12 mx-auto mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <p
              className={`text-lg ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
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

      {/* Hidden file input for profile picture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureChange}
        accept="image/*"
        className="hidden"
      />

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
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
              } rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Edit Profile
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {editError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {editError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={editForm.website}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        Private Account
                      </h3>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        When your account is private, only approved followers can see your posts
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPrivate"
                        checked={editForm.isPrivate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full peer ${
                        isDarkMode 
                          ? "bg-gray-700 peer-checked:bg-blue-500" 
                          : "bg-gray-200 peer-checked:bg-blue-600"
                      } peer-focus:outline-none peer-focus:ring-4 ${
                        isDarkMode 
                          ? "peer-focus:ring-blue-800" 
                          : "peer-focus:ring-blue-300"
                      }`}>
                      </div>
                      <span className={`ml-3 text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}>
                        {editForm.isPrivate ? "Private" : "Public"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                <button
                  onClick={handleCancelEdit}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {modalTitle}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className={`p-1 rounded-full ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X size={20} className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {modalData.length === 0 ? (
                  <div className="text-center py-8">
                    <Users
                      className={`w-12 h-12 mx-auto mb-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      No {modalTitle.toLowerCase()} found.
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
                          onError={(e) => {
                            e.target.src = "/api/placeholder/50/50";
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {user.firstName} {user.lastName}
                              </span>
                              <p
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                @{user.username}
                              </p>
                            </div>
                            <button 
                              className={`text-blue-500 hover:text-blue-600 transition-colors ${
                                user.isFollowing ? "text-green-500 hover:text-green-600" : ""
                              }`}
                              onClick={() => handleFollowUser(user.id, user.isFollowing)}
                            >
                              {user.isFollowing ? <UserMinus size={20} /> : <UserPlus size={20} />}
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
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
                <button
                  onClick={handleProfilePictureClick}
                  disabled={isUploadingPicture}
                  className={`absolute bottom-0 right-0 p-2 rounded-full transition-colors ${
                    isUploadingPicture
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  {isUploadingPicture ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera size={16} />
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profile.firstName} {profile.lastName}
                </h2>
                <p
                  className={`mt-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  @{profile.username || profile.email.split("@")[0]}
                </p>

                {profile.bio && (
                  <p
                    className={`mt-3 max-w-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {profile.bio}
                  </p>
                )}

                {/* Profile Stats */}
                <div className="flex justify-center gap-8 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => fetchModalData("following")}
                    className="cursor-pointer text-center"
                  >
                    <span
                      className={`text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {followerCount}
                    </span>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Following
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => fetchModalData("followers")}
                    className="cursor-pointer text-center"
                  >
                    <span
                      className={`text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {followingCount}
                    </span>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Followers
                    </p>
                  </motion.div>
                  <div className="text-center">
                    <span
                      className={`text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {postsCount}
                    </span>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
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
                    <div
                      className={`flex items-center gap-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
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
                  <div
                    className={`flex items-center gap-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Calendar size={16} />
                    <span>
                      Joined{" "}
                      {new Date(profile.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="mt-8">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg overflow-hidden`}
          >
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
                <div
                  className={`space-y-6 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
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
                      {new Date(profile.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts
                    .filter(
                      (post) => post.media_url && post.media_url.length > 0
                    )
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
