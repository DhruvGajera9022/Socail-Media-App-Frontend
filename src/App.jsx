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

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-2fa/:id" element={<TwoFA />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route path="/" element={<Home />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
};

export default App;
