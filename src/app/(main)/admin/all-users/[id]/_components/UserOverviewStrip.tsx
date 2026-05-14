"use client";

import React from "react";
import {
  AdminUserRoleHistory,
  AdminUserSummary,
  HistoryRole,
  RECENT_KEY_BY_RESOURCE,
  HISTORY_RESOURCES_BY_ROLE,
} from "@/services/adminUserService";

interface UserOverviewStripProps {
  user: AdminUserSummary;
  availableRoles: HistoryRole[];
  onShowRecentActivity: () => void;
}

const ROLE_LABELS: Record<HistoryRole, string> = {
  buyer: "As a buyer",
  agent: "As an agent",
  transporter: "As a transporter",
};

const STAT_LABELS: Record<string, string> = {
  productsCount: "Products",
  salesCount: "Sales",
  paidOrdersCount: "Paid orders",
  ordersCount: "Orders",
  deliveredOrdersCount: "Delivered",
  transactionsCount: "Transactions",
  transportPaymentsCount: "Transport payments",
  paymentsCount: "Payments",
  tripsCount: "Trips",
  completedTripsCount: "Completed trips",
  totalSalesAmount: "Sales total",
  totalSpentApproved: "Spent (approved)",
  totalSpentAmount: "Spent",
  totalEarningsAmount: "Earnings",
  totalPaidAmount: "Paid total",
};

const AMOUNT_KEYS = new Set([
  "totalSalesAmount",
  "totalSpentApproved",
  "totalSpentAmount",
  "totalEarningsAmount",
  "totalPaidAmount",
]);

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const labelFromKey = (key: string) => {
  if (STAT_LABELS[key]) return STAT_LABELS[key];
  return key
    .replace(/Count$/, "")
    .replace(/Amount$/, "")
    .replace(/Approved$/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
};

interface Stat {
  key: string;
  label: string;
  display: string;
  isAmount: boolean;
}

const extractStats = (block: AdminUserRoleHistory): Stat[] =>
  Object.entries(block)
    .filter(([key, value]) => {
      if (typeof value !== "number" || !Number.isFinite(value)) return false;
      return (
        key.endsWith("Count") || key.endsWith("Amount") || key.endsWith("Approved")
      );
    })
    .map(([key, value]) => ({
      key,
      label: labelFromKey(key),
      display: AMOUNT_KEYS.has(key)
        ? NGN.format(value as number)
        : (value as number).toLocaleString(),
      isAmount: AMOUNT_KEYS.has(key),
    }));

const totalRecentItems = (
  user: AdminUserSummary,
  roles: HistoryRole[],
): number => {
  const history = user.history;
  if (!history) return 0;
  let count = 0;
  for (const role of roles) {
    const block = history[role];
    if (!block || typeof block !== "object") continue;
    for (const resource of HISTORY_RESOURCES_BY_ROLE[role]) {
      const items = (block as Record<string, unknown>)[
        RECENT_KEY_BY_RESOURCE[resource]
      ];
      if (Array.isArray(items)) count += items.length;
    }
  }
  return count;
};

export const UserOverviewStrip: React.FC<UserOverviewStripProps> = ({
  user,
  availableRoles,
  onShowRecentActivity,
}) => {
  const history = user.history;
  if (!history || availableRoles.length === 0) return null;

  const rows = availableRoles
    .map((role) => {
      const block = history[role];
      if (!block || typeof block !== "object") return null;
      const stats = extractStats(block);
      if (stats.length === 0) return null;
      return { role, stats };
    })
    .filter(Boolean) as Array<{ role: HistoryRole; stats: Stat[] }>;

  if (rows.length === 0) return null;

  const recentCount = totalRecentItems(user, availableRoles);

  return (
    <section className="bg-[#fefefe] rounded-[10px] shadow-md overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-6 pt-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-montserrat font-semibold">
            Activity
          </p>
          <h2 className="font-montserrat text-base sm:text-lg font-normal text-[#2b2b2b]">
            Overview
          </h2>
        </div>
        {recentCount > 0 ? (
          <button
            type="button"
            onClick={onShowRecentActivity}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-montserrat font-medium text-[#538e53] hover:text-[#3f6e3f] transition-colors cursor-pointer group"
          >
            <span className="border-b border-dashed border-current group-hover:border-solid">
              View recent activity
            </span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] text-[10px] font-montserrat font-semibold rounded-full bg-[#538e53]/10 text-[#538e53] px-1.5">
              {recentCount}
            </span>
          </button>
        ) : null}
      </header>

      <div className="divide-y divide-gray-100 mt-4">
        {rows.map(({ role, stats }) => (
          <div key={role} className="px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.18em] font-montserrat font-semibold text-gray-400 mb-4">
              {ROLE_LABELS[role]}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
              {stats.map((stat) => (
                <div key={stat.key}>
                  <p
                    className={`font-montserrat font-semibold tabular-nums text-[#2b2b2b] leading-none ${
                      stat.isAmount
                        ? "text-xl sm:text-2xl"
                        : "text-2xl sm:text-[28px]"
                    }`}
                  >
                    {stat.display}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-gray-500 font-montserrat">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
