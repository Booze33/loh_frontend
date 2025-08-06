'use server';

import { cookies } from 'next/headers';

const {
  NEXT_PUBLIC_API_URL: API_URL,
} = process.env;

export const getChats = async () => {
  try {
    if (!API_URL) {
      console.error("API URL is not configured");
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      console.log("No authentication token found");
      return null;
    }

    const response = await fetch(`${API_URL}/chat/sessions`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    const chats = await response.json();
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

export const createChat = async (title: string, chatHandle: string) => {
  try {
    if (!API_URL) {
      console.error("API URL is not configured");
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      console.log("No authentication token found");
      return null;
    }

    const response = await fetch(`${API_URL}/chat/sessions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, chatHandle }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export const sendChatMessage = async (id: string, content: string) => {
  try {
    if (!API_URL) {
      console.error("API URL is not configured");
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      console.log("No authentication token found");
      return null;
    }

    const response = await fetch(`${API_URL}/chat/sessions/${id}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    const chatMessage = await response.json();
    return chatMessage;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

export const getMessages = async (id: string) => {
  try {
    if (!API_URL) {
      console.error("API URL is not configured");
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      console.log("No authentication token found");
      return null;
    }

    const response = await fetch(`${API_URL}/chat/sessions/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    const chatMessages = await response.json();
    return chatMessages;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}