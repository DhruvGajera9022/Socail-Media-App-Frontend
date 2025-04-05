import React, { useState, useEffect } from "react";
import {
  Home,
  Compass,
  Bookmark,
  User,
  Bell,
  Search,
  MessageCircle,
  PlusSquare,
  Moon,
  Sun,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const activeTab = location.pathname;
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Mock navigation function (replace with your router's navigation)
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setExpanded(false);
  };

  // Check window width for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems = [
    { icon: <Home size={22} />, label: "Home", path: "/" },
    { icon: <Search size={22} />, label: "Search", path: "/search" },
    { icon: <PlusSquare size={22} />, label: "Create", path: "/create-post" },
    { icon: <Compass size={22} />, label: "Explore", path: "/explore" },
    {
      icon: <Bell size={22} />,
      label: "Notifications",
      path: "/notifications",
    },
    { icon: <MessageCircle size={22} />, label: "Messages", path: "/messages" },
    { icon: <Bookmark size={22} />, label: "Saved", path: "/saved" },
    { icon: <User size={22} />, label: "Profile", path: "/profile" },
  ];

  // Mobile navigation items (limited for better mobile display)
  const mobileNavItems = navItems.filter((_, index) =>
    [0, 3, 2, 5, 7].includes(index)
  );

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-200";

  return (
    <div
      className={`font-sans antialiased ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* Mobile Drawer Navigation */}
      {isMobile && (
        <>
          {/* Mobile Drawer */}
          <div
            className={`fixed inset-0 z-40 ${expanded ? "block" : "hidden"}`}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setExpanded(false)}
            ></div>

            {/* Drawer */}
            <div
              className={`absolute top-0 left-0 h-full w-64 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-xl transform transition-transform duration-300 ease-in-out`}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h1
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-blue-400" : "text-blue-500"
                  }`}
                >
                  SocialApp
                </h1>
                <button
                  onClick={() => setExpanded(false)}
                  className={`p-1 rounded-full ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      activeTab === item.path
                        ? isDarkMode
                          ? "bg-gray-700 text-blue-400 font-medium"
                          : "bg-blue-100 text-blue-600 font-medium"
                        : isDarkMode
                        ? "text-gray-200 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={
                        activeTab === item.path
                          ? isDarkMode
                            ? "text-blue-400"
                            : "text-blue-600"
                          : ""
                      }
                    >
                      {item.icon}
                    </div>
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={toggleDarkMode}
                    className={`flex items-center w-full p-3 rounded-lg ${
                      isDarkMode
                        ? "text-gray-200 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                    <span className="ml-3">
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Top Bar */}
          <div
            className={`fixed top-0 left-0 right-0 z-20 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-b shadow-sm px-4 py-2 flex items-center justify-between`}
          >
            <button
              onClick={() => setExpanded(true)}
              className={`p-2 rounded-full ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <Menu size={22} />
            </button>
            <h1
              className={`text-lg font-bold ${
                isDarkMode ? "text-blue-400" : "text-blue-500"
              }`}
            >
              SocialApp
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </>
      )}

      {/* Desktop Sidebar Navigation */}
      <div
        className={`hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-full lg:border-r transition-all duration-300 ${
          expanded ? "lg:w-64" : "lg:w-20"
        } ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div
          className={`relative flex items-center p-5 ${
            expanded ? "justify-between" : "justify-center"
          }`}
        >
          {expanded && (
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-blue-400" : "text-blue-500"
              }`}
            >
              SocialApp
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className={`${
              expanded ? "absolute -right-3 top-5" : "mt-3"
            } flex items-center justify-center w-6 h-6 rounded-full border ${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-300"
            } shadow-sm`}
          >
            {expanded ? (
              <ChevronLeft
                size={14}
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              />
            ) : (
              <ChevronRight
                size={14}
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              />
            )}
          </button>
        </div>

        <div className="mt-5 space-y-2 px-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center w-full ${
                expanded ? "px-3" : "px-0"
              } py-3 rounded-lg transition-colors ${
                activeTab === item.path
                  ? isDarkMode
                    ? "bg-gray-700 text-blue-400 font-medium"
                    : "bg-blue-100 text-blue-600 font-medium"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div
                className={`${!expanded && "flex justify-center w-full"} ${
                  activeTab === item.path
                    ? isDarkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                    : ""
                }`}
              >
                {item.icon}
              </div>
              {expanded && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>

        <div
          className={`absolute bottom-0 w-full p-3 ${
            isDarkMode ? "border-t border-gray-700" : "border-t border-gray-200"
          }`}
        >
          <button
            onClick={toggleDarkMode}
            className={`flex items-center w-full ${
              expanded ? "px-3" : "px-0"
            } py-3 rounded-lg ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className={!expanded && "flex justify-center w-full"}>
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </div>
            {expanded && (
              <span className="ml-3">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className={`lg:hidden fixed bottom-0 w-full border-t z-10 ${themeClasses}`}
      >
        <div className="flex justify-around items-center p-2">
          {mobileNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center py-1 px-3"
            >
              <div
                className={
                  activeTab === item.path
                    ? isDarkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                    : ""
                }
              >
                {item.icon}
              </div>
              <span
                className={`text-xs mt-1 ${
                  activeTab === item.path
                    ? isDarkMode
                      ? "text-blue-400 font-medium"
                      : "text-blue-600 font-medium"
                    : ""
                }`}
              >
                {item.label}
              </span>
              {activeTab === item.path && (
                <div
                  className={`absolute bottom-0 w-8 h-1 ${
                    isDarkMode ? "bg-blue-400" : "bg-blue-500"
                  } rounded-full`}
                ></div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
