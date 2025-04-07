import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Accept a follow request
  const handleAccept = async (userId) => {
    console.log({ userId });
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

      // Remove request from list
      setRequests((prev) => prev.filter((r) => r.user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Reject a follow request
  const handleReject = async (requestId) => {
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

      // Remove request from list
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch (err) {
      setError(err.message);
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
          <h1 className="text-3xl font-bold mb-6">Notifications</h1>

          {loading && (
            <div className="text-center text-blue-500 dark:text-blue-300 py-6 animate-pulse">
              Loading follow requests...
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
              {error}
            </div>
          )}

          {!loading && requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No new follow requests.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(({ requestId, user }) => (
                <div
                  key={requestId}
                  className={`p-5 rounded-lg shadow transition-all border hover:shadow-md flex items-center gap-4 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={user.profile_picture || "/default-avatar.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {user.firstName} {user.lastName}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(user.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(requestId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
