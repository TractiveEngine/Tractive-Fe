"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  HomeIcon,
  SellerIcon,
  TransportationIcon,
  WishListIcon,
} from "@/icons/Icons";
import { useCounteredBids } from "@/hooks/queries/useBidQueries";
import { useBuyerFleetBids } from "@/hooks/queries/useTransporterQueries";

const MyOrdersIcon: React.FC<{ isActive: boolean; isHovered: boolean }> = ({
  isActive,
  isHovered,
}) => {
  const stroke = isActive || isHovered ? "#538E53" : "#2B2B2B";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M2.25 2.25H3.75L4.65 11.325C4.725 12 5.325 12.525 6.0 12.525H13.875C14.475 12.525 15.0 12.0 15.15 11.4L16.275 6.375H5.1"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 16.125C7.16421 16.125 7.5 15.7892 7.5 15.375C7.5 14.9608 7.16421 14.625 6.75 14.625C6.33579 14.625 6 14.9608 6 15.375C6 15.7892 6.33579 16.125 6.75 16.125Z"
        stroke={stroke}
        strokeWidth="1.4"
      />
      <path
        d="M13.125 16.125C13.5392 16.125 13.875 15.7892 13.875 15.375C13.875 14.9608 13.5392 14.625 13.125 14.625C12.7108 14.625 12.375 14.9608 12.375 15.375C12.375 15.7892 12.7108 16.125 13.125 16.125Z"
        stroke={stroke}
        strokeWidth="1.4"
      />
    </svg>
  );
};

const MyBiddingsIcon: React.FC<{ isActive: boolean; isHovered: boolean }> = ({
  isActive,
  isHovered,
}) => {
  const stroke = isActive || isHovered ? "#538E53" : "#2B2B2B";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M9 1.5L11.25 6L16.5 6.75L12.75 10.5L13.5 15.75L9 13.125L4.5 15.75L5.25 10.5L1.5 6.75L6.75 6L9 1.5Z"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SubNavbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { data: counteredProductBids } = useCounteredBids(1, 10, isLoggedIn);
  const { data: fleetBids = [] } = useBuyerFleetBids();
  const counteredCount =
    (counteredProductBids?.pagination.total ?? 0) +
    (fleetBids?.filter((b) => b.status === "countered").length ?? 0);

  const isMyBiddingsActive = pathname?.startsWith("/buyer/my-biddings") ?? false;

  const navItems = [
    {
      href: "/buyer",
      name: "Home",
      icon: (
        <HomeIcon
          isActive={pathname === "/buyer"}
          isHovered={hoveredItem === "/buyer"}
        />
      ),
    },
    {
      href: "/buyer/transporter-list",
      name: "Transporters List",
      icon: (
        <TransportationIcon
          isActive={pathname === "/buyer/transporter-list"}
          isHovered={hoveredItem === "/buyer/transporter-list"}
        />
      ),
    },
    {
      href: "/buyer/sellers-list",
      name: "Sellers List",
      icon: (
        <SellerIcon
          isActive={pathname === "/buyer/sellers-list"}
          isHovered={hoveredItem === "/buyer/sellers-list"}
        />
      ),
    },
    {
      href: "/buyer/wish-list",
      name: "Wish List",
      icon: (
        <WishListIcon
          isActive={pathname === "/buyer/wish-list"}
          isHovered={hoveredItem === "/buyer/wish-list"}
        />
      ),
    },
    {
      href: "/buyer/my-biddings",
      name: "My Biddings",
      icon: (
        <MyBiddingsIcon
          isActive={isMyBiddingsActive}
          isHovered={hoveredItem === "/buyer/my-biddings"}
        />
      ),
      badge: counteredCount,
    },
    {
      href: "/buyer/track-orders",
      name: "My Orders",
      icon: (
        <MyOrdersIcon
          isActive={pathname === "/buyer/track-orders"}
          isHovered={hoveredItem === "/buyer/track-orders"}
        />
      ),
    },
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="w-[90%] mx-auto py-3 font-montserrat flex justify-center">
      <ul className="flex overflow-x-auto gap-8 py-2 px-4 snap-x snap-mandatory md:gap-12 md:justify-center sm:overflow-x-visible sm:pb-0 md:px-0">
        {navItems.map((item) => {
          const isActive =
            item.href === "/buyer/my-biddings"
              ? isMyBiddingsActive
              : pathname === item.href;
          return (
            <li
              key={item.href}
              className="flex items-center snap-center"
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.href}
                className={`relative flex items-center gap-2 text-[0.75rem] sm:text-[0.79rem] font-normal transition whitespace-nowrap ${
                  isActive
                    ? "text-[#538E53] font-normal"
                    : "text-[#2B2B2B] hover:text-[#538E53]"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {"badge" in item && item.badge && item.badge > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-medium bg-[#2563eb] text-white rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
