"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "@/services/userService";

type User = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  referralCode?: string;
  referredBy?: string | null;
  walletPoints?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      // Fetch fresh data from backend when component mounts
      refreshUserData(parsedUser.id);
    }
  }, []);

  const refreshUserData = async (userId: string) => {
    try {
      const freshUser = await api.getUserById(userId);
      const updatedUser: User = {
        id: freshUser.user?.id || freshUser.id,
        email: freshUser.user?.email || freshUser.email,
        fullName: freshUser.user?.fullName || freshUser.fullName,
        phone: freshUser.user?.phone || freshUser.phone,
        referralCode: freshUser.user?.referralCode || freshUser.referralCode || "",
        referredBy: freshUser.user?.referredBy || freshUser.referredBy || null,
        walletPoints: freshUser.user?.walletPoints || freshUser.walletPoints || 0,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      const user: User = {
        id: res.user.id,
        email: res.user.email,
        fullName: res.user.fullName,
        phone: res.user.phone,
        referralCode: res.user.referralCode || "",
        referredBy: res.user.referredBy || null,
        walletPoints: res.user.walletPoints || 0,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<any>
  ) => {
    setLoading(true);
    try {
      const res = await api.signup(email, password, {
        fullName: userData.fullName,
        phone: userData.phone,
        referralCode: userData.referralCode,
      });
      const user: User = {
        id: res.user.id,
        email: res.user.email,
        fullName: res.user.fullName,
        phone: res.user.phone,
        referralCode: res.user.referralCode || "",
        referredBy: res.user.referredBy || null,
        walletPoints: res.user.walletPoints || 0,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      await refreshUserData(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
