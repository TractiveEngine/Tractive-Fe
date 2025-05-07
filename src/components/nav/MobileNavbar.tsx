"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isUserLoggedIn, getLoggedInUser, logoutUser } from "@/utils/loginAuth"; // Adjust path as needed
import "./Navbar.css";
import { MenuIcon, NotificationIcon, SearchIcon } from "@/icons/Icons";

export const MobileNavbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isBidOpen, setIsBidOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false); // Placeholder for notification status
  const [hasBids, setHasBids] = useState(false); // Placeholder for bid status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const notificationRef = useRef<HTMLDivElement>(null);
  const bidRef = useRef<HTMLDivElement>(null);
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
      const mockBids = [
        { id: 123, message: "Bid #123 placed" },
        { id: 124, message: "Bid #124 updated" },
      ];

      // Update states based on mock data
      setHasNotifications(mockNotifications.length > 0);
      setHasBids(mockBids.length > 0);
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
      if (bidRef.current && !bidRef.current.contains(event.target as Node)) {
        setIsBidOpen(false);
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
    setIsBidOpen(false);
    setHasNotifications(false);
    setHasBids(false);
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsBidOpen(false); // Close bid dropdown
    setIsDropdownOpen(false); // Close user dropdown
  };

  const handleBidClick = () => {
    setIsBidOpen(!isBidOpen);
    setIsNotificationOpen(false); // Close notification dropdown
    setIsDropdownOpen(false); // Close user dropdown
  };

  const handleUserDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false); // Close notification dropdown
    setIsBidOpen(false); // Close bid dropdown
  };

  const handleMobileMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsNotificationOpen(false);
    setIsBidOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div
        className={`w-[90%] mx-auto py-2 flex md:hidden justify-between font-montserrat items-center ${
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
                width={75}
                height={75}
              />
            </Link>
            <div className="cursor-pointer" ref={menuIconRef}>
              <MenuIcon onClick={handleMobileMenuToggle} />
            </div>
          </div>

          {/* Search Box */}
          {isLoggedIn && (
            <div className="relative flex items-center w-[80%] mt-2">
              <input
                type="text"
                placeholder="I am looking for..."
                className="pl-4 pr-4 py-2 w-[100%] rounded-tl-[4px] rounded-bl-[4px] rounded-tr-[0] rounded-br-[0] bg-[#f1f1f1] focus:outline-none focus:border-[#538E53] text-[0.89rem]"
              />
              <div className="bg-[#538e53] w-[45px] h-[38px] py-[5px] px-[5px] flex flex-col justify-center items-center rounded-tl-[0] rounded-bl-[0] rounded-tr-[4px] rounded-br-[4px] cursor-pointer">
                <SearchIcon />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="absolute flex flex-col gap-[1rem] top-[7rem] right-0 p-[2rem] w-[20rem] bg-white border-b border-gray-200 shadow-lg z-10 md:hidden"
          ref={mobileMenuRef}
        >
          {isLoggedIn && isMobileMenuOpen ? (
            <div ref={mobileMenuRef}>
              <div className="flex flex-col gap-[1rem]">
                {/* Icons */}
                <div className="flex flex-col gap-[0.5rem]">
                  {/* Notification Icon */}
                  <div className="relative" ref={notificationRef}>
                    <div
                      className="flex items-center flex-row-reverse gap-[0.7rem] cursor-pointer"
                      onClick={handleNotificationClick}
                    >
                      <p>Notifications</p>
                      <div className="relative">
                       <NotificationIcon />
                        {hasNotifications && (
                          <span className="absolute top-0 right-[2px] h-2 w-2 rounded-full bg-[#538E53]" />
                        )}
                      </div>
                    </div>
                    {isNotificationOpen && (
                      <div className="absolute top-8 left-0 w-64 bg-white border border-gray-200 rounded-[4px] shadow-lg z-10">
                        <ul className="py-2">
                          {hasNotifications ? (
                            <>
                              <li className="px-4 py-2 text-[0.89rem] text-gray-700 hover:bg-[#CCE5CC] hover:text-[#538E53]">
                                You have a new message
                              </li>
                              <li className="px-4 py-2 text-[0.89rem] text-gray-700 hover:bg-[#CCE5CC] hover:text-[#538E53]">
                                Order #456 updated
                              </li>
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

                  {/* Bid Icon */}
                  <div className="relative" ref={bidRef}>
                    <div
                      className="flex flex-row-reverse gap-[0.7rem] cursor-pointer"
                      onClick={handleBidClick}
                    >
                      <p>BIDs</p>
                      <div className="relative">
                        <div className="flex items-center flex-col cursor-pointer">
                          <span className="relative flex items-center justify-center w-[24px] h-[14.4px] rounded-[3.6px] border-[1.2px] border-[#2b2b2b]">
                            <small className="text-[10px] absolute">BID</small>
                          </span>
                          <span className="w-[2.4px] h-[9.8px] rounded-[3.6px] bg-[#2b2b2b]"></span>
                        </div>
                        {hasBids && (
                          <span className="absolute -top-[2px] -right-[4px] h-2 w-2 rounded-full bg-[#538E53]" />
                        )}
                      </div>
                    </div>
                    {isBidOpen && (
                      <div className="absolute top-8 left-0 w-64 bg-white border border-gray-200 rounded-[4px] shadow-lg z-10">
                        <ul className="py-2">
                          {hasBids ? (
                            <>
                              <li className="px-4 py-2 text-[0.89rem] text-gray-700 hover:bg-[#CCE5CC] hover:text-[#538E53]">
                                Bid #123 placed
                              </li>
                              <li className="px-4 py-2 text-[0.89rem] text-gray-700 hover:bg-[#CCE5CC] hover:text-[#538E53]">
                                Bid #124 updated
                              </li>
                            </>
                          ) : (
                            <li className="px-4 py-2 text-[0.89rem] text-gray-500">
                              No active bids
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info and Dropdown */}
                <div className="relative" ref={profileRef}>
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
                    <span className="text-[#2b2b2b] text-[0.89rem] font-normal">
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
                    <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-[4px] shadow-lg z-10">
                      <li>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-[0.89rem] text-gray-700 hover:bg-[#CCE5CC] hover:text-[#538E53]"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-[0.89rem] text-gray-700 hover:bg-[#CCE5CC] hover:text-[#538E53]"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-[0.89rem] text-gray-700 hover:bg-[#CCE5CC] hover:text-[#538E53]"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
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
