"use client";
import { AdminOverview } from "./_components/AdminOverview";
import { AdminRevenueChart } from "./_components/AdminRevenueChart";
import { TopAgents } from "./_components/TopAgents";
import { TopBuyer } from "./_components/TopBuyer";
import { TopTransporter } from "./_components/TopTransporter";

export default function AdminDashboard() {
  return (
    <div className="w-[95%] mx-auto flex flex-col gap-4 mb-[2rem] justify-center">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <AdminOverview />
          <AdminRevenueChart />
        </div>
        <TopBuyer />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <TopTransporter />
        <TopAgents />
      </div>
    </div>
  );
}
