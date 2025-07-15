"use client";
import { TransporterProfile_AsideNav } from "@/components/nav/TransporterNav/TransporterProfile_AsideNav";
import { TransporterProfileNavbar } from "@/components/nav/TransporterNav/TransporterProfileNavbar";
import { isUserLoggedIn, getLoggedInUser } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = isUserLoggedIn();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          const userData = getLoggedInUser();
          if (userData && "fullName" in userData && "email" in userData) {
            // setUser not needed since user is not used
          } else {
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

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

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-[#f1f1f1]">
      <nav className="bg-[#fefefe] w-full">
        <TransporterProfileNavbar />
      </nav>
      <div className="w-full h-screen">
        <div className="w-[95%] mx-auto flex flex-col md:flex-row gap-6 pt-4">
          <aside className="w-[70%] rounded-md">
            <TransporterProfile_AsideNav />
          </aside>
          {children}
        </div>
      </div>
    </div>
  );
}
