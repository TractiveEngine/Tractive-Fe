"use client";
import { ATNavbar } from "@/components/nav/A&TNavbar";
import { AgentAsideNav } from "@/components/nav/AgentAsideNav";
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
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized access. Login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#f1f1f1]">
      {/* Sidebar */}
      <AgentAsideNav />
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-55">
        {/* Top Navbar */}
        <nav className="w-full bg-[#fefefe]">
          <ATNavbar />
        </nav>
        {/* Content Area */}
        <main className="flex-1 pt-[4rem] overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
