"use client";
import { MostHired } from "./_components/MostHired";
import { TopCustomers } from "./_components/TopCustomers";
import { TransitTable } from "./_components/TransitTable";
import { TransporterOverview } from "./_components/TransporterOverview";
import { TransporterRevenueChart } from "./_components/TransporterRevenueChart";

// Mirrors the agent dashboard layout. Previously this rendered the whole
// dashboard TWICE (a `hidden lg:flex` block and a `flex lg:hidden` block), so
// TransporterOverview and TransporterRevenueChart were mounted twice and fetched
// twice. One responsive tree replaces both.
export default function TransporterDashboard() {
  return (
    <div className="w-[95%] mx-auto flex flex-col gap-4 mb-[2rem]">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* min-w-0 lets this column actually shrink inside the flex row, so the
            stat tiles get the full width instead of being squeezed. */}
        <div className="flex flex-col gap-4 w-full min-w-0">
          <TransporterOverview />
          <TransporterRevenueChart />
        </div>
        <div className="w-full lg:w-1/3 lg:shrink-0 bg-[#fefefe] shadow-md rounded-[6px]">
          <MostHired />
        </div>
      </div>

      {/* items-start, not items-center — panels of different heights should sit
          flush at the top, not float vertically centred against each other. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-start">
        <TopCustomers />
        <TransitTable />
      </div>
    </div>
  );
}
