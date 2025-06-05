"use client";
import {
  AddToStoreIcon,
  Bag2Icon,
  BidsIcon,
  BoxTickIcon,
  FarmersIcon,
  LogoutIcon,
  MessageQuestionIcon,
  MessagesIcon,
  MessageStarIcon,
  MoneyReceive2Icon,
  MoneyReceiveIcon,
  OverviewIcon,
  PackedIcon,
  ProduceListIcon,
  Profile2UserIcon,
} from "@/icons/DashboardIcons";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileDropDown } from "../ProfileDropDown";

interface NavSection {
  title: string;
  items: {
    href: string;
    icon: React.ComponentType<{ stroke?: string; fill?: string }>;
    label: string;
    hasDot?: boolean;
  }[];
}

interface AgentAsideNavMobileProps {
  user: { fullName: string; email: string } | null;
  isDropdownOpen: boolean;
  handleUserDropdownClick: () => void;
  handleLogout: () => void;
}

export const AgentAsideNavMobile = ({
  user,
  isDropdownOpen,
  handleUserDropdownClick,
  handleLogout,
}: AgentAsideNavMobileProps) => {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Store: true,
    Orders: true,
    Transactions: true,
    Customers: true,
    Others: true,
  });
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        handleUserDropdownClick(); // Close dropdown if clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleUserDropdownClick]);

  const navSections: NavSection[] = [
    {
      title: "Store",
      items: [
        { href: "/add-to-store", icon: AddToStoreIcon, label: "Add to store" },
        { href: "/produce-list", icon: ProduceListIcon, label: "Produce list" },
        { href: "/farmers", icon: FarmersIcon, label: "Farmers" },
        { href: "/bids", icon: BidsIcon, label: "Bids", hasDot: true },
      ],
    },
    {
      title: "Orders",
      items: [
        { href: "/orders/new", icon: Bag2Icon, label: "New", hasDot: true },
        { href: "/orders/packed", icon: PackedIcon, label: "Packed" },
        { href: "/orders/delivered", icon: BoxTickIcon, label: "Delivered" },
      ],
    },
    {
      title: "Transactions",
      items: [
        {
          href: "/transactions/pending",
          icon: MoneyReceiveIcon,
          label: "Pending",
        },
        {
          href: "/transactions/received",
          icon: MoneyReceive2Icon,
          label: "Received",
        },
      ],
    },
    {
      title: "Customers",
      items: [
        { href: "/customers", icon: Profile2UserIcon, label: "Customers" },
        { href: "/reviews", icon: MessageStarIcon, label: "Reviews" },
      ],
    },
    {
      title: "Others",
      items: [
        { href: "/chat", icon: MessagesIcon, label: "Chat", hasDot: true },
        { href: "/help", icon: MessageQuestionIcon, label: "Help" },
      ],
    },
  ];

  return (
    <aside className="w-[95%] rounded-[0.4rem] mx-auto bg-[#2b2b2b] block sm:hidden shadow-md mt-[1.3rem] z-20 overflow-y-auto">
      {/* User Info and Dropdown */}
      {user && (
        <div className="relative px-[0.5rem] pt-[1rem]" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer bg-[#3a3a3a] p-1.5 rounded-[4px] hover:bg-[#4a4a4a] transition"
            onClick={handleUserDropdownClick}
          >
            <Image
              src="/images/profile_image.png" // Replace with user-uploaded image if available
              alt="Profile"
              width={27}
              height={27}
              className="rounded-full"
            />
            <span className="text-[#fefefe] text-[0.89rem] font-normal">
              {user.fullName}
            </span>
            <svg
              className="h-4 w-4 text-[#fefefe]"
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
            <div className="absolute top-[3rem] left-0 w-full border border-gray-700 rounded-[4px] shadow-lg z-30">
              <ProfileDropDown onLogout={handleLogout} />
            </div>
          )}
        </div>
      )}
      {/* Routes */}
      <div className="flex flex-col gap-[2.5rem]">
        <div className="flex flex-col px-1">
          <ul className="mt-[1rem] px-[0.5rem]">
            <li>
              <Link
                href="/agents"
                className={`flex items-start w-[4rem] flex-col gap-2 py-2 px-2 rounded-md transition-colors duration-200 ${
                  pathname === "/agents" ? "bg-[#3a3a3a]" : "hover:bg-[#4a4a4a]"
                }`}
              >
                <OverviewIcon fill="#fefefe" stroke="#fefefe" />
                <span className="font-montserrat text-[#fefefe] text-[11px] font-medium">
                  Overview
                </span>
              </Link>
            </li>
          </ul>
          <span className="bg-[#e2e2e2] w-full h-[1px] my-1"></span>
          {/* Collapsible Sections */}
          {navSections.map((section, idx) => (
            <div key={section.title} className="px-[0.5rem]">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full rounded-md cursor-pointer py-2 px-2.5 text-left font-montserrat text-[#fefefe] text-[11px] font-normal bg-[#3a3a3a] transition-colors duration-200 hover:bg-[#4a4a4a]"
              >
                <p className="truncate">{section.title}</p>
                <div className="flex items-center gap-2">
                  {openSections[section.title] ? (
                    <ArrowUpIcon stroke="#fefefe" />
                  ) : (
                    <ArrowDownIcon stroke="#fefefe" />
                  )}
                </div>
              </button>
              <div className="block lg:hidden bg-[#e2e2e2] w-full h-[1px] my-1"></div>
              <AnimatePresence>
                {openSections[section.title] && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden grid grid-cols-4 gap-1.5"
                  >
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex flex-col items-start gap-2.5 py-2 px-3.5 rounded-md transition-colors duration-200 ${
                            pathname === item.href
                              ? "bg-[#3a3a3a] text-[#fefefe]"
                              : "bg-[#2b2b2b] text-[#fefefe] hover:bg-[#4a4a4a]"
                          }`}
                        >
                          <item.icon stroke="#fefefe" fill="#fefefe" />
                          <div className="flex items-center gap-1.5">
                            <span className="font-montserrat text-[#fefefe] text-left text-[11px] font-normal">
                              {item.label}
                            </span>
                            {item.hasDot && (
                              <span className="bg-[#538e53] rounded-full w-1 lg:w-2 h-1 lg:h-2"></span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {idx < navSections.length - 1 && (
                <div className="bg-[#e2e2e2] w-full h-[1px] my-1"></div>
              )}
            </div>
          ))}
        </div>
        {/* Logout */}
        <ul className="mb-[2rem] px-[0.5rem]">
          <li>
            <div
              onClick={handleLogout}
              className="flex items-start gap-2.5 py-2 px-3.5 rounded-md transition-colors duration-200 flex-col cursor-pointer hover:bg-[#4a4a4a]"
            >
              <LogoutIcon stroke="#fefefe" fill="#fefefe" />
              <div className="flex items-center gap-3">
                <span className="font-montserrat text-[#fefefe] text-[11px] font-normal">
                  Logout
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};