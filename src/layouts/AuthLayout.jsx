import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeProvider';

const AuthLayout = () => {
  const { isDarkMode } = useDarkMode();
  
  // Check if user is already logged in
  const isAuthenticated = localStorage.getItem('accessToken');
  
  // If user is already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 