"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of the wishlist context
interface WishlistContextType {
  wishlist: Record<string, boolean>;
  toggleWish: (title: string) => void;
  isWished: (title: string) => boolean;
}

// Create the context with a default value
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

// Provider component to wrap the app
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Load initial state from localStorage only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const toggleWish = (title: string) => {
    setWishlist((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isWished = (title: string) => !!wishlist[title];

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWish, isWished }}>
      {children}
    </WishlistContext.Provider>
  );
};
