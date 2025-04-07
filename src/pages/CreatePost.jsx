import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const { isDarkMode } = useDarkMode();

  const accessToken = localStorage.getItem("accessToken");

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validation for file types
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = selectedFiles.filter(
      (file) => !validImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setMessage({
        type: "error",
        text: "Please select only image files (JPEG, PNG, GIF, WEBP)",
      });
      return;
    }

    // Max 5 images validation
    if (images.length + selectedFiles.length > 5) {
      setMessage({
        type: "error",
        text: "You can only upload a maximum of 5 images",
      });
      return;
    }

    // Size validation (max 5MB per image)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setMessage({
        type: "error",
        text: "Images must be less than 5MB each",
      });
      return;
    }

    // Update images state
    setImages((prevImages) => [...prevImages, ...selectedFiles]);

    // Create preview URLs
    const newPreviewImages = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages((prevPreviewImages) => [
      ...prevPreviewImages,
      ...newPreviewImages,
    ]);

    setMessage({ type: "", text: "" });
  };

  const removeImage = (index) => {
    // Clean up the object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);

    // Remove image from both arrays
    setImages(images.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage({ type: "", text: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Create FormData for API request
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // Append each image to formData
      images.forEach((image) => {
        formData.append(`media_url`, image);
      });

      // Make API request
      const response = await fetch(`${API_BASE_URL}/post`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${accessToken}` },
        // Don't set Content-Type header, the browser will set it with the boundary parameter
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      // Success
      setMessage({
        type: "success",
        text: "Post created successfully!",
      });

      // Reset form
      setTitle("");
      setContent("");
      setImages([]);
      setPreviewImages([]);
      setErrors({});
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
    >
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-700 text-white" : "bg-white"
          } rounded-lg shadow-md p-6`}
        >
          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

          {/* Message display */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded ${
                message.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title field */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-1`}
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title
                    ? "border-red-500"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-600 text-white"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter post title"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Content field */}
            <div className="mb-4">
              <label
                htmlFor="content"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-1`}
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.content
                    ? "border-red-500"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-600 text-white"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Write your post content here..."
                disabled={isLoading}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Image upload */}
            <div className="mb-6">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2`}
              >
                Images (Max 5)
              </label>

              <div className="flex flex-wrap gap-3 mb-3">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative h-24 w-24 group">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="h-full w-full object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-600"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className={`h-24 w-24 border-2 border-dashed ${
                      isDarkMode
                        ? "border-gray-500 text-gray-400 hover:border-blue-400 hover:text-blue-400"
                        : "border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500"
                    } rounded-md flex items-center justify-center`}
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                disabled={isLoading}
              />

              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Supported formats: JPEG, PNG, GIF, WEBP (max 5MB each)
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-blue-400"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Post...
                </span>
              ) : (
                "Create Post"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
