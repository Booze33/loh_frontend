'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { SignUp } from '@/lib/actions/user.action';
import { Button } from '@/components/ui/button';
import { FaGoogle } from "react-icons/fa6";
import { Slack, UserRound, Mail, Lock, UserPen } from 'lucide-react';

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const newUser = await SignUp(data.name, data.email, data.password);

      if (newUser) {
        localStorage.setItem('userEmail', data.email);
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

          <Button
            type="button"
            className="w-full flex items-center justify-center mt-2 bg-white border border-gray-200 rounded-md py-2 text-black hover:bg-gray-100"
          >
            <FaGoogle />
            <span className="ml-2">Sign Up with Google</span>
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
