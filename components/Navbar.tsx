'use client';

import Status from "./AIStatus";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Moon, LogOut, UserRound, Settings, Sun  } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { GetLoggedInUser, SignOut } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User, AuthUser } from "@/types";
import { useNotifications } from "@/hooks/notificationStore";

const Navbar = () => {
  const router = useRouter();
  const notifications = useNotifications();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
   const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  const handleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

   const handleLogout = async () => {
    try {
      await SignOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

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

  return (
    <nav className="absolute top-0 border-b-2 w-full h-[4rem] flex flex-row">
        <div className="border-r-2 w-[20vw] h-full flex items-center justify-center">
            <Logo size="lg" />
        </div>
        <div className="w-full h-full flex items-center justify-between">
            <Status />
            <div className="flex flex-row items-center justify-between w-[5rem] mr-4">
                <Button className="bg-transparent" onClick={handleTheme}>
                    {theme === 'light' ? <Moon color="#000" /> : <Sun color="#fff" />}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        {user && (
                            <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className="flex flex-row items-center justify-between" href='/profile'>
                                <UserRound  color="#000" />
                                <span className="ml-4 text-sm">Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className="flex flex-row items-center justify-between" href='/settings'>
                                <Settings  color="#000" />
                                <span className="ml-4 text-sm">Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <div className="flex flex-row items-center justify-between" onClick={handleLogout}>
                                <LogOut color="#000" />
                                <span className="ml-4 font-semibold text-sm">Log Out</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </nav>
  )
}

export default Navbar;