import { string } from "zod";

export interface User {
  id: string;
  email: string;
  name: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  avatarUrl?: string;
  isEmailVerified: boolean;
}

export interface UsersResponse {
  success: boolean;
  data?: User[];
  error?: string;
  timestamp?: string;
}
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isEmailVerified: boolean;
  };
  message?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export type LoggedInContextType = {
  isLoggedIn: boolean;
};

export type ParamProps = {
  params: {
    token: string;
  };
};

export type VerifyEmailResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type Chat = {
  id: string;
  userId: string;
  title: string;
  chatHandle: string;
  messages: ChatMessage[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ChatMessage = {
  id: string;
  sessionId: string;
  sender: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export interface AIStatusStore {
  status: AIStatus
  message: string
  setStatus: (status: AIStatus) => void
  setListening: () => void
  setThinking: () => void
  setResponding: () => void
  setIdle: () => void
}
