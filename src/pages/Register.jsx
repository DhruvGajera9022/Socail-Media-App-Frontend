import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is correctly set in .env

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { isDarkMode } = useDarkMode();

  // Redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      const resData = response.data;

      if (resData.status) {
        const { accessToken, refreshToken, is_2fa } = resData.data;

        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Redirect based on 2FA
        navigate(is_2fa ? "/verify-2fa" : "/");
      } else {
        setServerError(resData.data || "Registration failed!");
      }
    } catch (error) {
      setServerError(error.response?.data?.data || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md space-y-6 rounded-xl p-6 shadow-lg transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-center text-3xl font-bold transition-colors ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Sign Up
        </h2>

        {/* Server Error Display */}
        {serverError && (
          <div className="mb-4 rounded-lg bg-red-500 px-4 py-2 text-white text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User Name */}
          <div>
            <label
              className={`block text-sm font-medium transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Username
            </label>
            <input
              {...register("username")}
              className={`mt-1 w-full rounded-lg border p-3 focus:ring-1 focus:ring-blue-500 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="John@123"
            />
            <p className="mt-1 text-sm text-red-500">
              {errors.username?.message}
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className={`mt-1 w-full rounded-lg border p-3 focus:ring-1 focus:ring-blue-500 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="john@example.com"
            />
            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className={`mt-1 w-full rounded-lg border p-3 focus:ring-1 focus:ring-blue-500 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="********"
            />
            <p className="mt-1 text-sm text-red-500">
              {errors.password?.message}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className={`block text-sm font-medium transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className={`mt-1 w-full rounded-lg border p-3 focus:ring-1 focus:ring-blue-500 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="********"
            />
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword?.message}
            </p>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`h-px w-full transition-colors ${
              isDarkMode ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
          <span
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            OR
          </span>
          <div
            className={`h-px w-full transition-colors ${
              isDarkMode ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Google Register */}
        <button
          className={`w-full flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 hover:bg-gray-100 transition ${
            isDarkMode
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="h-5 w-5"
          />
          <span>Sign Up with Google</span>
        </button>

        {/* Login Link */}
        <p
          className={`text-center text-sm transition-colors ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
