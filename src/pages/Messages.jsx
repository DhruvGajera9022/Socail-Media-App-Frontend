import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, Image, Smile, MoreVertical, Phone, Video, User, Check, CheckCheck, X, File, FileText, FileImage, FileVideo, FileMusic } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeProvider';
import Navbar from '../components/Navbar';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { isDarkMode } = useDarkMode();
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock data for conversations
  const [conversations, setConversations] = useState([
    {
      id: 1,
      username: 'johndoe',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      lastMessage: 'Hey, how are you doing?',
      timestamp: '10:30 AM',
      unread: 2,
      online: true,
    },
    {
      id: 2,
      username: 'janedoe',
      name: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      lastMessage: 'Did you see the new project?',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
    },
    {
      id: 3,
      username: 'mikebrown',
      name: 'Mike Brown',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      lastMessage: 'Let\'s meet tomorrow',
      timestamp: 'Yesterday',
      unread: 0,
      online: true,
    },
    {
      id: 4,
      username: 'sarahsmith',
      name: 'Sarah Smith',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      lastMessage: 'Thanks for your help!',
      timestamp: 'Mon',
      unread: 0,
      online: false,
    },
    {
      id: 5,
      username: 'alexwilson',
      name: 'Alex Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      lastMessage: 'Check out this link',
      timestamp: 'Sun',
      unread: 0,
      online: false,
    },
  ]);

  // Mock data for messages
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'johndoe', content: 'Hey there!', timestamp: '10:15 AM', read: true },
      { id: 2, sender: 'me', content: 'Hi John! How are you?', timestamp: '10:20 AM', read: true },
      { id: 3, sender: 'johndoe', content: 'I\'m good, thanks! How about you?', timestamp: '10:25 AM', read: true },
      { id: 4, sender: 'me', content: 'Doing well, just working on some projects', timestamp: '10:28 AM', read: true },
      { id: 5, sender: 'johndoe', content: 'Hey, how are you doing?', timestamp: '10:30 AM', read: false },
    ],
    2: [
      { id: 1, sender: 'janedoe', content: 'Did you see the new project?', timestamp: 'Yesterday', read: true },
    ],
    3: [
      { id: 1, sender: 'mikebrown', content: 'Hey, are you free tomorrow?', timestamp: 'Yesterday', read: true },
      { id: 2, sender: 'me', content: 'Yes, what\'s up?', timestamp: 'Yesterday', read: true },
      { id: 3, sender: 'mikebrown', content: 'Let\'s meet tomorrow', timestamp: 'Yesterday', read: true },
    ],
    4: [
      { id: 1, sender: 'me', content: 'Here\'s the solution to your problem', timestamp: 'Mon', read: true },
      { id: 2, sender: 'sarahsmith', content: 'Thanks for your help!', timestamp: 'Mon', read: true },
    ],
    5: [
      { id: 1, sender: 'alexwilson', content: 'Check out this link', timestamp: 'Sun', read: true },
    ],
  });

  // Handle conversation selection
  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    // Mark messages as read
    if (conversation.unread > 0) {
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv
      );
      setConversations(updatedConversations);
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if ((!messageInput.trim() && selectedFiles.length === 0) || !selectedChat) return;
    
    const newMessage = {
      id: messages[selectedChat.id].length + 1,
      sender: 'me',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      files: selectedFiles.length > 0 ? [...selectedFiles] : null,
    };
    
    setMessages({
      ...messages,
      [selectedChat.id]: [...messages[selectedChat.id], newMessage],
    });
    
    setMessageInput('');
    setSelectedFiles([]);
    setShowFileSelector(false);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessageInput(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    setShowFileSelector(true);
  };

  // Remove a selected file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Get file icon based on file type
  const getFileIcon = (file) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image':
        return <FileImage size={20} />;
      case 'video':
        return <FileVideo size={20} />;
      case 'audio':
        return <FileMusic size={20} />;
      case 'text':
        return <FileText size={20} />;
      default:
        return <File size={20} />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-72">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Chat with your friends and connections
          </p>
        </div>

        <div className={`rounded-xl overflow-hidden shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)]">
            {/* Conversations List */}
            <div className={`w-full md:w-1/3 border-r ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectChat(conversation)}
                    className={`flex items-center p-4 cursor-pointer transition-colors ${
                      selectedChat?.id === conversation.id
                        ? isDarkMode
                          ? 'bg-gray-700'
                          : 'bg-blue-50'
                        : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{conversation.name}</h3>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {conversation.timestamp}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-2/3 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-4 border-b flex items-center justify-between ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={selectedChat.avatar}
                          alt={selectedChat.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedChat.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{selectedChat.name}</h3>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {selectedChat.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className={`p-2 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <Phone size={20} />
                      </button>
                      <button className={`p-2 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <Video size={20} />
                      </button>
                      <button className={`p-2 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className={`flex-1 overflow-y-auto p-4 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    {messages[selectedChat.id].map((message) => (
                      <div
                        key={message.id}
                        className={`flex mb-4 ${
                          message.sender === 'me' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender !== 'me' && (
                          <img
                            src={selectedChat.avatar}
                            alt={selectedChat.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <div className={`max-w-[70%] ${
                          message.sender === 'me' ? 'items-end' : 'items-start'
                        }`}>
                          <div className={`rounded-lg px-4 py-2 ${
                            message.sender === 'me'
                              ? isDarkMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-500 text-white'
                              : isDarkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-white text-gray-900'
                          }`}>
                            <p>{message.content}</p>
                            
                            {/* Display files if present */}
                            {message.files && message.files.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.files.map((file, index) => (
                                  <div 
                                    key={index}
                                    className={`flex items-center p-2 rounded ${
                                      isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                                    }`}
                                  >
                                    <div className="mr-2">
                                      {getFileIcon(file)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm truncate">{file.name}</p>
                                      <p className="text-xs opacity-70">{formatFileSize(file.size)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center mt-1 text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.sender === 'me' && (
                              <span className="ml-1">
                                {message.read ? <CheckCheck size={14} /> : <Check size={14} />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className={`p-2 border-t ${
                      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <div 
                            key={index}
                            className={`flex items-center p-2 rounded ${
                              isDarkMode ? 'bg-gray-700' : 'bg-white'
                            }`}
                          >
                            <div className="mr-2">
                              {getFileIcon(file)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{file.name}</p>
                              <p className="text-xs opacity-70">{formatFileSize(file.size)}</p>
                            </div>
                            <button 
                              onClick={() => removeFile(index)}
                              className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className={`p-4 border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center">
                      <div className="relative">
                        <button 
                          onClick={() => setShowFileSelector(!showFileSelector)}
                          className={`p-2 rounded-full ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Paperclip size={20} />
                        </button>
                        
                        {/* File Selector Dropdown */}
                        {showFileSelector && (
                          <div className={`absolute bottom-full left-0 mb-2 w-64 rounded-lg shadow-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-white'
                          }`}>
                            <div className="p-2">
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                className="hidden"
                              />
                              <button
                                onClick={() => fileInputRef.current.click()}
                                className={`w-full p-2 text-left rounded ${
                                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center">
                                  <File size={20} className="mr-2" />
                                  <span>Document</span>
                                </div>
                              </button>
                              <button
                                onClick={() => fileInputRef.current.click()}
                                className={`w-full p-2 text-left rounded ${
                                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center">
                                  <Image size={20} className="mr-2" />
                                  <span>Image</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button className={`p-2 rounded-full ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <Image size={20} />
                      </button>
                      
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className={`flex-1 mx-2 py-2 px-3 rounded-lg text-sm focus:outline-none ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white placeholder-gray-400' 
                            : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      
                      <div className="relative">
                        <button 
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={`p-2 rounded-full ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Smile size={20} />
                        </button>
                        
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                          <div 
                            ref={emojiPickerRef}
                            className="absolute bottom-full right-0 mb-2"
                          >
                            <Picker 
                              data={data} 
                              onEmojiSelect={handleEmojiSelect} 
                              theme={isDarkMode ? 'dark' : 'light'}
                            />
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() && selectedFiles.length === 0}
                        className={`p-2 rounded-full ${
                          (messageInput.trim() || selectedFiles.length > 0)
                            ? isDarkMode
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                            : isDarkMode
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`flex-1 flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="text-center">
                    <User size={48} className={`mx-auto mb-4 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Choose a chat from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
