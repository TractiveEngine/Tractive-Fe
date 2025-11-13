"use client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { SubNavbar } from "@/components/nav/SubNavbar";
import { FollowingProvider } from "@/hooks/followingContext";
import { WishlistProvider } from "@/hooks/wishlistContext";
import { getLoggedInUser, isUserLoggedIn } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  console.log(user);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = isUserLoggedIn();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          const userData = getLoggedInUser();
          if (userData && "name" in userData && "email" in userData) {
            setUser({ name: userData.name, email: userData.email });
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      toast.error("Unauthorized access. Login to become a buyer...", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
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
