import React from "react";
import { AccountSidebar } from "./_components/AccountSidebar";

export default function BuyerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-[#f1f1f1] py-4 sm:py-6 mb-[2rem]">
      <div className="w-[95%] mx-auto flex flex-col md:flex-row gap-4">
        <AccountSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
