"use client";
import { WishlistProvider } from "@/context/wishlistContext";
import { isUserLoggedIn } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

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
    <WishlistProvider>
      <div className="bg-[#f1f1f1]">{children}</div>;
    </WishlistProvider>
  );
}
