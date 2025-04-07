// src/context/DarkModeContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Get initial state from localStorage or system preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // Check system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialMode);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900");
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (localStorage.getItem("darkMode") === null) {
        setIsDarkMode(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook for using dark mode
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
