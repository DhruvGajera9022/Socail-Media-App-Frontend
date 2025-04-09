import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeProvider";
import { 
  Image, 
  X, 
  Send, 
  Smile, 
  Type, 
  ImagePlus, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  AtSign,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDraft, setIsDraft] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  // Check if user is logged in
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update character count
  useEffect(() => {
    setCharacterCount(content.length);
  }, [content]);

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
      formData.append("isDraft", isDraft);

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
        text: isDraft ? "Draft saved successfully!" : "Post created successfully!",
      });

      // Reset form
      setTitle("");
      setContent("");
      setImages([]);
      setPreviewImages([]);
      setErrors({});
      setIsDraft(false);
      
      // Navigate to home page after successful post creation
      if (!isDraft) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const insertFormatting = (type) => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    let newText = "";
    
    switch (type) {
      case "bold":
        newText = before + "**" + selection + "**" + after;
        break;
      case "italic":
        newText = before + "_" + selection + "_" + after;
        break;
      case "quote":
        newText = before + "> " + selection + after;
        break;
      case "code":
        newText = before + "`" + selection + "`" + after;
        break;
      case "link":
        newText = before + "[" + selection + "](url)" + after;
        break;
      case "hashtag":
        newText = before + "#" + selection + after;
        break;
      case "mention":
        newText = before + "@" + selection + after;
        break;
      case "bullet":
        newText = before + "- " + selection + after;
        break;
      case "numbered":
        newText = before + "1. " + selection + after;
        break;
      default:
        newText = text;
    }
    
    setContent(newText);
    
    // Set cursor position after the inserted formatting
    setTimeout(() => {
      const newPosition = type === "bold" || type === "italic" || type === "code" 
        ? start + 2 + selection.length + 2 
        : type === "quote" 
          ? start + 2 + selection.length 
          : type === "link" 
            ? start + 1 + selection.length + 5 
            : start + 1 + selection.length;
      
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-xl shadow-lg overflow-hidden`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Create New Post</h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    showPreview
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showPreview ? "Edit" : "Preview"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDraft(!isDraft)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    isDraft
                      ? "bg-yellow-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isDraft ? "Draft Mode" : "Save as Draft"}
                </button>
              </div>
            </div>

            {/* Message display */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    message.type === "error"
                      ? "bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                      : "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                  }`}
                >
                  {message.type === "error" ? (
                    <AlertCircle size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* Title field */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Enter post title"
                  disabled={isLoading || showPreview}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Content field */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="content"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Content
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {characterCount} characters
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFormatting(!showFormatting)}
                      className={`p-1 rounded-full ${
                        showFormatting
                          ? "bg-blue-500 text-white"
                          : isDarkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Type size={16} />
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showFormatting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`mb-2 p-2 rounded-lg flex flex-wrap gap-1 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => insertFormatting("bold")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Bold"
                      >
                        <Bold size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("italic")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Italic"
                      >
                        <Italic size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("quote")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Quote"
                      >
                        <Quote size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("code")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Code"
                      >
                        <Code size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("link")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Link"
                      >
                        <LinkIcon size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("hashtag")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Hashtag"
                      >
                        <Hash size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("mention")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Mention"
                      >
                        <AtSign size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("bullet")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Bullet List"
                      >
                        <List size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("numbered")}
                        className={`p-1.5 rounded ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                        title="Numbered List"
                      >
                        <ListOrdered size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {showPreview ? (
                  <div 
                    className={`w-full px-4 py-3 border rounded-lg min-h-[200px] ${
                      isDarkMode 
                        ? "border-gray-600 bg-gray-700 text-white" 
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <h2 className="text-xl font-bold mb-3">{title || "Untitled"}</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    {previewImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {previewImages.map((src, index) => (
                          <img 
                            key={index} 
                            src={src} 
                            alt={`Preview ${index}`} 
                            className="rounded-lg object-cover w-full h-40"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    id="content"
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="8"
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.content
                        ? "border-red-500 focus:ring-red-500"
                        : isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 transition-all`}
                    placeholder="Write your post content here..."
                    disabled={isLoading}
                  />
                )}
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              {/* Image upload */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  Images (Max 5)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                  {previewImages.map((src, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square group"
                    >
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className="h-full w-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
                          disabled={isLoading}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {images.length < 5 && (
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className={`aspect-square border-2 border-dashed ${
                        isDarkMode
                          ? "border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400"
                          : "border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500"
                      } rounded-lg flex flex-col items-center justify-center gap-2 transition-all`}
                      disabled={isLoading || showPreview}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ImagePlus size={24} />
                      <span className="text-xs">Add Image</span>
                    </motion.button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  disabled={isLoading || showPreview}
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
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading || showPreview}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-blue-400 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Creating Post...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>{isDraft ? "Save Draft" : "Publish Post"}</span>
                    </>
                  )}
                </button>
                
                {!isMobile && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`py-3 px-4 rounded-lg flex items-center gap-2 ${
                      showPreview
                        ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    } hover:bg-gray-300 dark:hover:bg-gray-600 transition-all`}
                  >
                    <Smile size={18} />
                    <span>Preview</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;
