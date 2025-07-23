import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Phone, 
  Video, 
  Info,
  ArrowLeft,
  User,
  CheckCheck,
  Plus,
  Briefcase,
  Loader2
} from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showProviderSearch, setShowProviderSearch] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerSearchTerm, setProviderSearchTerm] = useState('');
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const API_BASE_URL = 'http://localhost:3000/api';

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const chatIdFromUrl = urlParams.get('chat');
  const providerIdFromUrl = urlParams.get('provider');

  console.log('URL Parameters:', {
    chatIdFromUrl,
    providerIdFromUrl,
    serviceId: urlParams.get('serviceId'),
    serviceTitle: urlParams.get('serviceTitle')
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
    
    // Initialize socket connection
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);
    
    socketInstance.emit('setup', user);
    socketInstance.on('connected', () => {
      console.log('Socket connected');
    });
    
    socketInstance.on('message_received', (newMessage) => {
      if (selectedChat && newMessage.chat._id === selectedChat._id) {
        setMessages(prev => [...prev, newMessage]);
      } else {
        // Increment unread count for other chats
        setUnreadCounts(prev => ({
          ...prev,
          [newMessage.chat._id]: (prev[newMessage.chat._id] || 0) + 1
        }));
      }
      // Update chat list with new message
      setChats(prev => prev.map(chat => 
        chat._id === newMessage.chat._id 
          ? { ...chat, latestMessage: newMessage, updatedAt: newMessage.createdAt }
          : chat
      ));
    });
    
    socketInstance.on('typing', () => setTyping(true));
    socketInstance.on('stop_typing', () => setTyping(false));
    
    fetchChats();
    
    return () => {
      socketInstance.disconnect();
    };
  }, [navigate]);

  // Effect to handle URL parameters after chats are loaded
  useEffect(() => {
    console.log('URL Parameter Effect - chats.length:', chats.length, 'selectedChat:', selectedChat);
    if (chats.length > 0 && !selectedChat) {
      // If we have a specific chat ID from URL, select it
      if (chatIdFromUrl) {
        console.log('Looking for chat with ID:', chatIdFromUrl);
        
        // Validate that chatIdFromUrl is a valid MongoDB ObjectId
        if (typeof chatIdFromUrl === 'string' && chatIdFromUrl.length === 24) {
          const chat = chats.find(c => c._id === chatIdFromUrl);
          if (chat) {
            console.log('Found chat:', chat);
            setSelectedChat(chat);
            return;
          } else {
            console.log('Chat not found in chats array');
          }
        } else {
          console.error('Invalid chatIdFromUrl:', chatIdFromUrl);
        }
      }
      
      // If we have a provider ID from URL, find or create chat with that provider
      if (providerIdFromUrl) {
        console.log('Looking for chat with provider ID:', providerIdFromUrl);
        
        // Validate that providerIdFromUrl is a valid MongoDB ObjectId
        if (typeof providerIdFromUrl === 'string' && providerIdFromUrl.length === 24) {
          const chat = chats.find(c => 
            c.users.some(user => user._id === providerIdFromUrl)
          );
          if (chat) {
            console.log('Found chat with provider:', chat);
            setSelectedChat(chat);
            return;
          } else {
            console.log('Chat with provider not found');
          }
        } else {
          console.error('Invalid providerIdFromUrl:', providerIdFromUrl);
        }
      }
    }
  }, [chats, chatIdFromUrl, providerIdFromUrl, selectedChat]);

  useEffect(() => {
    console.log('Selected Chat Effect - selectedChat:', selectedChat);
    if (selectedChat) {
      console.log('Calling fetchMessages with chatId:', selectedChat._id);
      fetchMessages(selectedChat._id);
      // Clear unread count for selected chat
      setUnreadCounts(prev => ({
        ...prev,
        [selectedChat._id]: 0
      }));
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setChats(data || []);
        
        // If we have a provider ID from URL and no existing chat, create one
        if (providerIdFromUrl && data && data.length > 0) {
          const existingChat = data.find(chat => 
            chat.users.some(user => user._id === providerIdFromUrl)
          );
          
          if (!existingChat) {
            // Create a new chat with the provider
            await startConversationWithProvider(providerIdFromUrl);
          }
        }
      } else if (response.status === 404) {
        // No chats found - this is normal for new users
        setChats([]);
        
        // If we have a provider ID from URL, create a new chat
        if (providerIdFromUrl) {
          await startConversationWithProvider(providerIdFromUrl);
        }
      } else {
        throw new Error('Failed to fetch conversations');
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError('Failed to load conversations. Please try again.');
      }
      setChats([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      console.log('Fetching messages for chatId:', chatId, 'Type:', typeof chatId);
      
      // Validate that chatId is a valid MongoDB ObjectId
      if (!chatId || typeof chatId !== 'string' || chatId.length !== 24) {
        console.error('Invalid chatId:', chatId);
        setError('Invalid chat ID');
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/message/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.error('Error fetching providers:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          chatId: selectedChat._id
        })
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update chat list with latest message
        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, latestMessage: newMsg, updatedAt: newMsg.createdAt }
            : chat
        ));
        
        // Emit socket event for real-time messaging
        if (socket) {
          socket.emit('new_message', newMsg);
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!selectedChat) return;
    
    if (!typing) {
      setTyping(true);
      socket?.emit('typing', selectedChat._id);
    }
    
    const lastTypingTime = new Date().getTime();
    const timeLength = 3000;
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      
      if (timeDiff >= timeLength && typing) {
        socket?.emit('stop_typing', selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
    
    setTypingTimeout(newTimeout);
  };

  const startConversationWithProvider = async (providerId, serviceId = null, initialMessage = null) => {
    try {
      const token = localStorage.getItem('token');
      
      // Get service info from URL if available
      const serviceIdFromUrl = urlParams.get('serviceId');
      const serviceTitleFromUrl = urlParams.get('serviceTitle');
      
      const requestBody = {
        userId: providerId,
        serviceId: serviceId || serviceIdFromUrl,
        initialMessage: initialMessage || (serviceTitleFromUrl ? 
          `Hi! I'm interested in your "${serviceTitleFromUrl}" service. Can you tell me more about it?` : 
          null
        )
      };

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats(prev => [newChat, ...prev]);
        setSelectedChat(newChat);
        setShowProviderSearch(false);
        setProviderSearchTerm('');
        
        // Clear URL parameters after successful chat creation
        if (serviceIdFromUrl || serviceTitleFromUrl) {
          navigate('/messages', { replace: true });
        }
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const getOtherUser = (chat) => {
    return chat.users?.find(user => user._id !== currentUser?.id);
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = getOtherUser(chat);
    const searchLower = searchTerm.toLowerCase();
    return (
      otherUser?.firstName?.toLowerCase().includes(searchLower) ||
      otherUser?.lastName?.toLowerCase().includes(searchLower) ||
      otherUser?.email?.toLowerCase().includes(searchLower) ||
      chat.latestMessage?.content?.toLowerCase().includes(searchLower)
    );
  });

  const filteredProviders = providers.filter(provider => {
    const searchLower = providerSearchTerm.toLowerCase();
    return (
      provider.name?.toLowerCase().includes(searchLower) ||
      provider.categories?.some(cat => cat.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">
            Communicate with service providers and manage your conversations
          </p>
        </div>

        {/* Main Content */}
        <div className="relative">
          {!selectedChat ? (
            // Chat Boxes View
            <div className="space-y-6">
              {/* Header with New Chat Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">Your Conversations</h2>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setShowProviderSearch(!showProviderSearch);
                      if (!showProviderSearch) {
                        fetchProviders();
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Provider Search Panel */}
              {showProviderSearch && (
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Find Providers to Chat With</h4>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setShowProviderSearch(false)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search providers..."
                        value={providerSearchTerm}
                        onChange={(e) => setProviderSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                      {filteredProviders.slice(0, 12).map(provider => (
                        <Card 
                          key={provider.id}
                          className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => startConversationWithProvider(provider.userId)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{provider.name}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {provider.categories?.slice(0, 2).join(', ')}
                              </p>
                            </div>
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Error Display */}
              {error && (
                <div className="col-span-full mb-6">
                  <Alert variant="destructive">
                    <AlertDescription className="flex items-center justify-between">
                      <span>{error}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={fetchChats}
                        className="ml-4"
                      >
                        Retry
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Chat Boxes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  // Loading state
                  <div className="col-span-full">
                    <div className="text-center py-12">
                      <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Loading conversations...</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                          <Card key={index} className="p-4 animate-pulse">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : filteredChats.length === 0 ? (
                  // Empty state
                  <div className="col-span-full text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Messages!</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        You haven't started any conversations yet. Connect with service providers to get help with your projects, ask questions, or discuss your requirements.
                      </p>
                      <div className="space-y-3">
                        <Button 
                          onClick={() => {
                            setShowProviderSearch(true);
                            fetchProviders();
                          }}
                          className="w-full"
                          size="lg"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Find Providers to Chat With
                        </Button>
                        <p className="text-sm text-gray-500">
                          Browse our network of verified service providers
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Chat boxes
                  filteredChats.map((chat) => {
                    const otherUser = getOtherUser(chat);
                    const unreadCount = unreadCounts[chat._id] || 0;
                    
                    return (
                      <Card 
                        key={chat._id}
                        className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-primary-foreground" />
                            </div>
                            {unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                  {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Chat Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {otherUser?.firstName && otherUser?.lastName 
                                  ? `${otherUser.firstName} ${otherUser.lastName}`
                                  : otherUser?.email || 'Unknown User'
                                }
                              </h4>
                              <span className="text-xs text-gray-500">
                                {chat.latestMessage ? formatTime(chat.latestMessage.createdAt) : ''}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 truncate mb-2">
                              {chat.latestMessage?.content || 'No messages yet'}
                            </p>
                            
                            {/* Status indicators */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-500">Online</span>
                              </div>
                              {chat.latestMessage && (
                                <div className="flex items-center space-x-1">
                                  {chat.latestMessage.sender._id === currentUser?.id ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            // Chat Window View
            <div className="h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="flex h-full">
                {/* Chat List Sidebar */}
                <div className="flex flex-col w-80 border-r border-gray-200">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedChat(null)}
                        variant="ghost"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className="flex-1 overflow-y-auto">
                    {error && (
                      <Alert variant="destructive" className="m-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {filteredChats.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h4>
                        <p className="text-gray-500 text-sm">
                          Start conversations with providers who are interested in your services
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredChats.map((chat) => {
                          const otherUser = getOtherUser(chat);
                          const isSelected = selectedChat?._id === chat._id;
                          
                          return (
                            <div
                              key={chat._id}
                              onClick={() => setSelectedChat(chat)}
                              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                isSelected ? 'bg-blue-50 border-r-2 border-primary' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary-foreground" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {otherUser?.firstName && otherUser?.lastName 
                                        ? `${otherUser.firstName} ${otherUser.lastName}`
                                        : otherUser?.email || 'Unknown User'
                                      }
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {chat.latestMessage ? formatTime(chat.latestMessage.createdAt) : ''}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-500 truncate">
                                    {chat.latestMessage?.content || 'No messages yet'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex flex-col flex-1">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {(() => {
                              const otherUser = getOtherUser(selectedChat);
                              return otherUser?.firstName && otherUser?.lastName 
                                ? `${otherUser.firstName} ${otherUser.lastName}`
                                : otherUser?.email || 'Provider';
                            })()}
                          </h4>
                          <p className="text-xs text-gray-500">Service Provider</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message, index) => {
                      const isOwnMessage = message.sender._id === currentUser?.id;
                      const showDate = index === 0 || 
                        formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                      
                      return (
                        <div key={message._id}>
                          {showDate && (
                            <div className="flex justify-center mb-4">
                              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-white text-gray-900 border'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                isOwnMessage ? 'text-primary-foreground/70' : 'text-gray-500'
                              }`}>
                                <span className="text-xs">{formatTime(message.createdAt)}</span>
                                {isOwnMessage && (
                                  <CheckCheck className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    {typing && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-900 px-4 py-2 rounded-lg border">
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={sending}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim() || sending}
                        size="sm"
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Messages; 