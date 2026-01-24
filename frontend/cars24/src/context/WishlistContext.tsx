"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type WishlistItem = {
  id: string;
  title: string;
  image: string;
  price?: string;
  emi?: string;
  location?: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  isSaved: (id: string) => boolean;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.warn("Failed to load wishlist", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist wishlist", e);
    }
  }, [items]);

  const toggle = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.find((x) => x.id === item.id);
      if (exists) return prev.filter((x) => x.id !== item.id);
      return [...prev, item];
    });
  };

  const value = useMemo(
    () => ({
      items,
      toggle,
      isSaved: (id: string) => items.some((x) => x.id === id),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
