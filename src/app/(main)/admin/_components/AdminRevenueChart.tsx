"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { useAdminRevenue } from "@/hooks/queries/useAdminDashboardQueries";
import { CURRENCY_SYMBOL, formatCompactCurrency } from "@/lib/format";

// Backend sends monthly buckets as "YYYY-M" / "YYYY-MM" (e.g. "2026-1"), which
// `new Date()` cannot parse. Handle that shape explicitly, then fall back to ISO.
const parsePointDate = (raw: string): Date | null => {
  const ym = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(raw);
  if (ym) {
    const [, y, m, d] = ym;
    return new Date(Number(y), Number(m) - 1, d ? Number(d) : 1);
  }
  const dt = new Date(raw);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload as { date: string };
    const parsed = parsePointDate(point.date);
    const label = parsed
      ? parsed.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        })
      : point.date;
    return (
      <div className="p-[7px] bg-[#538e53] flex gap-1 rounded-md border-l-[3px] border-[#538e53]">
        <div className="w-[2px] h-[2.8rem] rounded-md bg-[#fefefe]"></div>
        <div className="flex flex-col gap-[0.5rem]">
          <p className="text-medium text-[12px] text-[#fefefe] font-montserrat">
            {label}
          </p>
          <span className="text-[12px] text-[#fefefe] font-montserrat">
            {CURRENCY_SYMBOL}
            {payload[0]?.value?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Round a max value up to a "nice" axis ceiling so the gridlines look clean.
const niceCeil = (max: number): number => {
  if (max <= 0) return 100;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / pow) * pow;
};

export const AdminRevenueChart = () => {
  const { data, isLoading, isError } = useAdminRevenue({ period: "month" });

  const points = data ?? [];
  const max = niceCeil(Math.max(0, ...points.map((p) => p.value)));

  return (
    <div className="w-full bg-[#fefefe] rounded-[4px] shadow-md">
      <h2 className="font-montserrat text-[#2b2b2b] text-[13px] p-2 pl-4 rounded-tl-[6px] rounded-br-[6px] font-medium mb-4 bg-[#cce5cc] flex items-center justify-center w-[25%] md:w-[15%]">
        Revenue
      </h2>
      <div className="w-full h-[280px] p-4">
        {isLoading ? (
          <div className="w-full h-full rounded-md bg-[#f3f3f3] animate-pulse" />
        ) : isError ? (
          <div className="w-full h-full flex items-center justify-center text-[12px] font-montserrat text-[#808080]">
            Couldn&apos;t load revenue.
          </div>
        ) : !points.length ? (
          <div className="w-full h-full flex items-center justify-center text-[12px] font-montserrat text-[#808080]">
            No revenue data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
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
                tickFormatter={(date) => {
                  const d = parsePointDate(date);
                  return d
                    ? d.toLocaleString("en-US", { month: "short" })
                    : date;
                }}
                tick={{ fontSize: 12, fill: "#2b2b2b" }}
                fontFamily="Montserrat, sans-serif"
              />
              <YAxis
                domain={[0, max]}
                width={54}
                tickFormatter={(value) => formatCompactCurrency(value)}
                tick={{ fontSize: 11, fill: "#2b2b2b" }}
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
        )}
      </div>
    </div>
  );
};
