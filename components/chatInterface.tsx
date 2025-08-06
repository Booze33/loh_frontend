'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Input } from './ui/input'
import { Mic, Send, Mail, Calendar, SquareCheckBig, FileText, UsersRound, Clock } from 'lucide-react';
import { Button } from './ui/button';
import ActionCard from './ActionCard';
import { getMessages, sendChatMessage } from '@/lib/actions/chat.action';
import { Chat, ChatMessage, User } from '@/types';

const useWebSocket = (chatId: string) => {
  const [wsMessages, setWsMessages] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current || !chatId) return;

    const ws = new WebSocket("wss://socket-prioprity-pro.onrender.com");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ type: 'join', chatId }));
    };

    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.type === 'message' && messageData.chatId === chatId) {
          setWsMessages((prev) => [...prev, messageData.data]);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting in 3 seconds...');
      wsRef.current = null;
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [chatId]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

  const sendWebSocketMessage = useCallback((message: ChatMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        chatId,
        data: message
      }));
    }
  }, [chatId]);

  return { wsMessages, setWsMessages, sendWebSocketMessage };
};

const useChatInitialization = (chatId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const chatMessages = await getMessages(chatId);
        setMessages(Array.isArray(chatMessages) ? chatMessages : []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
        setError(errorMessage);
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [chatId]);

  return { loading, error, messages, setMessages };
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs text-gray-300 mt-1 block">
          {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

const ChatInterface = ({ className='', chatId='' }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { loading, error, messages, setMessages } = useChatInitialization(chatId);
  const { wsMessages, sendWebSocketMessage } = useWebSocket(chatId);

  const allMessages = [...messages, ...wsMessages];

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId || isLoading) return;

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: message.trim(),
      sender: 'user',
      sessionId: chatId,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(chatId, message.trim());
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));

      if (response?.userMessage && response?.assistantMessage) {
        setMessages((prev) => [...prev, response.userMessage, response.assistantMessage]);

        sendWebSocketMessage(response.assistantMessage);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  

  const handleActionClick = async (actionText: string) => {
    if (!actionText.trim() || !chatId || isLoading) return;

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: actionText.trim(),
      sender: 'user',
      sessionId: chatId,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(chatId, actionText.trim());
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
  
      if (response?.userMessage && response?.assistantMessage) {
        setMessages((prev) => [...prev, response.userMessage, response.assistantMessage]);
  
        sendWebSocketMessage(response.assistantMessage);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className="w-full h-[63vh] overflow-y-auto px-[10vw] py-4 bg-white dark:bg-[#000]">
        {allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation by typing a message below</p>
            </div>
          </div>
        ) : (
          <>
            {allMessages.map((msg, index) => (
              <MessageBubble key={msg.id || index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="flex flex-col items-start px-[10vw] w-full h-[17.5vh] border border-gray-200 pt-2 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-gray-600 dark:text-gray-300 text-md font-semibold">Quick Actions</h3>
        <div className="flex flex-row">
        <ActionCard 
            icon={<Mail className="text-gray-900" size={16} />} 
            text="Summarize my emails" 
            className="border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer" 
            onClick={() => handleActionClick("Summarize my emails")}
          />
          <ActionCard 
            icon={<Calendar className="text-gray-900" size={16} />} 
            text="Schedule a Meeting" 
            className="border-green-200 bg-green-50 hover:bg-green-100 cursor-pointer"
            onClick={() => handleActionClick("Schedule a Meeting")}
          />
          <ActionCard 
            icon={<SquareCheckBig className="text-gray-900" size={16} />} 
            text="Log a Task" 
            className="border-violet-200 bg-violet-50 hover:bg-violet-100 cursor-pointer"
            onClick={() => handleActionClick("Log a Task")}
          />
          <ActionCard 
            icon={<FileText className="text-gray-900" size={16} />} 
            text="Create Notes" 
            className="border-orange-200 bg-orange-50 hover:bg-orange-100 cursor-pointer"
            onClick={() => handleActionClick("Create Notes")}
          />
          <ActionCard 
            icon={<UsersRound className="text-gray-900" size={16} />} 
            text="Team Update" 
            className="border-sky-200 bg-sky-50 hover:bg-sky-100 cursor-pointer"
            onClick={() => handleActionClick("Team Update")}
          />
          <ActionCard 
            icon={<Clock className="text-gray-900" size={16} />} 
            text="Check Schedule" 
            className="border-purple-200 bg-purple-50 hover:bg-purple-100 cursor-pointer"
            onClick={() => handleActionClick("Check Schedule")}
          />
        </div>
      </div>
      <div className="flex flex-row items-center px-[10vw] w-full h-[11vh]">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Type your message or ask me anything ..." 
            className="bg-white border border-gray-200 rounded-md w-[50vw] h-[3rem] pl-10 pr-4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading  || !chatId}
          />
          <Mic className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-900 group-focus-within:text-black transition-colors duration-200 w-4 h-4" />
        </div>
        <Button 
          type="button" 
          className="ml-4 h-[3rem] w-[5rem]"
          onClick={handleSendMessage}
          disabled={!message.trim() || !chatId || isLoading}
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}

export default ChatInterface