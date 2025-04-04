import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TwoFA from "./pages/TwoFA";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-2fa/:id" element={<TwoFA />} />

      <Route path="/" element={<Home />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;
