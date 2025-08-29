"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  OverviewIcon,
  UserIcon,
  MessageQuestionIcon,
  MessageIcon,
  MessagesIcon,
  Bag2Icon,
  Profile2User,
  moneyChange,
  userRemoveIcon,
  UserTickIcons,
  userMinusIcon,
} from "@/app/(main)/admin/_components/icons/AdminIcons";
import { Admin_ProfileDropDownMobile } from "@/components/Profile_dropdowns/AdminProfile_dropdown/Admin_ProfileDropDownMobile";

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

interface AdminAsideNavMobileProps {
  user: { fullName: string; email: string } | null;
  isDropdownOpen: boolean;
  handleUserDropdownClick: () => void;
  handleLogout: () => void;
  closeDropdown: () => void;
}

export const AdminAsideNavMobile = ({
  user,
  isDropdownOpen,
  handleUserDropdownClick,
  handleLogout,
  closeDropdown,
}: AdminAsideNavMobileProps) => {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Store: false,
    Bookings: false,
    Transactions: false,
    Customers: false,
    Others: false,
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Now used for modal
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Handle opening/closing the modal
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Close modal when clicking outside
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
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        isModalOpen
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, closeDropdown, isModalOpen]);

  const navSections: NavSection[] = [
    {
      title: "Managements",
      items: [
        {
          href: "/admin/all-users",
          icon: Profile2User,
          label: "All Users",
        },
        {
          href: "/admin/transactions",
          icon: moneyChange,
          label: "Transactions",
        },
      ],
    },
    {
      title: "Approvers",
      items: [
        { href: "/admin/new", icon: UserIcon, label: "New", hasDot: true },
        { href: "/admin/declined", icon: userRemoveIcon, label: "Declined" },
      ],
    },
    {
      title: "Admins",
      items: [
        {
          href: "/admin/active",
          icon: UserTickIcons,
          label: "Active",
        },
        {
          href: "/admin/suspended",
          icon: userMinusIcon,
          label: "Suspended",
        },
        {
          href: "/admin/removed",
          icon: userRemoveIcon,
          label: "Removed",
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          href: "/admin/query",
          icon: MessageQuestionIcon,
          label: "Customers",
        },
        { href: "/admin/live-chat", icon: MessageIcon, label: "Live Chat" },
      ],
    },
    {
      title: "Others",
      items: [
        {
          href: "/admin/chat",
          icon: MessagesIcon,
          label: "Chat",
          hasDot: true,
        },
        { href: "/admin/track-orders", icon: Bag2Icon, label: "Track Orders" },
        {
          icon: Bag2Icon, // Example icon, replace with appropriate icon
          label: "Add to store",
          onClick: toggleModal, // Toggle modal on click
          hasDot: true,
        },
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

  const modalVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <aside className="w-[95%] rounded-[0.4rem] mx-auto block sm:hidden pb-6 shadow-md mt-[1.3rem] z-20">
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
                <Admin_ProfileDropDownMobile onLogout={handleLogout} />
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
            <div className="flex flex-col gap-[2.5rem]">
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

      {/* Modal for "Add to store" */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-[#fefefe] rounded-[8px] p-6 w-[90%] max-w-[400px] shadow-lg"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-[16px] font-montserrat font-medium text-[#2b2b2b] mb-4">
                Add to Store
              </h2>
              <p className="text-[14px] font-montserrat text-[#2b2b2b] mb-6">
                This is a placeholder for the &quot;Add to store&quot; modal. Add your
                form or content here.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={toggleModal}
                  className="px-4 py-2 bg-[#e0e0e0] text-[#2b2b2b] rounded-[4px] font-montserrat text-[14px] hover:bg-[#d0d0d0]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Add to store submitted");
                    toggleModal();
                  }}
                  className="px-4 py-2 bg-[#538e53] text-[#fefefe] rounded-[4px] font-montserrat text-[14px] hover:bg-[#468246]"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
