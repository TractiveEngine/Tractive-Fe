import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Sample data with daily points for each month
interface ChartDataPoint {
  date: string;
  value: number;
  month: string;
}

const data: ChartDataPoint[] = [
  { month: "Jan", value: 10000, date: "14 Jan 2025" }, // Start at origin
  { month: "Feb", value: 20000, date: "14 feb 2025" },
  { month: "Mar", value: 40000, date: "14 Mar 2025" },
  { month: "Apr", value: 30000, date: "14 Apr 2025" },
  { month: "May", value: 60000, date: "14 May 2025" },
  { month: "Jun", value: 50000, date: "14 Jun 2025" },
  { month: "Jul", value: 65000, date: "14 Jul 2025" },
  { month: "Aug", value: 85000, date: "14 Aug 2025" },
  { month: "sept", value: 35000, date: "14 sept 2025" },
  { month: "oct", value: 20000, date: "14 oct 2025" },
  { month: "Nov", value: 70000, date: "14 Nov 2025" },
  { month: "Dec", value: 90000, date: "14 Dec 2025" },
];

import { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-[7px] bg-[#538e53] flex gap-1 rounded-md border-l-[3px] border-[#538e53]">
        <div className="w-[2px] h-[2.8rem] rounded-md bg-[#fefefe]"></div>
        
       <div className="flex flex-col gap-[0.5rem]">
        <p className="text-medium text-[12px] text-[#fefefe] font-montserrat">
          {new Date(payload[0].payload.date).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <span className="text-[12px] text-[#fefefe] font-montserrat">${payload[0]?.value?.toLocaleString()}</span>
       </div>
      </div>
    );
  }
  return null;
};

export const AdminRevenueChart = () => {
  return (
    <div className="w-full bg-[#fefefe] rounded-[4px] shadow-md">
      <h2 className="font-montserrat text-[#2b2b2b] text-[13px] p-2 pl-4 rounded-tl-[6px] rounded-br-[6px]  font-medium mb-4 bg-[#cce5cc] flex items-center justify-center w-[25%] md:w-[15%]">
        Revenue
      </h2>
      <div className="w-full h-[280px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#CCE5CC00" stopOpacity={0} />
                <stop offset="100%" stopColor="#CCE5CC" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={true}
              tickLine={false}
              tickCount={12}
              tickFormatter={(date) =>
                new Date(date).toLocaleString("en-US", { month: "short" })
              }
              tick={{ fontSize: 12, fill: "#2b2b2b" }}
              fontFamily="Montserrat, sans-serif"
            />
            <YAxis
              domain={[10000, 90000]}
              ticks={[
                10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
              ]}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 12, fill: "#2b2b2b" }}
              axisLine={false}
              tickLine={false}
              fontFamily="Montserrat, sans-serif"
            />
            <CartesianGrid
              strokeDashoffset="3 3"
              stroke="#e2e2e2"
              vertical={false}
              horizontal={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#538e53"
              strokeWidth={2}
              fill="url(#colorGradient)"
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
