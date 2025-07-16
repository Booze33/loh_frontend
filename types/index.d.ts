export interface User {
  id: string;
  email: string;
  name: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  password: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
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

