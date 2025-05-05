"use client";
import Image from "next/image";
import { BuyersHeader } from "./_components/header/BuyersHeader";

export default function BuyerDashboard() {
  return (
    <div className="flex flex-col items-center bg-[#f1F1F1]">
      <BuyersHeader />
    </div>
  );
}
