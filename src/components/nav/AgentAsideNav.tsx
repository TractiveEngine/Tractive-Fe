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
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { logoutUser } from "@/utils/loginAuth";
import { motion, AnimatePresence } from "framer-motion";
import { AddToStore } from "@/app/(main)/agents/_components/AddToStore";

interface NavSection {
  title: string;
  items: {
    href?: string;
    icon: React.ComponentType;
    label: string;
    hasDot?: boolean;
    onClick?: () => void;
  }[];
}

export const AgentAsideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Store: true,
    Orders: true,
    Transactions: true,
    Customers: true,
    Others: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(true);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  // Mapping of labels to their corresponding routes
  const labelToRoute: { [key: string]: string } = {
    "Produce list": "/agents/produce-list",
    Farmers: "/agents/farmers",
    Bids: "/agents/bids",
    New: "/agents/new",
    Packed: "/agents/packed",
    Delivered: "/agents/delivered",
    Pending: "/agents/pending",
    Received: "/agents/received",
    Customers: "/agents/customers",
    Reviews: "/agents/reviews",
    Chat: "/agents/chat",
    Help: "/agents/help",
  };

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

  return (
    <aside className="w-25 lg:w-50 bg-[#fefefe] fixed h-full hidden sm:block shadow-md z-20 overflow-y-auto">
      <AddToStore isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Link
        href="/agents"
        className="flex items-center justify-center lg:justify-start mx-auto my-2 w-[3rem] lg:w-[50%]"
      >
        <Image
          src="/images/navLogo.png"
          alt="Agrictech Logo"
          width={65}
          height={65}
        />
      </Link>
      <div className="flex flex-col gap-[2.5rem]">
        <div className="flex flex-col px-1">
          <ul>
            <li>
              <Link
                href="/agents"
                className={`flex items-center gap-2 py-2 px-2 rounded-md transition-colors duration-200 lg:flex-row flex-col ${
                  pathname === "/agents"
                    ? "bg-[#CCE5CC80]"
                    : "hover:bg-[#f1f1f1]"
                }`}
              >
                <OverviewIcon />
                <span className="font-montserrat text-[#2b2b2b] text-[9.7px] lg:text-[11.8px] font-medium">
                  Overview
                </span>
              </Link>
            </li>
          </ul>
          <span className="bg-[#e2e2e2] w-full h-[1px] my-1"></span>
          {navSections.map((section, idx) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-center lg:justify-between w-full rounded-md cursor-pointer py-2 px-2.5 text-left font-montserrat text-[#2b2b2b] text-[11px] font-normal hover:bg-[#f1f1f1] transition-colors duration-200"
              >
                <p className="truncate">{section.title}</p>
                <div className="hidden lg:flex items-center gap-2">
                  {openSections[section.title] ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
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
                    className="overflow-hidden"
                  >
                    {section.items.map((item) => (
                      <li key={item.label}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={`flex items-center gap-1.5 lg:gap-3 py-2 px-3.5 rounded-md transition-colors duration-200 lg:flex-row flex-col ${
                              pathname === labelToRoute[item.label]
                                ? "bg-[#CCE5CC80]"
                                : "hover:bg-[#f1f1f1]"
                            }`}
                          >
                            <item.icon />
                            <div className="flex items-center gap-1.5">
                              <span className="font-montserrat text-[#2b2b2b] text-center lg:text-left text-[9px] lg:text-[11px] font-normal">
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
                            className={`w-full cursor-pointer flex items-center gap-1.5 lg:gap-3 py-2 px-3.5 rounded-md transition-colors duration-200 lg:flex-row flex-col ${
                              isModalOpen && item.label === "Add to store"
                                ? "bg-[#CCE5CC80]"
                                : "hover:bg-[#f1f1f1]"
                            }`}
                          >
                            <item.icon />
                            <div className="flex items-center gap-1.5">
                              <span className="font-montserrat text-[#2b2b2b] text-center lg:text-left text-[9px] lg:text-[11px] font-normal">
                                {item.label}
                              </span>
                              {item.hasDot && (
                                <span className="bg-[#538e53] rounded-full w-1 lg:w-2 h-1 lg:h-2"></span>
                              )}
                            </div>
                          </button>
                        )}
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
        <ul className="mb-[2rem]">
          <li>
            <div
              onClick={handleLogout}
              className={`flex items-center gap-3 py-2 px-4 rounded-md hover:bg-[#f1f1f1] transition-colors duration-200 lg:flex-row flex-col cursor-pointer`}
            >
              <LogoutIcon />
              <div className="flex items-center gap-3">
                <span className="font-montserrat text-[#2b2b2b] text-[10px] lg:text-[11.8px] font-normal">
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
