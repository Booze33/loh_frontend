import { ColumnDef } from "@tanstack/react-table";
import { IconType } from "react-icons";

// User Interface
export interface User {
  id: string;
  role?: Role;
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

declare interface AuthResponse {
  token?: string;
  user?: {
    name: string;
    email: string;
  };
  message?: string;
}

declare interface ForgotPasswordResponse {
  message: string;
}

declare interface ResetPasswordResponse {
  message: string;
}

declare type LoggedInContextType = {
  isLoggedIn: boolean;
};

declare type ParamProps = {
  params: {
    token: string;
  };
};

declare type VerifyEmailResponse = {
  success: boolean;
  message: string;
};

declare type UserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

