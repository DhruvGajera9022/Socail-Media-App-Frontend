import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      const resData = response.data;

      if (resData.status) {
        const { accessToken, refreshToken, is_2fa, id } = resData.data;

        if (is_2fa) {
          // Redirect to 2FA verification, do not store tokens
          navigate(`/verify-2fa/${id}`);
        } else {
          // Store tokens in localStorage and redirect to home
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          navigate("/");
        }
      } else {
        setErrorMessage(resData.data || "Login failed!");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.data || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async () => {
    try {
      window.location.href = `${API_BASE_URL}/auth/google`;
      const resData = response.data;

      if (resData.status) {
        const { accessToken, refreshToken, id } = resData.data;

        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        navigate("/");
      } else {
        setErrorMessage(resData.message || "Login failed!");
      }
    } catch (error) {
      console.error("Google Auth Error:", error.message);
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800">Login</h2>

        {/* Server Error Display */}
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-500 px-4 py-2 text-white text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="john@example.com"
            />
            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="********"
            />
            <p className="mt-1 text-sm text-red-500">
              {errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center space-x-2">
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px w-full bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          className="w-full flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          onClick={googleAuth}
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="h-5 w-5"
          />
          <span>Sign in with Google</span>
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
