// app/help/layout.tsx
"use client";
import { BuyerProfile_AsideNav } from "@/components/nav/BuyerProfile_AsideNav";
import { Navbar } from "@/components/nav/Navbar";
import { SubNavbar } from "@/components/nav/SubNavbar";
import { isUserLoggedIn } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BuyerProfileSettingLayout({
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
    <div className="bg-[#f1f1f1]">
      <nav className="bg-[#fefefe] w-full">
        <Navbar />
        <div className="bg-[#EBEBEB] w-full">
          <SubNavbar />
        </div>
      </nav>
      <div className="w-full">
        <div className="w-[90%] mx-auto flex flex-col md:flex-row gap-6 p-4">
          <aside className="w-[70%] rounded-md">
            <BuyerProfile_AsideNav />
          </aside>
          {children}
        </div>
      </div>
    </div>
  );
}
