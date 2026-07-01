import { useQuery } from "@tanstack/react-query";
import {
  adminDashboardService,
  AdminDashboardOverview,
  AdminRevenueParams,
  RevenuePoint,
  TopAgent,
  TopBuyer,
  TopTransporter,
} from "@/services/adminDashboardService";

/**
 * One query per dashboard widget so each loads independently — whichever
 * endpoint responds first renders immediately while the slower widgets keep
 * showing their skeletons (A1–A5 in BACKEND_API_REQUIREMENTS.md).
 */

export const adminDashboardKeys = {
  overview: ["admin-dashboard", "overview"] as const,
  revenue: (params: AdminRevenueParams) =>
    ["admin-dashboard", "revenue", params] as const,
  topAgents: (limit: number) =>
    ["admin-dashboard", "top-agents", limit] as const,
  topBuyers: (limit: number) =>
    ["admin-dashboard", "top-buyers", limit] as const,
  topTransporters: (limit: number) =>
    ["admin-dashboard", "top-transporters", limit] as const,
};

export const useAdminOverview = () =>
  useQuery<AdminDashboardOverview>({
    queryKey: adminDashboardKeys.overview,
    queryFn: () => adminDashboardService.getOverview(),
  });

export const useAdminRevenue = (params: AdminRevenueParams = {}) =>
  useQuery<RevenuePoint[]>({
    queryKey: adminDashboardKeys.revenue(params),
    queryFn: () => adminDashboardService.getRevenue(params),
  });

export const useTopAgents = (limit = 5) =>
  useQuery<TopAgent[]>({
    queryKey: adminDashboardKeys.topAgents(limit),
    queryFn: () => adminDashboardService.getTopAgents(limit),
  });

export const useTopBuyers = (limit = 7) =>
  useQuery<TopBuyer[]>({
    queryKey: adminDashboardKeys.topBuyers(limit),
    queryFn: () => adminDashboardService.getTopBuyers(limit),
  });

export const useTopTransporters = (limit = 5) =>
  useQuery<TopTransporter[]>({
    queryKey: adminDashboardKeys.topTransporters(limit),
    queryFn: () => adminDashboardService.getTopTransporters(limit),
  });
