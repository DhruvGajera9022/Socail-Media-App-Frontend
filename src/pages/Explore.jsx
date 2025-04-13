import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, TrendingUp, Clock, Star, Users } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeProvider';
import Navbar from '../components/Navbar';

const Explore = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('trending'); // 'trending', 'latest', 'popular', 'following'
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useDarkMode();
  
  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'johndoe',
      userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      imageUrl: 'https://source.unsplash.com/random/800x600?nature',
      caption: 'Beautiful sunset at the beach! 🌅',
      likes: 245,
      comments: 18,
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      username: 'janedoe',
      userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      imageUrl: 'https://source.unsplash.com/random/800x600?city',
      caption: 'Exploring the city streets 🏙️',
      likes: 189,
      comments: 12,
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      username: 'mikebrown',
      userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      imageUrl: 'https://source.unsplash.com/random/800x600?food',
      caption: 'Delicious homemade pasta 🍝',
      likes: 312,
      comments: 24,
      timestamp: '6 hours ago',
    },
    {
      id: 4,
      username: 'sarahsmith',
      userAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      imageUrl: 'https://source.unsplash.com/random/800x600?travel',
      caption: 'Adventure awaits! ✈️',
      likes: 276,
      comments: 15,
      timestamp: '8 hours ago',
    },
    {
      id: 5,
      username: 'alexwilson',
      userAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      imageUrl: 'https://source.unsplash.com/random/800x600?technology',
      caption: 'New tech gadgets 🖥️',
      likes: 198,
      comments: 21,
      timestamp: '10 hours ago',
    },
    {
      id: 6,
      username: 'emilyjones',
      userAvatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      imageUrl: 'https://source.unsplash.com/random/800x600?art',
      caption: 'Art gallery visit 🎨',
      likes: 167,
      comments: 9,
      timestamp: '12 hours ago',
    },
  ]);

  // Filter options
  const filterOptions = [
    { id: 'trending', label: 'Trending', icon: <TrendingUp size={18} /> },
    { id: 'latest', label: 'Latest', icon: <Clock size={18} /> },
    { id: 'popular', label: 'Popular', icon: <Star size={18} /> },
    { id: 'following', label: 'Following', icon: <Users size={18} /> },
  ];

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // In a real app, you would filter posts based on the search query
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // In a real app, you would fetch posts based on the selected filter
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-72">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover new content and connect with others
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search posts, people, or tags..."
              value={searchQuery}
              onChange={handleSearch}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleFilterChange(option.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.id
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex justify-end">
            <div className={`inline-flex rounded-lg p-1 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {posts.map((post) => (
            <div
              key={post.id}
              className={`rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[1.02] ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Post Header */}
              <div className="p-4 flex items-center">
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium">{post.username}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {post.timestamp}
                  </p>
                </div>
              </div>

              {/* Post Image */}
              <div className="relative aspect-square">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="mb-3">{post.caption}</p>
                <div className={`flex items-center text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span className="mr-4">{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
