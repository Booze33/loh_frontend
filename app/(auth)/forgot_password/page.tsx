'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordFormSchema } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { ForgotPassword } from '@/lib/actions/user.action';
import { Button } from '@/components/ui/button';
import { Send, Mail } from 'lucide-react';
import { useNotifications } from '@/hooks/notificationStore';

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = PasswordFormSchema();
    const notifications = useNotifications();
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
      },
    });
  
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);
  
      try {
        const newUser = await ForgotPassword(data.email);
  
        if (newUser) {
          localStorage.setItem('userEmail', data.email);
        }
      } catch (error: unknown) {
        notifications.error(
          'Error during registration',
          error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.",
          { duration: 0 }
        );
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[35vw] max-w-[500px] h-[45vh] bg-white border border-gray-200 rounded-md flex flex-col items-center px-8 pt-6 pb-8"
          >
            <header className="w-full text-center mb-4">
              <h1 className="font-extrabold text-3xl">Forgot Password?</h1>
              <p className="text-gray-500 text-sm mt-2">Enter your email address and we'll send you a link to reset your password</p>
            </header>
  

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
  
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center mt-6 bg-black border border-gray-200 rounded-md py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <Send />
              <span className="ml-2">{isLoading ? "Sending..." : "Send Reset Link"}</span>
            </Button>
  
            <p className="mt-4 text-sm">
              <Link href="/forgot_password" className="font-semibold ml-2 text-blue-600 hover:underline">Back to Login</Link>
            </p>
          </form>
        </Form>
      </div>
    );
  };
  
  export default ForgotPasswordPage;
  