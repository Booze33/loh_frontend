'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from '@/lib/utils';
import {
  Form
} from '@/components/ui/form';
import { SignUp } from '@/lib/actions/user.action';

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
      password: ''
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
        setErrorMessage("Failed to send reset instructions. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center bg-gray-100">
      <Form>
      </Form>
    </div>
  )
}

export default SignUpPage;