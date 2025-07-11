"use client";
import { MostSoldCategoryPieChart } from "../agents/_components/MostSoldCategoryPieChart";
import { MostSoldItem } from "../agents/_components/MostSoldItem";
import { OutOfStock } from "../agents/_components/OutOfStock";
import { TopCustomers } from "../agents/_components/TopCustomers";
import { MostHired } from "./_components/MostHired";
import { TransporterOverview } from "./_components/TransporterOverview";
import { TransporterRevenueChart } from "./_components/TransporterRevenueChart";

export default function AgentDashboard() {
  return (
    <div className="w-[95%] mx-auto flex flex-col gap-4 mb-[2rem] justify-center">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <TransporterOverview />
          <TransporterRevenueChart />
        </div>
        <MostHired />
      </div>
      <div className="flex items-center gap-4 w-full">
        <TopCustomers />
        <MostSoldItem />
      </div>
    </div>
  );
}
