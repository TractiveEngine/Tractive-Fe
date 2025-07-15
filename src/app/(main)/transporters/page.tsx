"use client";
import { MostHired } from "./_components/MostHired";
import { TopCustomers } from "./_components/TopCustomers";
import { TransitTable } from "./_components/TransitTable";
import { TransporterOverview } from "./_components/TransporterOverview";
import { TransporterRevenueChart } from "./_components/TransporterRevenueChart";

export default function AgentDashboard() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-6 w-full lg:w-[75%]">
          <TransporterOverview />
          <TransporterRevenueChart />
        </div>
        <div className="w-full lg:w-1/3 bg-[#fefefe] shadow-md rounded-[6px]">
          <MostHired />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <TopCustomers />
        </div>
        <div className="w-full">
          <TransitTable />
        </div>
      </div>
    </div>
  );
}
