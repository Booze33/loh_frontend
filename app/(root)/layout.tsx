'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { GetLoggedInUser } from '@/lib/actions/user.action';
import { User, AuthUser } from '@/types';
import Loader from "@/components/loader";
import { useNotifications } from "@/hooks/notificationStore";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const notifications = useNotifications();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await GetLoggedInUser();

        if (!loggedInUser) {
          notifications.error(
            "Authentication Error",
            "Please login again",
            { duration: 0,
              action: {
                label: "Go to Login",
                onClick: () => {
                  router.push('/login');
                }
              }
            }
          );
          router.push('/login');
        }

        setUser(loggedInUser as User);
      } catch (error) {
        notifications.error(
          'Authentication Error',
          'Failed to verify your login status. Please try logging in again.',
          {
            duration: 0,
            action: {
              label: 'Go to Login',
              onClick: () => router.push('/login')
            }
          }
        );
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-[100vw] min-h-screen">
        <Loader size={100} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <Navbar />
      {children}
    </div>
  );
}