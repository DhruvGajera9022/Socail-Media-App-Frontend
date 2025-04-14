import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";
import { Home } from "lucide-react";

const NotFound = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] px-4">
        <div className="text-center">
          <h1 className={`text-9xl font-bold ${isDarkMode ? "text-gray-700" : "text-gray-200"}`}>
            404
          </h1>
          <h2 className={`text-3xl font-bold mt-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Page Not Found
          </h2>
          <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className={`mt-8 inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 