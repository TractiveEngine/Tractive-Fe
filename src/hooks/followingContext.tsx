"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

// Define the shape of the following context
interface FollowingContextType {
  followStates: Record<string, boolean>;
  loadingStates: Record<string, boolean>;
  toggleFollow: (sellerName: string) => Promise<void>;
  isFollowing: (sellerName: string) => boolean;
}

// Create the context with a default value
const FollowingContext = createContext<FollowingContextType | undefined>(
  undefined
);

// Hook to use the following context
export const useFollowing = () => {
  const context = useContext(FollowingContext);
  if (!context) {
    throw new Error("useFollowing must be used within a FollowingProvider");
  }
  return context;
};

// Provider component to wrap the app
export const FollowingProvider = ({
  children,
  initialSellers,
}: {
  children: ReactNode;
  initialSellers: string[];
}) => {
  const [followStates, setFollowStates] = useState<Record<string, boolean>>(
    () => {
      const initialStates: Record<string, boolean> = {};
      initialSellers.forEach((seller) => {
        initialStates[seller] = false; // Default to not following
      });
      return initialStates;
    }
  );

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    () => {
      const initialStates: Record<string, boolean> = {};
      initialSellers.forEach((seller) => {
        initialStates[seller] = false;
      });
      return initialStates;
    }
  );

  const toggleFollow = async (sellerName: string) => {
    setLoadingStates((prev) => ({ ...prev, [sellerName]: true }));
    try {
      // Simulate an async operation (e.g., API call) with a 500ms delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newFollowState = !followStates[sellerName];
      setFollowStates((prev) => ({
        ...prev,
        [sellerName]: newFollowState,
      }));
      if (newFollowState) {
        toast.success(`Started following ${sellerName}!`);
      } else {
        toast.success(`Unfollowed ${sellerName}!`);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [sellerName]: false }));
    }
  };

  const isFollowing = (sellerName: string) => !!followStates[sellerName];

  return (
    <FollowingContext.Provider
      value={{ followStates, loadingStates, toggleFollow, isFollowing }}
    >
      {children}
    </FollowingContext.Provider>
  );
};
