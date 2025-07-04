"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isUserLoggedIn, getLoggedInUser, logoutUser } from "@/utils/loginAuth"; // Adjust path as needed
import "./Navbar.css";
import { MenuIcon, NotificationIcon, SearchIcon } from "@/icons/Icons";
import { Notifications } from "../Notifications";
import { Buyer_ProfileDropDown } from "../Profile_dropdowns/BuyerProfile_dropdown/Buyer_ProfileDropDown";

export const MobileNavbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);

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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuIconRef.current &&
        !menuIconRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false); // Close user dropdown
  };

  const handleUserDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false); // Close notification dropdown
  };

  const handleMobileMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsNotificationOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div
        className={`w-[100%] mx-auto py-2 flex md:hidden justify-between font-montserrat items-center ${
          isLoggedIn ? "bg-[#FEFEFE]" : "bg-[#F1F1F1]"
        }`}
      >
        {/* Logo */}
        <div className="flex flex-col md:hidden items-center justify-between w-[100%] md:w-[75%] lg:w-[60%]">
          <div className="flex items-center justify-between w-[100%] md:w-[75%] lg:w-[60%]">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/navLogo.png"
                alt="Agrictech Logo"
                width={55}
                height={55}
              />
            </Link>
            <div className="cursor-pointer" ref={menuIconRef}>
              <MenuIcon
                className="w-[20px] h-[20px]"
                onClick={handleMobileMenuToggle}
              />
            </div>
          </div>

          {/* Search Box */}
          {isLoggedIn && (
            <div className="relative flex items-center w-[100%] mt-2">
              <input
                type="text"
                placeholder="I am looking for..."
                className="pl-4 pr-4 h-[34px] w-[100%] rounded-tl-[4px] rounded-bl-[4px] rounded-tr-[0] rounded-br-[0] bg-[#f1f1f1] placeholder:text-[0.7rem] focus:outline-none focus:border-[#538E53] text-[0.7em]"
              />
              <div className="bg-[#538e53] w-[45px] h-[34px] py-[3px] px-[3px] flex flex-col justify-center items-center rounded-tl-[0] rounded-bl-[0] rounded-tr-[4px] rounded-br-[4px] cursor-pointer">
                <SearchIcon className="w-[16px] h-[17px]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="absolute flex flex-col gap-[1rem] top-[4rem] right-0 py-[1rem] px-[0.9rem] w-[20rem] bg-[#fefefe] border-b border-gray-200 shadow-lg z-10 md:hidden"
          ref={mobileMenuRef}
        >
          {isLoggedIn && isMobileMenuOpen ? (
            <div ref={mobileMenuRef}>
              <div className="flex flex-col gap-[1rem]">
                {/* User Info and Dropdown */}
                <div className="relative" ref={profileRef}>
                  <div
                    className="flex items-center justify-between gap-2 cursor-pointer bg-[#f1f1f1] p-1.5 rounded-[4px] hover:bg-[#f6f6f6] transition"
                    onClick={handleUserDropdownClick}
                  >
                    <div className="flex items-center gap-1">
                      <Image
                        src="/images/profile_image.png" // Replace with user-uploaded image if available
                        alt="Profile"
                        width={27}
                        height={27}
                        className="rounded-full"
                      />
                      <span className="text-[#2b2b2b] text-[0.89rem] font-normal">
                        {user?.fullName}
                      </span>
                    </div>

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
                    <Buyer_ProfileDropDown onLogout={handleLogout} />
                  )}
                </div>

                {/* ========= ICONS ========= */}
                <div className="flex flex-col gap-[0.5rem] md:gap-[3rem] lg:gap-[5rem]">
                  {/* ===================== Notification icon ========================= */}
                  <div   onClick={handleNotificationClick}
                      ref={notificationRef} className="flex items-center justify-between p-1.5 rounded-[4px] hover:bg-[#f1f1f1] gap-2 cursor-pointer">
                    <span className="text-[#2b2b2b] hover:text-[#214821] text-[0.79rem] font-normal font-montserrat transition">
                      Notification
                    </span>

                    <div
                      className="relative"
                    
                    >
                      <NotificationIcon />
                      {hasNotifications && (
                        <span className="absolute top-0 right-[2px] h-2 w-2 rounded-full bg-[#538E53]" />
                      )}
                      {isNotificationOpen && (
                        <div className="absolute top-20 -left-35 w-[500px] bg-[#fefefe] border border-gray-200 rounded-[4px] shadow-lg z-10">
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

                  {/* ===================== BID icon ========================= */}
                  <div className="relative">
                    <Link
                      href="/buyers/my-biddings"
                      className="relative flex items-center justify-between p-1.5 rounded-[4px] hover:bg-[#f1f1f1] gap-2 cursor-pointer"
                    >
                      <span className="text-[#2b2b2b] hover:text-[#214821] text-[0.79rem] font-normal font-montserrat transition">
                        Bids
                      </span>
                      <div className="relative">
                        <div className="flex items-center flex-col">
                          <span className="relative flex items-center justify-center w-[24px] h-[14.4px] rounded-[3.6px] border-[1.2px] border-[#2b2b2b]">
                            <small className="text-[10px] absolute">BID</small>
                          </span>
                          <span className="w-[2.4px] h-[9.8px] rounded-[3.6px] bg-[#2b2b2b]"></span>
                        </div>
                        <span className="absolute -top-[2px] -right-[4px] h-2 w-2 rounded-full bg-[#538E53]" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Main Links */}
              <ul className="flex flex-col gap-6 text-gray-700 font-normal">
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
              <ul className="flex flex-col gap-4">
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
      )}
    </>
  );
};
