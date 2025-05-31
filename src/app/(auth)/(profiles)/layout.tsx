// app/help/layout.tsx
"use client";
import { AsideNav } from "@/components/nav/AsideNav";
import { Navbar } from "@/components/nav/Navbar";
import { SubNavbar } from "@/components/nav/SubNavbar";

export default function ProfileSettingLayout({
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
      <div className="w-full flex flex-col md:flex-row gap-6 p-4">
        <aside className="w-[70%] rounded-md">
          <AsideNav />
        </aside>
        {children}
      </div>
    </div>
  );
}
