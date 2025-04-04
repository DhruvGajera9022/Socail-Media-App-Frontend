import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TwoFA = () => {
  const { id } = useParams(); // Get userId from URL params
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const otpCode = code.join("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile/2fa/authenticate`,
        {
          id: id, // Send userId along with OTP
          code: otpCode,
        }
      );

      if (response.data.status) {
        navigate("/");
      } else {
        setError(response.data.data || "Invalid OTP, please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.data || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-700">
          Two-Factor Authentication
        </h2>
        <p className="mt-2 text-center text-gray-600">
          A verification code has been sent to your email. Enter the 6-digit
          code below.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500 px-4 py-2 text-center text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-gray-600">
          Didn’t receive the code?{" "}
          <button className="text-blue-600 hover:underline">Resend Code</button>
        </p>
      </div>
    </div>
  );
};

export default TwoFA;
