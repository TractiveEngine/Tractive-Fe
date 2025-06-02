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

interface NavSection {
  title: string;
  items: {
    href: string;
    icon: React.ComponentType;
    label: string;
    hasDot?: boolean;
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
    <aside className="w-55 bg-[#fefefe] fixed h-full shadow-md z-20 overflow-y-auto">
      {/* Logo */}
      <Link href="/agents" className="flex items-center pl-10 my-2 w-[50%]">
        <Image
          src="/images/navLogo.png"
          alt="Agrictech Logo"
          width={65}
          height={65}
        />
      </Link>
      {/* Routes */}
      <div className="flex flex-col gap-[4rem]">
        <div className="flex flex-col px-1">
          <ul>
            <li>
              <Link
                href="/agents"
                className={`flex items-center gap-3 py-2 px-4 rounded-md transition-colors duration-200 md:flex-row flex-col ${
                  pathname === "/agents"
                    ? "bg-[#CCE5CC80]"
                    : "hover:bg-[#f1f1f1]"
                }`}
              >
                <OverviewIcon />
                <span className="font-montserrat text-[#2b2b2b] text-[13px] font-medium">
                  Overview
                </span>
              </Link>
            </li>
          </ul>
          <span className="bg-[#e2e2e2] w-full h-[1px] my-4"></span>
          {/* Collapsible Sections */}
          {navSections.map((section, idx) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full rounded-md cursor-pointer py-2 px-2.5 text-left font-montserrat text-[#2b2b2b] text-[11px] font-medium hover:bg-[#f1f1f1] transition-colors duration-200"
              >
                <p>{section.title}</p>
                {openSections[section.title] ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}
              </button>
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
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 py-2 px-3.5 rounded-md transition-colors duration-200 md:flex-row flex-col ${
                            pathname === item.href
                              ? "bg-[#CCE5CC80]"
                              : "hover:bg-[#f1f1f1]"
                          }`}
                        >
                          <item.icon />
                          <div className="flex items-center gap-3">
                            <span className="font-montserrat text-[#2b2b2b] text-[13px] font-medium">
                              {item.label}
                            </span>
                            {item.hasDot && (
                              <span className="bg-[#538e53] rounded-full w-2 h-2"></span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {idx < navSections.length - 1 && (
                <span className="bg-[#e2e2e2] w-full h-[1px] my-4"></span>
              )}
            </div>
          ))}
        </div>
        {/* Logout */}
        <ul className="mb-[4rem]">
          <li>
            <div
              onClick={handleLogout}
              className={`flex items-center gap-3 py-2 px-4 rounded-md hover:bg-[#f1f1f1] transition-colors duration-200 md:flex-row flex-col cursor-pointer`}
            >
              <LogoutIcon />
              <div className="flex items-center gap-3">
                <span className="font-montserrat text-[#2b2b2b] text-[13px] font-medium">
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
