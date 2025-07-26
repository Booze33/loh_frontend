'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlackAuth } from '@/lib/actions/user.action';
import { useNotifications } from '@/hooks/notificationStore';

const SlackCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const notifications = useNotifications();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          notifications.error(
            'Error occured',
            "Authentication failed. Please try again.",
            { duration: 0 }
          );
          return;
        }

        if (!code) {
          setStatus('error');
          notifications.error(
            'Error:',
            "No authorization code received",
            { duration: 0 }
          );
          return;
        }

        const response = await SlackAuth(code, state || '');

        if (response && response.user) {
          setStatus('success');
          notifications.success(
            'Success',
            'Authentication successful! Redirecting...',
            { duration: 5000 }
          );

          setTimeout(() => {
            router.push('/');
          }, 2000);
        };
      } catch (error) {
        console.error('Slack callback failed:', error);
        notifications.error(
          'Slack callback failed:',
          error instanceof Error ? error.message : 'Authentication failed',
          { duration: 0 }
        );
        setStatus('error');
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A154B] mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Authentication</h2>
              <p className="text-gray-600">Please wait while we verify your Slack credentials...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-green-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
              <button 
                onClick={() => router.push('/login')}
                className="bg-[#4A154B] hover:bg-[#350d36] text-white px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
    </div>
  )
}

export default SlackCallback;