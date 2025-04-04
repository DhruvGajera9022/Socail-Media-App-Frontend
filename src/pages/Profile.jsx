import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (data.status) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!profile)
    return <div className="text-center p-10">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 text-center">
        <img
          src={profile.profile_picture}
          alt="Profile"
          className="w-40 h-40 mx-auto rounded-full border-2 border-gray-300"
        />
        <h2 className="text-3xl font-bold mt-2">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-gray-600">{profile.email}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div>
            <span className="text-2xl font-semibold">
              {profile._count.followers}
            </span>
            <p className="text-gray-500">Followers</p>
          </div>
          <div>
            <span className="text-2xl font-semibold">
              {profile._count.following}
            </span>
            <p className="text-gray-500">Following</p>
          </div>
          <div>
            <span className="text-2xl font-semibold">
              {profile._count.posts}
            </span>
            <p className="text-gray-500">Posts</p>
          </div>
        </div>
        {/* Profile Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit Profile
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* User Posts */}
      <div className="max-w-5xl mx-auto mt-6">
        <h3 className="text-3xl font-semibold mb-4">Posts</h3>
        <div className="grid grid-cols-3 gap-4">
          {profile.posts.map((post) => (
            <div key={post.id} className="relative group">
              {/* Post Image */}
              {post.media_url && post.media_url.length > 0 ? (
                <img
                  src={post.media_url[0]}
                  alt="Post"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded-lg">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <div className="text-white text-center">
                  <p className="font-bold text-2xl">{post.title}</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <div>
                      <span className="text-lg font-semibold">
                        {post.likes}
                      </span>
                      <p className="text-sm">Likes</p>
                    </div>
                    <div>
                      <span className="text-lg font-semibold">
                        {post.comments}
                      </span>
                      <p className="text-sm">Comments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
