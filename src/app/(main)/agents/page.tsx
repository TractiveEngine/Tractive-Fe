"use client";
import { FarmerRevenueChart } from "./_components/FarmerRevenueChart";
import { FarmerOverview } from "./_components/FarmerOverview";
import { OutOfStock } from "./_components/OutOfStock";
import { TopCustomers } from "./_components/TopCustomers";
import { MostSoldCategoryBarChart } from "./_components/MostSoldCategoryBarChart";
import { MostSoldItem } from "./_components/MostSoldItem";

export default function AgentDashboard() {
  return (
    <div className="w-[90%] mx-auto flex flex-col justify-center">
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <FarmerOverview />
          <FarmerRevenueChart />
        </div>
        <OutOfStock />
      </div>
      <div className="flex gap-4 w-full">
        <TopCustomers />
        <MostSoldCategoryBarChart />
        <MostSoldItem />
      </div>
    </div>
  );
}
