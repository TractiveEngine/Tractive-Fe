"use client";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <div className="w-[90%] mx-auto py-2 flex justify-between font-montserrat items-center bg-[#F1F1F1]">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="Agrictech Logo"
          width={50}
          height={50}
        />
      </Link>

      {/* Main Links */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-normal">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`transition hover:text-[#538E53] text-[0.89rem] font-montserrat ${
                pathname === item.href ? "text-[#538E53] font-montserrat" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth Buttons */}
      <ul className="flex gap-4 items-center">
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
    </div>
  );
};
