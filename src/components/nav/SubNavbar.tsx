"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isUserLoggedIn } from "@/utils/loginAuth"; // Adjust path as needed
import {
  HomeIcon,
  SellerIcon,
  TransportationIcon,
  WishListIcon,
} from "@/icons/Icons";

export const SubNavbar: React.FC = () => {
  const pathname = usePathname();
  const isLoggedIn = isUserLoggedIn();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Navigation items with routes, names, and icons
  const navItems = [
    {
      href: "/buyers",
      name: "Home",
      icon: (
        <HomeIcon
          isActive={pathname === "/buyers"}
          isHovered={hoveredItem === "/buyers"}
        />
      ),
    },
    {
      href: "/buyers/transporter-list",
      name: "Transporters List",
      icon: (
        <TransportationIcon
          isActive={pathname === "/buyers/transporter-list"}
          isHovered={hoveredItem === "/buyers/transporter-list"}
        />
      ),
    },
    {
      href: "/buyers/sellers-list",
      name: "Sellers List",
      icon: (
        <SellerIcon
          isActive={pathname === "/buyers/sellers-list"}
          isHovered={hoveredItem === "/buyers/sellers-list"}
        />
      ),
    },
    {
      href: "/buyers/wish-list",
      name: "Wish List",
      icon: (
        <WishListIcon
          isActive={pathname === "/buyers/wish-list"}
          isHovered={hoveredItem === "/buyers/wish-list"}
        />
      ),
    },
  ];

  // Only render subnavbar when logged in
  if (!isLoggedIn) return null;

  return (
    <div className="w-[90%] mx-auto py-2 font-montserrat sm:flex sm:flex-col sm:items-start sm:gap-4 md:flex-row md:items-center md:justify-center">
      <ul className="flex justify-center sm:flex-col sm:w-full md:flex-row md:gap-12">
        {navItems.map((item) => (
          <li
            key={item.href}
            className="flex items-center sm:mb-2 md:mb-0"
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href={item.href}
              className={`flex items-center gap-2 text-[0.79rem] font-normal transition ${
                pathname === item.href
                  ? "text-[#538E53] font-normal"
                  : "text-[#2B2B2B] hover:text-[#538E53]"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
