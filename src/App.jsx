import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TwoFA from "./pages/TwoFA";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import AuthCallback from "./components/AuthCallback";
import Search from "./pages/Search";
import { DarkModeProvider } from "./context/DarkModeProvider";
import GoogleAuthSuccess from "./components/GoogleAuthSuccess";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Saved from "./pages/Saved";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <DarkModeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-2fa/:id" element={<TwoFA />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/google-success" element={<GoogleAuthSuccess />} />

        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DarkModeProvider>
  );
};

export default App;
