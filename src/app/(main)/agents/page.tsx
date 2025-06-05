"use client";
import { FarmerRevenueChart } from "./_components/FarmerRevenueChart";
import { FarmerOverview } from "./_components/FarmerOverview";
import { OutOfStock } from "./_components/OutOfStock";
import { TopCustomers } from "./_components/TopCustomers";
import { MostSoldCategoryPieChart } from "./_components/MostSoldCategoryPieChart";
import { MostSoldItem } from "./_components/MostSoldItem";

export default function AgentDashboard() {
  return (
    <div className="w-[95%] mx-auto flex flex-col gap-4 mb-[2rem] justify-center">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <FarmerOverview />
          <FarmerRevenueChart />
        </div>
        <OutOfStock />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <TopCustomers />
        <MostSoldCategoryPieChart />
        <MostSoldItem />
      </div>
    </div>
  );
}
