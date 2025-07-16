'use client';

export const loadGoogleSDK = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      console.error("Not in browser environment");
      reject(new Error("Not in browser environment"));
      return;
    }

    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!GOOGLE_CLIENT_ID) {
      console.error("Google Client ID not configured");
      reject(new Error("Google Client ID not configured"));
      return;
    }

    if (document.getElementById('google-oauth-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-oauth-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google SDK loaded successfully');
      resolve();
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Google SDK:', error);
      reject(new Error("Failed to load Google SDK"));
    };
    
    document.head.appendChild(script);
  });
};

export const loadGoogleSDKWithTimeout = (timeout: number = 10000) => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      console.error("Not in browser environment");
      reject(new Error("Not in browser environment"));
      return;
    }

    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!GOOGLE_CLIENT_ID) {
      console.error("Google Client ID not configured");
      reject(new Error("Google Client ID not configured"));
      return;
    }

    if (document.getElementById('google-oauth-script')) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error("Google SDK loading timed out"));
    }, timeout);

    const script = document.createElement('script');
    script.id = 'google-oauth-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      clearTimeout(timeoutId);
      console.log('Google SDK loaded successfully');
      resolve();
    };
    
    script.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error('Failed to load Google SDK:', error);
      reject(new Error("Failed to load Google SDK"));
    };
    
    document.head.appendChild(script);
  });
};

export const isGoogleSDKLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         document.getElementById('google-oauth-script') !== null &&
         window.google !== undefined;
};

export const initializeGoogleSignIn = async (callback: (response: any) => void) => {
  try {
    await loadGoogleSDK();
    
    if (!window.google) {
      throw new Error('Google SDK not loaded');
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('Google Client ID not configured');
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
      // context: 'signup'
    });

    return true;
  } catch (error) {
    console.error('Failed to initialize Google Sign-In:', error);
    throw error;
  }
};

export const authenticateWithGoogle = async (credential: string) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    if (!credential) {
      throw new Error("Google credential is required");
    }

    const response = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: credential }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error in Google auth response', errorData);
      throw new Error(errorData.error || "Google authentication failed");
    }

    const data = await response.json();

    if (!data.token) {
      console.error("No token received from Google auth");
      throw new Error("Authentication failed - no token received");
    }

    console.log('Google Data:', data)

    return data;
  } catch (error) {
    console.error("Google authentication error:", error);
    throw error;
  }
};