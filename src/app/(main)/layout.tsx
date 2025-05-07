// app/help/layout.tsx
"use client";
import { Navbar } from "@/components/nav/Navbar";
import { SubNavbar } from "@/components/nav/SubNavbar";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f1f1f1]">
      <nav className="bg-[#fefefe] w-full">
        <Navbar />
        <div className="bg-[#EBEBEB] w-full">
          <SubNavbar />
        </div>
      </nav>
      {children}
    </div>
  );
}
