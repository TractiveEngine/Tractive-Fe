"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon, Profile2User } from "../../_components/icons/AdminIcons";
import { RedSmallChart, SmallChart } from "../../_components/SmallChart";
import { adminUserService, AdminUserStats } from "@/services/adminUserService";

// Safely read a numeric value from any of the given dotted paths on an unknown object.
const readNumber = (
  source: Record<string, unknown> | null | undefined,
  paths: string[],
): number | null => {
  if (!source) return null;
  for (const path of paths) {
    const segments = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = source;
    for (const seg of segments) {
      if (cur == null) {
        cur = undefined;
        break;
      }
      cur = cur[seg];
    }
    if (typeof cur === "number" && Number.isFinite(cur)) return cur;
  }
  return null;
};

const formatCount = (n: number | null) =>
  n == null ? "—" : n.toLocaleString();

export const AllUserOverview = () => {
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [removedCount, setRemovedCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      adminUserService.getUserStats(),
      adminUserService.getRemovedUsers({ limit: 1 }),
    ])
      .then(([statsRes, removedRes]) => {
        if (cancelled) return;
        if (statsRes.status === "fulfilled") {
          console.log("🔎 /api/admin/users/stats response:", statsRes.value);
          setStats(statsRes.value);
        }
        if (removedRes.status === "fulfilled") {
          setRemovedCount(
            removedRes.value.pagination?.total ?? removedRes.value.data.length,
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const source = (stats as Record<string, unknown> | null) || null;

  const total = readNumber(source, ["total", "totalUsers", "all"]);
  const active = readNumber(source, [
    "active",
    "activeUsers",
    "byStatus.active",
  ]);
  const suspended = readNumber(source, [
    "suspended",
    "inactive",
    "suspendedUsers",
    "byStatus.suspended",
  ]);
  const removed =
    removedCount ??
    readNumber(source, ["removed", "removedUsers", "byStatus.removed"]);
  const agents = readNumber(source, ["agents", "byProfession.agent"]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full items-center">
      <StatCard
        label="All users"
        value={isLoading ? "…" : formatCount(total)}
        iconBg="#e2e2e2"
        iconStroke="#2b2b2b"
        iconKind="users"
        chart="green"
        cardBg="#F5F5F5"
        border="#e2e2e2"
        valueColor="#2b2b2b"
      />
      <StatCard
        label="Active users"
        value={isLoading ? "…" : formatCount(active)}
        iconBg="#CCE5CC"
        iconStroke="#538e53"
        iconKind="users"
        chart="green"
        cardBg="#EFF7EF"
        border="#CCE5CC"
        valueColor="#538e53"
      />
      <StatCard
        label="Suspended users"
        value={isLoading ? "…" : formatCount(suspended)}
        iconBg="#F2D8C5"
        iconStroke="#D77F40"
        iconKind="users"
        chart="red"
        cardBg="#FCF3EC"
        border="#F2D8C5"
        valueColor="#D77F40"
      />
      <StatCard
        label="Removed users"
        value={isLoading ? "…" : formatCount(removed)}
        iconBg="#E8D5FF"
        iconStroke="#9747FF"
        iconKind="eye"
        chart="red"
        cardBg="#F6EEFE"
        border="#E8D5FF"
        valueColor="#9747FF"
      />
      <StatCard
        label="Agents"
        value={isLoading ? "…" : formatCount(agents)}
        iconBg="#F4E9B5"
        iconStroke="#D6B611"
        iconKind="users"
        chart="green"
        cardBg="#FBF6DF"
        border="#F4E9B5"
        valueColor="#A78A0D"
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  iconBg: string;
  iconStroke: string;
  iconKind: "users" | "eye";
  chart: "green" | "red";
  cardBg: string;
  border: string;
  valueColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  iconBg,
  iconStroke,
  iconKind,
  chart,
  cardBg,
  border,
  valueColor,
}) => (
  <div
    className="flex flex-col gap-2 w-full px-2 py-2 rounded-[6px] shadow-md border transition-transform hover:-translate-y-[1px]"
    style={{ backgroundColor: cardBg, borderColor: border }}
  >
    <div className="flex items-center gap-1">
      <div
        className="p-1 rounded-[100px]"
        style={{ backgroundColor: iconBg }}
      >
        {iconKind === "users" ? (
          <Profile2User stroke={iconStroke} />
        ) : (
          <EyeIcon stroke={iconStroke} />
        )}
      </div>
      <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
        {label}
      </p>
    </div>
    <div className="flex items-center gap-1.5">
      <span
        className="font-montserrat text-[14px] font-semibold"
        style={{ color: valueColor }}
      >
        {value}
      </span>
    </div>
    <div className="flex items-center">
      <span className="font-montserrat text-[#2b2b2b] w-[100%] text-[10px] font-normal">
        In contrast to last week
      </span>
      {chart === "green" ? <SmallChart /> : <RedSmallChart />}
    </div>
  </div>
);
