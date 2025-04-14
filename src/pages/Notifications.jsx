import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [processingIds, setProcessingIds] = useState(new Set());

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch follow requests
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_BASE_URL}/profile/follow-request`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch follow requests");

      const data = await response.json();
      setRequests(data.data.requests || []);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Accept a follow request
  const handleAccept = async (userId) => {
    setProcessingIds(prev => new Set([...prev, userId]));
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/${userId}/accept-follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to accept request");

      setRequests((prev) => prev.filter((r) => r.user.id !== userId));
      toast.success("Follow request accepted");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to accept request");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Reject a follow request
  const handleReject = async (requestId) => {
    setProcessingIds(prev => new Set([...prev, requestId]));
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/follow-request/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject request");

      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      toast.success("Follow request rejected");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to reject request");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className={`${isMobile ? "pt-16 pb-16" : "lg:ml-64 pt-6"}`}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            {requests.length > 0 && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {requests.length} new
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
              <button
                onClick={fetchRequests}
                className="mt-2 text-sm underline hover:text-red-800 dark:hover:text-red-300"
              >
                Try again
              </button>
            </div>
          ) : requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                No new notifications
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                When someone sends you a follow request, it will appear here.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {requests.map(({ requestId, user }) => (
                  <motion.div
                    key={requestId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`p-5 rounded-lg shadow transition-all border hover:shadow-md flex items-center gap-4 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={user.profile_picture || "/default-avatar.png"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username || user.email.split("@")[0]} wants to follow you
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(user.id)}
                        disabled={processingIds.has(user.id)}
                        className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 ${
                          processingIds.has(user.id) ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {processingIds.has(user.id) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Accepting...
                          </>
                        ) : (
                          "Accept"
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(requestId)}
                        disabled={processingIds.has(requestId)}
                        className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 ${
                          processingIds.has(requestId) ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {processingIds.has(requestId) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Rejecting...
                          </>
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
