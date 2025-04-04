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
          className="w-24 h-24 mx-auto rounded-full border-2 border-gray-300"
        />
        <h2 className="text-xl font-bold mt-2">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-gray-600">{profile.email}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div>
            <span className="text-lg font-semibold">
              {profile._count.followers}
            </span>
            <p className="text-gray-500">Followers</p>
          </div>
          <div>
            <span className="text-lg font-semibold">
              {profile._count.following}
            </span>
            <p className="text-gray-500">Following</p>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="max-w-5xl mx-auto mt-6">
        <h3 className="text-2xl font-semibold mb-4">Posts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-bold">{post.title}</h4>
              <p className="text-gray-600 mt-2">{post.content}</p>
              <p className="text-sm text-gray-400 mt-3">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
