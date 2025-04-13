import React, { useState } from 'react';
import { Bookmark, Grid, List, Filter, Search, X, Heart, MessageCircle, Share2, MoreVertical, Image as ImageIcon, FileText, FileVideo, FileMusic } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeProvider';
import Navbar from '../components/Navbar';

const Saved = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'posts', 'articles', 'videos', 'music'
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useDarkMode();

  // Mock data for saved items
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      type: 'post',
      title: 'Amazing sunset at the beach',
      content: 'Just captured this beautiful moment during my evening walk. Nature never ceases to amaze me!',
      image: 'https://source.unsplash.com/random/800x600?sunset',
      author: {
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        username: 'johndoe'
      },
      likes: 245,
      comments: 18,
      timestamp: '2 days ago',
      tags: ['nature', 'sunset', 'beach', 'photography']
    },
    {
      id: 2,
      type: 'article',
      title: 'The Future of Web Development',
      content: 'Web development is constantly evolving. In this article, we explore the latest trends and technologies that are shaping the future of the web.',
      image: 'https://source.unsplash.com/random/800x600?coding',
      author: {
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        username: 'janesmith'
      },
      likes: 89,
      comments: 12,
      timestamp: '1 week ago',
      tags: ['web development', 'technology', 'future']
    },
    {
      id: 3,
      type: 'video',
      title: 'How to Make Perfect Sourdough Bread',
      content: 'Learn the art of making delicious sourdough bread from scratch with this step-by-step tutorial.',
      image: 'https://source.unsplash.com/random/800x600?bread',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        username: 'mikejohnson'
      },
      likes: 432,
      comments: 56,
      timestamp: '3 days ago',
      tags: ['cooking', 'bread', 'sourdough', 'tutorial']
    },
    {
      id: 4,
      type: 'music',
      title: 'Summer Vibes Playlist',
      content: 'A curated collection of the best summer songs to get you in the mood for sunny days and warm nights.',
      image: 'https://source.unsplash.com/random/800x600?music',
      author: {
        name: 'Sarah Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        username: 'sarahwilson'
      },
      likes: 178,
      comments: 24,
      timestamp: '5 days ago',
      tags: ['music', 'playlist', 'summer']
    },
    {
      id: 5,
      type: 'post',
      title: 'New Project Announcement',
      content: 'Excited to announce my latest project that I\'ve been working on for the past few months. Stay tuned for more details!',
      image: 'https://source.unsplash.com/random/800x600?project',
      author: {
        name: 'Alex Brown',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        username: 'alexbrown'
      },
      likes: 312,
      comments: 42,
      timestamp: '1 day ago',
      tags: ['project', 'announcement', 'excited']
    },
    {
      id: 6,
      type: 'article',
      title: '10 Tips for Better Productivity',
      content: 'Discover these proven strategies to boost your productivity and get more done in less time.',
      image: 'https://source.unsplash.com/random/800x600?productivity',
      author: {
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
        username: 'emilydavis'
      },
      likes: 156,
      comments: 28,
      timestamp: '2 weeks ago',
      tags: ['productivity', 'tips', 'work']
    },
    {
      id: 7,
      type: 'video',
      title: 'Travel Vlog: Japan Adventure',
      content: 'Join me on my journey through Japan, exploring the culture, food, and beautiful landscapes.',
      image: 'https://source.unsplash.com/random/800x600?japan',
      author: {
        name: 'Chris Taylor',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
        username: 'christaylor'
      },
      likes: 567,
      comments: 73,
      timestamp: '4 days ago',
      tags: ['travel', 'japan', 'vlog']
    },
    {
      id: 8,
      type: 'music',
      title: 'Chill Lofi Beats',
      content: 'Perfect background music for studying, working, or just relaxing.',
      image: 'https://source.unsplash.com/random/800x600?lofi',
      author: {
        name: 'David Lee',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
        username: 'davidlee'
      },
      likes: 289,
      comments: 35,
      timestamp: '6 days ago',
      tags: ['music', 'lofi', 'study']
    },
    {
      id: 9,
      type: 'post',
      title: 'New Camera Gear',
      content: 'Just upgraded my photography equipment. Can\'t wait to test it out and share the results!',
      image: 'https://source.unsplash.com/random/800x600?camera',
      author: {
        name: 'Lisa Chen',
        avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
        username: 'lisachen'
      },
      likes: 198,
      comments: 31,
      timestamp: '3 days ago',
      tags: ['photography', 'gear', 'camera']
    }
  ]);

  // Filter items based on selected filter and search query
  const filteredItems = savedItems.filter(item => {
    // Filter by type
    if (filter !== 'all' && item.type !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.author.name.toLowerCase().includes(query) ||
        item.author.username.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Get icon based on item type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'post':
        return <ImageIcon size={16} />;
      case 'article':
        return <FileText size={16} />;
      case 'video':
        return <FileVideo size={16} />;
      case 'music':
        return <FileMusic size={16} />;
      default:
        return <ImageIcon size={16} />;
    }
  };

  // Handle removing a saved item
  const handleRemoveItem = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-72">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Saved Items</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your collection of saved posts, articles, videos, and more
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className={`mb-6 p-4 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              <div className={`flex rounded-lg overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === 'all'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('post')}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === 'post'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setFilter('article')}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === 'article'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Articles
                </button>
                <button
                  onClick={() => setFilter('video')}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === 'video'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setFilter('music')}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    filter === 'music'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Music
                </button>
              </div>

              {/* View Toggle */}
              <div className={`flex rounded-lg overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${
                    viewMode === 'grid'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${
                    viewMode === 'list'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Items */}
        {filteredItems.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden shadow-sm ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Item Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium text-sm">{item.author.name}</h3>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        @{item.author.username} • {item.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className={`p-1 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Item Content */}
                <div className="p-4">
                  <h2 className="font-medium text-lg mb-2">{item.title}</h2>
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.content}
                  </p>
                  
                  {/* Item Image */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Interaction Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart size={16} className={`mr-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {item.likes}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={16} className={`mr-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {item.comments}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className={`p-1 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}>
                        <Share2 size={16} />
                      </button>
                      <button className={`p-1 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center py-12 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-sm`}>
            <Bookmark size={48} className={`mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-medium mb-2">No saved items found</h3>
            <p className={`text-center max-w-md ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {searchQuery
                ? `No items match your search "${searchQuery}". Try adjusting your search terms.`
                : filter !== 'all'
                ? `You haven't saved any ${filter}s yet.`
                : "You haven't saved any items yet. When you save posts, articles, videos, or music, they'll appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;