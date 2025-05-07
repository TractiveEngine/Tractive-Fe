"use client";
import Image from "next/image";
import { BuyersHeader } from "./_components/BuyerHome/header/BuyersHeader";
import { TopSelling } from "./_components/BuyerHome/TopSelling";
import { Biding } from "./_components/BuyerHome/Biding";
import { Recommendation } from "./_components/BuyerHome/Recommendation";

export default function BuyerDashboard() {
  return (
    <div className="flex flex-col bg-[#f1F1F1]">
      <BuyersHeader />
      <TopSelling />
      <Biding />
      <Recommendation />
    </div>
  );
}
