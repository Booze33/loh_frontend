'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { SignIn } from '@/lib/actions/user.action';
import {
  loadGoogleSDK,
  isGoogleSDKLoaded,
  initializeGoogleSignIn,
  authenticateWithGoogle
} from '@/lib/utils/google-auth';
import { Button } from '@/components/ui/button';
import { FaGoogle } from "react-icons/fa6";
import { Slack, Mail, Lock, LogIn } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleCredentialResponse {
  credential: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [slackLoading, setSlackLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const formSchema = SignInFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const handleGoogleSignIn = useCallback(async (response: GoogleCredentialResponse) => {
    setGoogleLoading(true);
    setErrorMessage("");
    
    try {
      const result = await authenticateWithGoogle(response.credential);
      if (result?.user) {
        router.push('/');
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setErrorMessage(error instanceof Error ? error.message : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  }, [router]);

  const handleSlackSignIn = useCallback(async () => {
    setSlackLoading(true);
    setErrorMessage("");
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/slack`;
    } catch (error) {
      console.error('Slack sign-in failed:', error);
      setErrorMessage(error instanceof Error ? error.message : "Slack sign-in failed");
    } finally {
      setSlackLoading(false);
    }
  }, []);

  const initializeGoogle = useCallback(async () => {
    try {
      if (!isGoogleSDKLoaded()) {
        await loadGoogleSDK();
      }
      
      await initializeGoogleSignIn(handleGoogleSignIn);
      
      setTimeout(() => {
        if (googleButtonRef.current && window.google) {
          console.log('Rendering Google button to:', googleButtonRef.current);
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              use_fedcm_for_prompt: false,
              cancel_on_tap_outside: false
            }
          );
        } else {
          console.log('Google button ref or window.google not available:', {
            ref: googleButtonRef.current,
            google: window.google
          });
        }
      }, 100);
      
      setSdkReady(true);
    } catch (error) {
      console.error('Failed to initialize Google SDK:', error);
      setErrorMessage("Failed to load Google authentication");
    }
  }, [handleGoogleSignIn]);

  useEffect(() => {
    initializeGoogle();
  }, [initializeGoogle]);

  const handleCustomGoogleClick = () => {
    if (!sdkReady || googleLoading) return;
    
    const googleButton = googleButtonRef.current?.querySelector('div[role=button]') as HTMLElement;
    if (googleButton) {
      googleButton.click();
    } else if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const button = googleButtonRef.current?.querySelector('div[role=button]') as HTMLElement;
            if (button) {
              button.click();
            }
          }
        });
      } catch (error) {
        console.error('Error triggering Google prompt:', error);
        setErrorMessage('Failed to start Google sign-in. Please try again.');
      }
    } else {
      console.log('Google SDK not fully loaded, attempting to reinitialize');
      setErrorMessage('Google sign-in not ready. Please wait or refresh the page.');
      initializeGoogle();
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const newUser = await SignIn(data.email, data.password);

      if (newUser) {
        localStorage.setItem('userEmail', data.email);
        router.push('/');
      }
    } catch (error: unknown) {
      console.error("Error during sign in:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[35vw] max-w-[500px] h-[75vh] bg-white border border-gray-200 rounded-md flex flex-col items-center px-8 pt-6 pb-8"
        >
          <header className="w-full text-center mb-4">
            <h1 className="font-extrabold text-3xl">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to continue with your personal AI assistant</p>
          </header>

          <div
            ref={googleButtonRef}
            className="hidden"
            id="googleButtonContainer"
          />

          <Button
            type="button"
            onClick={handleCustomGoogleClick}
            disabled={googleLoading || !sdkReady}
            className="w-full flex items-center justify-center mt-2 bg-white border border-gray-200 rounded-md py-2 text-black hover:bg-gray-100 disabled:opacity-50"
          >
            <FaGoogle />
            <span className="ml-2">
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </Button>

          <Button
            type="button"
            onClick={handleSlackSignIn}
            disabled={slackLoading}
            className="w-full flex items-center justify-center mt-4 bg-white border border-gray-200 rounded-md py-2 text-black hover:bg-gray-100 cursor-pointer"
          >
            <Slack />
            <span className="ml-2">Continue with Slack</span>
          </Button>

          <div className="w-full flex items-center justify-center mt-8 mb-4">
            <div className="w-1/4 h-px bg-gray-200" />
            <p className="text-gray-500 text-xs mx-4">OR CONTINUE WITH</p>
            <div className="w-1/4 h-px bg-gray-200" />
          </div>

          <div className="relative w-full flex flex-col mt-4 group">
            <label htmlFor="email" className="font-bold text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-200 w-4 h-4" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full h-10 pl-10 pr-4 mt-1 bg-white border border-gray-200 rounded-md"
                {...form.register("email")}
              />
            </div>
          </div>

          <div className="relative w-full flex flex-col mt-4 group">
            <label htmlFor="password" className="font-bold text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-200 w-4 h-4" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full h-10 pl-10 pr-4 mt-1 bg-white border border-gray-200 rounded-md"
                {...form.register("password")}
              />
            </div>
          </div>

          {errorMessage && (
            <p className="w-full text-red-500 text-sm mt-4 text-center">{errorMessage}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center mt-6 bg-black border border-gray-200 rounded-md py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            <LogIn />
            <span className="ml-2">{isLoading ? "Signing In..." : "Sign In"}</span>
          </Button>

          <p className="mt-4 text-sm w-full flex flex-row justify-between">
            <Link href="/forgot_password" className="font-semibold ml-2 text-blue-600 hover:underline">Forgot Password?</Link>
            <Link href="/sign_up" className="font-semibold ml-2 text-blue-600 hover:underline">Create Account</Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;