"use client";
import {
  AddToStoreIcon,
  Bag2Icon,
  BidsIcon,
  BoxTickIcon,
  FarmersIcon,
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
import { AddToStore } from "@/app/(main)/agents/_components/AddToStore";
import { Agent_ProfileDropDownMobile } from "../../Profile_dropdowns/AgentProfile_dropdown/Agent_ProfileDropDownMobile";

interface NavSection {
  title: string;
  items: {
    href?: string;
    icon: React.ComponentType<{ stroke?: string; fill?: string }>;
    label: string;
    hasDot?: boolean;
    onClick?: () => void;
  }[];
}

interface AgentAsideNavMobileProps {
  user: { fullName: string; email: string } | null;
  isDropdownOpen: boolean;
  handleUserDropdownClick: () => void;
  handleLogout: () => void;
  closeDropdown: () => void;
}

export const AgentAsideNavMobile = ({
  user,
  isDropdownOpen,
  handleUserDropdownClick,
  handleLogout,
  closeDropdown,
}: AgentAsideNavMobileProps) => {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Store: false,
    Bookings: false,
    Transactions: false,
    Customers: false,
    Others: false,
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const toggleSection = (section: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        profileRef.current &&
        !profileRef.current.contains(target) &&
        navRef.current &&
        !navRef.current.contains(target) &&
        isDropdownOpen
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, closeDropdown]);

  const navSections: NavSection[] = [
    {
      title: "Store",
      items: [
        {
          icon: AddToStoreIcon,
          label: "Add to store",
          onClick: () => setIsModalOpen(true),
        },
        {
          href: "/agents/produce-list",
          icon: ProduceListIcon,
          label: "Produce list",
        },
        { href: "/agents/farmers", icon: FarmersIcon, label: "Farmers" },
        { href: "/agents/bids", icon: BidsIcon, label: "Bids", hasDot: true },
      ],
    },
    {
      title: "Orders",
      items: [
        { href: "/agents/new", icon: Bag2Icon, label: "New", hasDot: true },
        { href: "/agents/packed", icon: PackedIcon, label: "Packed" },
        { href: "/agents/delivered", icon: BoxTickIcon, label: "Delivered" },
      ],
    },
    {
      title: "Transactions",
      items: [
        {
          href: "/agents/pending",
          icon: MoneyReceiveIcon,
          label: "Pending",
        },
        {
          href: "/agents/received",
          icon: MoneyReceive2Icon,
          label: "Received",
        },
      ],
    },
    {
      title: "Customers",
      items: [
        {
          href: "/agents/customers",
          icon: Profile2UserIcon,
          label: "Customers",
        },
        { href: "/agents/reviews", icon: MessageStarIcon, label: "Reviews" },
      ],
    },
    {
      title: "Others",
      items: [
        {
          href: "/agents/chat",
          icon: MessagesIcon,
          label: "Chat",
          hasDot: true,
        },
        { href: "/agents/help", icon: MessageQuestionIcon, label: "Help" },
      ],
    },
  ];

  const sectionVariants = {
    initial: { height: 0, opacity: 0 },
    animate: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const itemVariants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
  };

  return (
    <aside className="w-[95%] rounded-[0.4rem] mx-auto block sm:hidden pb-6 shadow-md mt-[1.3rem] z-20">
      <AddToStore isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {user && (
        <div className="relative px-[0.5rem] pt-[1rem]" ref={profileRef}>
          <div className="flex items-center justify-between gap-2 cursor-pointer bg-[#3a3a3a] p-1.5 px-2.5 rounded-[4px] hover:bg-[#4a4a4a] transition">
            <button
              className="flex items-center gap-2"
              onClick={handleUserDropdownClick}
            >
              <Image
                src="/images/profile_image.png"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-[#fefefe] text-[0.7rem] text-left font-montserrat font-normal">
                  {user.fullName}
                </span>
                <span className="text-[#fefefe] text-[0.7rem] text-left font-montserrat font-normal">
                  {user.email}
                </span>
              </div>
            </button>
            <button onClick={toggleNav}>
              {isNavOpen ? (
                <ArrowUpIcon stroke="#fefefe" className="h-4 w-4" />
              ) : (
                <ArrowDownIcon stroke="#fefefe" className="h-4 w-4" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="w-full rounded-[4px] mt-2 z-30 bg-[#fefefe] shadow-lg"
              >
                <Agent_ProfileDropDownMobile onLogout={handleLogout} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            ref={navRef}
            className="flex flex-col gap-[2.5rem]"
          >
            <div className="flex flex-col gap-[2.5rem]" ref={navRef}>
              <div className="flex flex-col px-1">
                <ul className="mt-[1rem] px-[0.5rem]">
                  <li>
                    <Link
                      href="/agents"
                      className={`flex items-start w-[4rem] flex-col bg-[#3a3a3a] gap-2 py-2 px-2 rounded-md transition-colors duration-200 ${
                        pathname === "/agents"
                          ? "bg-[#3a3a3a]"
                          : "hover:bg-[#4a4a4a]"
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
                {navSections.map((section, idx) => (
                  <div key={section.title} className="px-[0.5rem]">
                    <button
                      onClick={(e) => toggleSection(section.title, e)}
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
                          variants={sectionVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="overflow-hidden grid grid-cols-4 gap-1.5"
                        >
                          {section.items.map((item, index) => (
                            <motion.li
                              key={item.href || item.label}
                              variants={itemVariants}
                              transition={{
                                delay: index * 0.1,
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              {item.href ? (
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
                              ) : (
                                <button
                                  onClick={item.onClick}
                                  className={`flex flex-col items-start gap-2.5 py-2 px-3.5 rounded-md transition-colors duration-200 ${
                                    isModalOpen && item.label === "Add to store"
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
                                </button>
                              )}
                            </motion.li>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
