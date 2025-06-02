"use client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { SubNavbar } from "@/components/nav/SubNavbar";
import { FollowingProvider } from "@/hooks/followingContext";
import { WishlistProvider } from "@/hooks/wishlistContext";
import { isUserLoggedIn } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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

  useEffect(() => {
    if (!isUserLoggedIn()) {
      toast.error("Login to become a buyer.", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }, [router]);

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
