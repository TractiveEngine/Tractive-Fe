"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isUserLoggedIn, getLoggedInUser, logoutUser } from "@/utils/loginAuth"; // Adjust path as needed
import "./Navbar.css";
import { NotificationIcon, SearchIcon } from "@/icons/Icons";
import { Notifications } from "../../Notifications";
import { ATMobileNavbar } from "./TransporterMobileNavbar";
import { Agent_ProfileDropDown } from "../../Profile_dropdowns/AgentProfile_dropdown/Agent_ProfileDropDown";

export const ATProfileNavbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false); // Placeholder for notification status

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isUserLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const userData = getLoggedInUser();
        if (userData && "fullName" in userData && "email" in userData) {
          setUser({ fullName: userData.fullName, email: userData.email });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    const fetchNotificationsAndBids = async () => {
      // Mock API call for notifications and bids
      const mockNotifications = [
        { id: 1, message: "You have a new message" },
        { id: 2, message: "Order #456 updated" },
      ];

      // Update states based on mock data
      setHasNotifications(mockNotifications.length > 0);
    };

    checkLoginStatus();
    if (isLoggedIn) {
      fetchNotificationsAndBids();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
    setHasNotifications(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false); // Close user dropdown
  };

  const handleUserDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false); // Close notification dropdown
  };

  return (
    <>
      <div className="w-full bg-[#fefefe]">
        <div
          className={`w-[95%] mx-auto py-2 hidden md:flex justify-between font-montserrat items-center ${
            isLoggedIn ? "bg-[#FEFEFE]" : "bg-[#F1F1F1]"
          }`}
        >
          <div>
            {/* Logo */}
            <Link href="/" className="hidden md:flex items-center">
              <Image
                src="/images/navLogo.png"
                alt="Agrictech Logo"
                width={70}
                height={70}
              />
            </Link>
          </div>
          <span className="hidden md:flex items-center font-montserrat text-[#2b2b2b] text-[16px] lg:text-[1.2rem] font-medium">
            Dashboard
          </span>

          {/* Conditional Rendering Based on Login Status */}
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center justify-center gap-[2rem] w-[100%] md:gap-[3rem] lg:gap-[7rem] md:w-[75%] lg:w-[60%]">
                {/* Search Box and Icons */}
                <div className="relative flex items-center w-[80%]">
                  <input
                    type="text"
                    placeholder="I am looking for..."
                    className="pl-4 pr-4 py-2 w-[100%] rounded-tl-[4px] rounded-bl-[4px] rounded-tr-[0] rounded-br-[0] bg-[#f1f1f1] focus:outline-none focus:border-[#538E53] text-[0.89rem]"
                  />
                  <div className="bg-[#538e53] w-[45px] h-[38px] py-[5px] px-[5px] hidden md:flex flex-col justify-center items-center rounded-tl-[0] rounded-bl-[0] rounded-tr-[4px] rounded-br-[4px] cursor-pointer">
                    <SearchIcon />
                  </div>
                </div>

                {/* ========= ICONS ========= */}
                <div className="relative flex items-center gap-[0.5rem] md:gap-[3rem] lg:gap-[5rem]">
                  {/* ===================== Notification icon ========================= */}
                  <div
                    className="relative"
                    onClick={handleNotificationClick}
                    ref={notificationRef}
                  >
                    <NotificationIcon />
                    {hasNotifications && (
                      <span className="absolute top-0 right-[2px] h-2 w-2 rounded-full bg-[#538E53]" />
                    )}
                    {isNotificationOpen && (
                      <div className="absolute !top-10 !-left-[15rem] w-[500px] bg-[#fefefe] border border-gray-200 rounded-[4px] shadow-lg z-10">
                        <ul className="py-2">
                          {hasNotifications ? (
                            <>
                              <Notifications />
                            </>
                          ) : (
                            <li className="px-4 py-2 text-[0.89rem] text-gray-500">
                              No new notifications
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info and Dropdown */}
              <div className="hidden md:flex relative" ref={profileRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer bg-[#f1f1f1] p-1.5 rounded-[4px] hover:bg-[#f6f6f6] transition"
                  onClick={handleUserDropdownClick}
                >
                  <Image
                    src="/images/profile_image.png" // Replace with user-uploaded image if available
                    alt="Profile"
                    width={27}
                    height={27}
                    className="rounded-full"
                  />
                  <span className="text-[#2b2b2b] hidden lg:block text-[0.89rem] font-normal">
                    {user?.fullName}
                  </span>
                  <svg
                    className="h-4 w-4 text-[#2b2b2b]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {isDropdownOpen && (
                  <Agent_ProfileDropDown onLogout={handleLogout} />
                )}
              </div>
            </>
          ) : (
            <>
              {/* Main Links */}
              <ul className="hidden md:flex gap-6 text-gray-700 font-normal">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`transition hover:text-[#538E53] text-[0.89rem] font-montserrat ${
                        pathname === item.href
                          ? "text-[#538E53] font-montserrat"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Auth Buttons */}
              <ul className="hidden md:flex gap-4 items-center">
                <li>
                  <a
                    href="/login"
                    className="text-[#538E53] hover:text-[#214821] text-[0.89rem] font-medium transition"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="bg-[#CCE5CC] text-[#538E53] hover:text-[#214821] p-[10px] rounded-[4px] flex items-center justify-center gap-[10px] transition text-center text-[0.89rem] font-normal"
                  >
                    Get Started
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      <ATMobileNavbar />
    </>
  );
};
