'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { SignUp } from '@/lib/actions/user.action';
import { 
  loadGoogleSDK, 
  isGoogleSDKLoaded, 
  initializeGoogleSignIn,
  authenticateWithGoogle 
} from '@/lib/utils/google-auth';
import { Button } from '@/components/ui/button';
import { FaGoogle } from "react-icons/fa6";
import { Slack, UserRound, Mail, Lock, UserPen } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleCredentialResponse {
  credential: string;
}

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const formSchema = FormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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

  const initializeGoogle = useCallback(async () => {
    try {
      if (!isGoogleSDKLoaded()) {
        await loadGoogleSDK();
      }

      await initializeGoogleSignIn(handleGoogleSignIn);

      // Wait for next tick to ensure DOM is ready
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
              // Add these properties to help with COOP issues
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

    console.log('Attempting to trigger Google sign-in');
    console.log('SDK Ready:', sdkReady);
    console.log('Window.google exists:', !!window.google);
    console.log('Google accounts exists:', !!window.google?.accounts);
    console.log('Google button container:', googleButtonRef.current);
    console.log('Google button element:', googleButtonRef.current?.querySelector('div[role=button]'));

    const googleButton = googleButtonRef.current?.querySelector('div[role=button]') as HTMLElement;
    
    if (googleButton) {
      console.log('Found Google button, clicking it');
      googleButton.click();
    } else if (window.google?.accounts?.id) {
      console.log('Google button not found, triggering prompt');
      try {
        // Try prompt first, if it fails due to COOP, the button click should work
        window.google.accounts.id.prompt((notification: any) => {
          console.log('Prompt notification:', notification);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If prompt fails, try clicking the rendered button
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
      const newUser = await SignUp(data.name, data.email, data.password);

      if (newUser) {
        sessionStorage.setItem('userEmail', data.email);
        router.push('/verify_email');
      }
    } catch (error: unknown) {
      console.error("Error during registration:", error);
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
          className="w-[35vw] max-w-[500px] h-[90vh] bg-white border border-gray-200 rounded-md flex flex-col items-center px-8 pt-6 pb-6"
        >
          <header className="w-full text-center mb-4">
            <h1 className="font-extrabold text-3xl">Create Account</h1>
            <p className="text-gray-500 text-sm mt-2">Get started with your personal AI assistant</p>
          </header>

          {/* Hidden Google button container - this is where Google renders its actual button */}
          <div 
            ref={googleButtonRef} 
            className="hidden"
            id="googleButtonContainer"
          />
          
          {/* Custom styled button that triggers the hidden Google button */}
          <Button
            type="button"
            onClick={handleCustomGoogleClick}
            disabled={googleLoading || !sdkReady}
            className="w-full flex items-center justify-center mt-2 bg-white border border-gray-200 rounded-md py-2 text-black hover:bg-gray-100 disabled:opacity-50"
          >
            <FaGoogle />
            <span className="ml-2">
              {googleLoading ? "Signing in..." : "Sign Up with Google"}
            </span>
          </Button>

          <Button
            type="button"
            className="w-full flex items-center justify-center mt-4 bg-white border border-gray-200 rounded-md py-2 text-black hover:bg-gray-100"
          >
            <Slack />
            <span className="ml-2">Sign Up with Slack</span>
          </Button>

          <div className="w-full flex items-center justify-center mt-8 mb-4">
            <div className="w-1/4 h-px bg-gray-200" />
            <p className="text-gray-500 text-xs mx-4">OR CREATE AN ACCOUNT WITH</p>
            <div className="w-1/4 h-px bg-gray-200" />
          </div>

          <div className="relative w-full flex flex-col mt-4 group">
            <label htmlFor="name" className="font-bold text-sm">Name</label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-200 w-4 h-4" />
              <input
                id="name"
                type="name"
                placeholder="Enter your full name"
                className="w-full h-10 pl-10 pr-4 mt-1 bg-white border border-gray-200 rounded-md"
                {...form.register("name")}
              />
            </div>
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
            <UserPen />
            <span className="ml-2">{isLoading ? "Creating..." : "Create Account"}</span>
          </Button>

          <p className="mt-4 text-sm">
            Already have an account?
            <Link href="/login" className="font-semibold ml-2 text-blue-600 hover:underline">Login</Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignUpPage;