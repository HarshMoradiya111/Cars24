"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "@/lib/userapi";
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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const normalizeUser = (incoming: any): User => ({
    id: incoming?.id,
    email: incoming?.email,
    fullName: incoming?.fullName,
    phone: incoming?.phone,
    referralCode: incoming?.referralCode ?? "",
    referredBy: incoming?.referredBy ?? null,
    walletPoints: incoming?.walletPoints ?? 0,
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(normalizeUser(JSON.parse(storedUser)));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      const normalized = normalizeUser(userData.user);
      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));
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
      const newUser = await api.signup(email, password, {
        fullName: userData.fullName,
        phone: userData.phone,
        referralCode: userData.referralCode,
      });
      const normalized = normalizeUser(newUser.user);
      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));
    } catch (error) {
      console.error("Login failed:", error);
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
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
