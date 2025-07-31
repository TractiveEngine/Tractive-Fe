// app/help/layout.tsx
"use client";
import { BuyerProfile_AsideNav } from "@/components/nav/BuyerProfile_AsideNav";
import { Navbar } from "@/components/nav/Navbar";
import { SubNavbar } from "@/components/nav/SubNavbar";
import { getLoggedInUser, isUserLoggedIn } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "sonner";

export default function BuyerProfileSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAsideOpen, setIsAsideOpen] = useState(false);
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

  const toggleAside = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("Toggle aside clicked, current state:", isAsideOpen); // Debug log
    setIsAsideOpen((prev) => {
      const newState = !prev;
      console.log("New aside state:", newState); // Debug log
      return newState;
    });
  };

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }
  return (
    <div className="bg-[#f1f1f1]">
      <nav className="bg-[#fefefe] w-full">
        <Navbar />
        <div className="bg-[#EBEBEB] w-full">
          <SubNavbar />
        </div>
      </nav>
      <div className="w-full h-screen relative">
        <div className="w-[95%] mx-auto flex flex-col md:flex-row gap-6 pt-4">
          {/* Hamburger menu icon for mobile */}
          {isAsideOpen ? (
            <IoCloseOutline
              className="md:hidden w-8 h-8 text-[#2b2b2b] absolute -top-[10rem] right-3 z-50 p-1 bg-white rounded-md shadow-md cursor-pointer"
              onClick={toggleAside}
              role="button"
              aria-label="Close menu"
            />
          ) : (
            <IoIosMenu
              className="md:hidden w-8 h-8 text-[#2b2b2b] absolute top-4 right-3 p-1 bg-white rounded-md shadow-md cursor-pointer"
              onClick={toggleAside}
              role="button"
              aria-label="Open menu"
            />
          )}
          <aside
            className={`
                   w-[100%] md:w-[40%] rounded-md fixed md:static top-0 left-0 h-screen md:h-auto
                   bg-[#fefefe] md:bg-transparent transform transition-transform duration-300 ease-in-out
                   ${
                     isAsideOpen ? "translate-x-0" : "-translate-x-full"
                   } md:translate-x-0
                   z-40
                 `}
          >
            <BuyerProfile_AsideNav />
          </aside>
          {/* Overlay for mobile when aside is open */}
          {isAsideOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
              onClick={toggleAside}
              aria-label="Close menu"
            />
          )}
          <main className="flex-1 mt-12 md:mt-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
