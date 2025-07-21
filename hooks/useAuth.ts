'use client';

import { User } from "@/types";
import { useEffect, useState } from "react";
import { GetLoggedInUser } from '@/lib/actions/user.action';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await GetLoggedInUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    token: user ? 'token_stored_in_httponly_cookie' : null,
    isLoading,
    isAuthenticated: !!user,
  };
}