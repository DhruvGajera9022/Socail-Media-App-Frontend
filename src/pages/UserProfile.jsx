import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";
import {
  UserPlus,
  UserMinus,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/profile/${userId}`);
        const data = response.data;

        if (response.ok && data.status) {
          setProfile(data.data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      fetchUserProfile();
    } else {
      setLoading(false);
      setError("Not authenticated. Please log in.");
    }
  }, [userId, accessToken]);

  const handleFollowUser = async () => {
    try {
      const endpoint = profile.isFollowing
        ? `/profile/${userId}/unfollow`
        : `/profile/${userId}/follow`;

      const response = await axiosInstance.post(endpoint);
      const result = response.data;

      if (response.ok && result.status) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          isFollowing: !prevProfile.isFollowing,
          _count: {
            ...prevProfile._count,
            followers: prevProfile.isFollowing
              ? prevProfile._count.followers - 1
              : prevProfile._count.followers + 1,
          },
        }));
        toast.success(profile.isFollowing ? "User unfollowed" : "User followed");
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
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Navbar />
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
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Navbar />
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
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className={`text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Profile not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar />
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
              </div>

              <div className="text-center mt-4">
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  @{profile.username}
                </p>

                {profile.bio && (
                  <p className={`mt-3 max-w-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {profile.bio}
                  </p>
                )}

                {/* Profile Stats */}
                <div className="flex justify-center gap-8 mt-6">
                  <div className="text-center">
                    <span className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {profile._count?.following || 0}
                    </span>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Following
                    </p>
                  </div>
                  <div className="text-center">
                    <span className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {profile._count?.followers || 0}
                    </span>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Followers
                    </p>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  onClick={handleFollowUser}
                  className={`mt-4 px-6 py-2 rounded-full font-medium transition-colors ${
                    profile.isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {profile.isFollowing ? (
                    <span className="flex items-center">
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfollow
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </span>
                  )}
                </button>

                {/* Additional Info */}
                <div className="mt-6 space-y-2">
                  {profile.location && (
                    <div className={`flex items-center justify-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <div className={`flex items-center justify-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className={`flex items-center justify-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile; 