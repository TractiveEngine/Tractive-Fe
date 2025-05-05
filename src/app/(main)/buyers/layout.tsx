// app/help/layout.tsx
"use client"
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  const router = useRouter();
    // 🔐 Redirect unauthorized users
    useEffect(() => {
      const token = localStorage.getItem("authToken"); // adjust this key if needed
      if (!token) {
        toast.error("Unauthorized access. Login.", {
          duration: 3000,
          position: "top-center",
        });
        router.replace("/login");
      }
    }, [router]);
  return <div className="bg-[#f1f1f1]">{children}</div>;
}
