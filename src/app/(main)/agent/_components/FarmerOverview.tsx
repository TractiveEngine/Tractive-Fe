"use client";
import { Bag2Icon, MoneyReceive2Icon, Profile2UserIcon } from "@/icons/DashboardIcons";
import React from "react";
import { RedSmallChart, SmallChart } from "./SmallChart";
import { useAgentOverview } from "@/hooks/queries/useAgentDashboardQueries";
import { OverviewBlock } from "@/services/agentDashboardService";
import { formatCurrency, formatNumber, formatDelta } from "@/lib/format";

type CardConfig = {
  key: "revenue" | "customers" | "orders" | "products";
  label: string;
  format: (value: number) => string;
  icon: React.ReactNode;
  iconWrap: string;
  chart: React.ReactNode;
};

const CARDS: CardConfig[] = [
  {
    key: "revenue",
    label: "Revenue",
    format: formatCurrency,
    icon: <MoneyReceive2Icon stroke="#538e53" />,
    iconWrap: "bg-[#CCE5CC4D]",
    chart: <SmallChart />,
  },
  {
    key: "customers",
    label: "Customers",
    format: formatNumber,
    icon: <Profile2UserIcon stroke="#D77F40" />,
    iconWrap: "bg-[#F2D8C599]",
    chart: <SmallChart />,
  },
  {
    key: "orders",
    label: "Orders",
    format: formatNumber,
    icon: <Bag2Icon stroke="#7912FF" />,
    iconWrap: "bg-[#7912FF33]",
    chart: <RedSmallChart />,
  },
  {
    key: "products",
    label: "Products",
    format: formatNumber,
    icon: <Profile2UserIcon stroke="#D77F40" />,
    iconWrap: "bg-[#F2D8C599]",
    chart: <SmallChart />,
  },
];

const CardShell = ({
  card,
  children,
}: {
  card: CardConfig;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2 w-full bg-[#fefefe] p-3 rounded-[4px] shadow-md">
    <div className="flex items-center gap-1">
      <div className={`${card.iconWrap} p-1 rounded-[100px]`}>{card.icon}</div>
      <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
        {card.label}
      </p>
    </div>
    {children}
  </div>
);

// Colour the delta by its sign so a drop never looks like growth:
// green = up, red = down, neutral grey = flat.
const deltaClasses = (delta: number): string => {
  if (delta > 0) return "bg-[#cce5cc] text-[#2b6b2b]";
  if (delta < 0) return "bg-[#f6dada] text-[#b23b3b]";
  return "bg-[#ededed] text-[#2b2b2b]";
};

const StatCard = ({
  card,
  block,
}: {
  card: CardConfig;
  block: OverviewBlock;
}) => (
  <CardShell card={card}>
    <div className="flex items-center gap-1.5">
      <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium">
        {card.format(block.value)}
      </span>
      <span
        className={`${deltaClasses(block.deltaPercent)} rounded-full px-1.5 py-0.5 text-[10px] font-montserrat`}
      >
        {formatDelta(block.deltaPercent)}
      </span>
    </div>
    <div className="flex items-center">
      <span className="font-montserrat text-[#2b2b2b] w-[100%] text-[10px] font-normal">
        In contrast to last week
      </span>
      {card.chart}
    </div>
  </CardShell>
);

const CardSkeleton = ({ card }: { card: CardConfig }) => (
  <CardShell card={card}>
    <div className="flex items-center gap-1.5">
      <span className="h-3 w-16 rounded bg-[#ececec] animate-pulse" />
      <span className="h-3 w-9 rounded-full bg-[#ececec] animate-pulse" />
    </div>
    <div className="flex items-center">
      <span className="font-montserrat text-[#2b2b2b] w-[100%] text-[10px] font-normal">
        In contrast to last week
      </span>
      {card.chart}
    </div>
  </CardShell>
);

export const FarmerOverview = () => {
  const { data, isLoading, isError } = useAgentOverview();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 w-full items-center">
      {CARDS.map((card) =>
        isLoading || (!data && !isError) ? (
          <CardSkeleton key={card.key} card={card} />
        ) : (
          <StatCard
            key={card.key}
            card={card}
            block={data?.[card.key] ?? { value: 0, deltaPercent: 0 }}
          />
        ),
      )}
    </div>
  );
};
