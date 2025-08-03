'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/hooks/notificationStore";
import { createChat, getChats } from "@/lib/actions/chat.action";
import { GetLoggedInUser } from "@/lib/actions/user.action";
import { Chat, User } from "@/types";
import { MessageSquare, Plus, Clock, Sparkles, X, Briefcase, Calendar, Mail, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const notifications = useNotifications();
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [title, setTitle] = useState('');
  const [selectedHandle, setSelectedHandle] = useState<string>('');
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await GetLoggedInUser();

      if (!response) {
        return;
      }

      setUser(response);
    };

    fetchUser();
  }, []);

  const fetchChats = useCallback(async () => {
    if (!user || isLoadingChats) {
      return;
    }

    setIsLoadingChats(true);
    try {
      const response = await getChats();

      if (!response) {
        return;
      }

      setChats(response);

    } catch (error) {
      console.error("Error fetching chats:", error);
      notifications.error(
        'Error fetching chats:',
        'Failed to fetch chats. Please try again later.',
        {
          duration: 0,
        }
      );
    } finally {
      setIsLoadingChats(false);
    }
  }, [user, isLoadingChats, notifications]);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  const handlePopUp = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTitle('');
    setSelectedHandle('');
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    };

    if (showPopup) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return dateObj.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleCreateChat = async () => {
    if (!title.trim()) {
      notifications.error(
        'Title Required',
        'Please enter a title for your chat.',
        { duration: 3000 }
      );
      return;
    }

    setIsCreatingChat(true);
    try {
      const response = await createChat(title.trim(), selectedHandle);

      if (!response) {
        notifications.error(
          'Error creating chat',
          'Failed to create chat. Please try again.',
          { duration: 3000 }
        );
        return;
      }

      setChats([response, ...chats]);

      notifications.success(
        'Chat Created',
        `Successfully created "${title}" chat.`,
        { duration: 3000 }
      );

      setTitle('');
      setSelectedHandle('');
      closePopup();

    } catch (error) {
      console.error("Error creating chat:", error);
      notifications.error(
        'Error creating chat',
        'An unexpected error occurred. Please try again.',
        { duration: 3000 }
      );
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSelectHandle = (handleName: string) => {
    setSelectedHandle(selectedHandle === handleName ? '' : handleName);
  };

  const chatHandle = [
    {
      name: 'Work',
      icon: Briefcase
    },
    {
      name: 'Meetings',
      icon: Calendar,
    },
    {
      name: 'Email',
      icon: Mail
    },
    {
      name: 'Personal',
      icon: Star
    },
  ];

  return (
    <div className="w-full h-[95vh] mt-[4rem] flex flex-col items-center py-[2rem] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 z-10">
      <div className="flex items-center justify-center mb-4">
        <Sparkles className="h-12 w-12 text-blue-500 mr-3 animate-pulse" />
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          Hello <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.name || 'there'}</span>
        </h1>
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-300">
        I am <span className="text-blue-600 font-bold">Loh.ai</span>, your personal assistant
      </h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        Ready to help you with anything you need. Let's start a conversation!
      </p>

      <div className="w-full max-w-7xl mx-auto flex-1 mt-[4rem]">
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                Recent Activities
              </h2>
            </div>
            <Button onClick={handlePopUp} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {chats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {chats.slice(0, 8).map((chat) => {
                const getCategoryIcon = (handle: string) => {
                  const category = chatHandle.find(c => c.name === handle);
                  return category ? category.icon : MessageSquare;
                };

                const getCategoryColor = (handle: string) => {
                  const colors = {
                    'Work': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
                    'Meetings': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
                    'Email': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
                    'Personal': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700'
                  };
                  return colors[handle as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
                };

                const CategoryIcon = getCategoryIcon(chat.chatHandle);

                return (
                  <Link href={`/chat/${chat.id}`} key={chat.id} className="group">
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 h-44 flex flex-col justify-between hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group-hover:border-blue-300 dark:group-hover:border-blue-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="flex-1 relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {chat.title || 'Untitled Chat'}
                          </h3>
                          {chat.chatHandle && (
                            <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${getCategoryColor(chat.chatHandle)}`}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {chat.chatHandle}
                            </div>
                          )}
                        </div>
                        {chat.messages && chat.messages.length > 0 && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3 leading-relaxed">
                            {truncateText(chat.messages[0].content, 120)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(chat.updatedAt)}
                        </div>
                        {chat.messages && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mb-8">
                <MessageSquare className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                  Start your first conversation with Loh.ai and begin exploring the possibilities!
                </p>
              </div>
              <Button onClick={handlePopUp} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                Start Your First Chat
              </Button>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closePopup}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Start New Chat
              </h3>
              <button
                onClick={closePopup}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Give your chat a title and select a category to get started.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chat Title *
              </label>
              <Input 
                type="text" 
                placeholder="Enter a title for your chat" 
                className="mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isCreatingChat}
              />
              
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {chatHandle.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectHandle(item.name)}
                    disabled={isCreatingChat}
                    className={`h-12 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedHandle === item.name
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="ml-2 font-semibold text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={closePopup}
                variant="outline" 
                className="flex-1"
                disabled={isCreatingChat}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateChat}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreatingChat || !title.trim()}
              >
                {isCreatingChat ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Chat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}