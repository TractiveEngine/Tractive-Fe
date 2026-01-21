"use client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { SubNavbar } from "@/components/nav/SubNavbar";
import { FollowingProvider } from "@/hooks/followingContext";
import { WishlistProvider } from "@/hooks/wishlistContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const topSellers = [
  "Kelvin Chikezie",
  "Aisha Bello",
  "Emeka Okonkwo",
  "Fatima Musa",
];

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Use role guard for authentication and authorization
  const { isAuthorized, isLoading } = useRoleGuard("buyer");

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (useRoleGuard handles redirects)
  if (!isAuthorized) {
    return null;
  }

  return (
    <FollowingProvider initialSellers={topSellers}>
      <WishlistProvider>
        <nav className="bg-[#fefefe] w-full">
          <Navbar />
          <div className="bg-[#EBEBEB] w-full">
            <SubNavbar />
          </div>
        </nav>
        <div className="bg-[#f1f1f1]">{children}</div>
        <div className="bg-[#f1f1f1] w-full">
          <Footer />
        </div>
      </WishlistProvider>
    </FollowingProvider>
  );
}
