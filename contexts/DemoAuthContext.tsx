'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Demo mode - just check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);

    if (!existingUser) {
      throw new Error('User not found. Please sign up first.');
    }

    if (existingUser.password !== password) {
      throw new Error('Invalid password');
    }

    const user = {
      uid: existingUser.uid,
      email: existingUser.email,
      displayName: existingUser.displayName,
    };

    localStorage.setItem('demo_user', JSON.stringify(user));
    setUser(user);
  };

  const signUp = async (email: string, password: string) => {
    // Demo mode - create user in localStorage
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      uid: `demo_${Date.now()}`,
      email,
      password, // In demo mode, we store password (never do this in production!)
      displayName: email.split('@')[0],
    };

    users.push(newUser);
    localStorage.setItem('demo_users', JSON.stringify(users));

    const user = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
    };

    localStorage.setItem('demo_user', JSON.stringify(user));
    setUser(user);
  };

  const signInWithGoogle = async () => {
    // Demo mode - simulate Google sign in
    const user = {
      uid: `demo_google_${Date.now()}`,
      email: 'demo@google.com',
      displayName: 'Demo Google User',
    };

    localStorage.setItem('demo_user', JSON.stringify(user));
    setUser(user);
  };

  const signInWithApple = async () => {
    // Demo mode - simulate Apple sign in
    const user = {
      uid: `demo_apple_${Date.now()}`,
      email: 'demo@apple.com',
      displayName: 'Demo Apple User',
    };

    localStorage.setItem('demo_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem('demo_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
