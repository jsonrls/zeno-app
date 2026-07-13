"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, safeGetSession, safeSignOut, getBaseUrl } from "./supabase";
import { checkRateLimit, RATE_LIMITS, createRateLimitError } from "./security";
import { checkEmailUniquenessClient } from "./emailUniqueness";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; username: string; course: string; yearLevel: string }) => Promise<any>;
  signIn: (identifier: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await safeGetSession();
        if (error) {
          console.error("Error getting session:", error);
          // If there's an error getting session, treat as no session
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Failed to get initial session:", error);
        // If there's an exception, treat as no session
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          // Handle different auth events
          if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
            setSession(session);
            setUser(session?.user ?? null);
          }
          setLoading(false);
        } catch (error) {
          console.error("Auth state change error:", error);
          // On error, clear the session
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Check rate limit for signup attempts
      const rateLimitResult = checkRateLimit(email, RATE_LIMITS.SIGNUP);
      if (!rateLimitResult.allowed) {
        const rateLimitError = createRateLimitError(rateLimitResult.resetTime);
        return { data: null, error: rateLimitError };
      }

      // Check email uniqueness before attempting signup
      const emailUniquenessResult = await checkEmailUniquenessClient(email);
      if (!emailUniquenessResult.isAvailable) {
        const error = emailUniquenessResult.error || 
          'This email address is already registered. Please use a different email or try signing in instead.';
        return { data: null, error: { message: error } };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${getBaseUrl()}/dashboard`
        }
      });

      if (error) {
        // Handle specific Supabase auth errors
        if (error.message?.includes('User already registered')) {
          const customError = { 
            message: 'This email address is already registered. Please use a different email or try signing in instead.' 
          };
          return { data: null, error: customError };
        }
        throw error;
      }

      // The database's on_auth_user_created trigger creates the corresponding
      // profile from userData. This also works when email confirmation is on
      // and signUp intentionally returns no authenticated session.
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('User already registered') || 
          error.message?.includes('email') && error.message?.includes('already')) {
        const customError = { 
          message: 'This email address is already registered. Please use a different email or try signing in instead.' 
        };
        return { data: null, error: customError };
      }
      
      return { data: null, error };
    }
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      const normalizedIdentifier = identifier.trim().toLowerCase();

      // Check rate limit for login attempts
      const rateLimitResult = checkRateLimit(normalizedIdentifier, RATE_LIMITS.LOGIN);
      if (!rateLimitResult.allowed) {
        const rateLimitError = createRateLimitError(rateLimitResult.resetTime);
        return { data: null, error: rateLimitError };
      }

      // Supabase Auth accepts an email/password pair. A username is resolved
      // to its profile email first, then follows the same normal Auth flow.
      const usesEmail = normalizedIdentifier.includes('@');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        [usesEmail ? 'eq' : 'ilike'](usesEmail ? 'email' : 'username', normalizedIdentifier)
        .maybeSingle();

      if (profileError) {
        console.error('Profile lookup during sign in failed:', profileError);
      }

      const email = profileData?.email || (usesEmail ? normalizedIdentifier : '');

      if (!email) {
        return {
          data: null,
          error: new Error('Invalid email or username, or password. Please try again.'),
        };
      }

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Keep the identifier failure generic; this avoids revealing whether a
        // particular email address or username is registered.
        if (error.message.includes('Invalid login credentials')) {
          return {
            data: null,
            error: new Error('Invalid email or username, or password. Please try again.'),
          };
        }
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await safeSignOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      // Always clear the local state regardless of success/failure
      setSession(null);
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if signOut fails, clear the local state
      setSession(null);
      setUser(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
