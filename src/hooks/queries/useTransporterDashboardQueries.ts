import { useQuery } from "@tanstack/react-query";
import {
  transporterDashboardService,
  TransporterDashboardOverview,
  TransporterRevenueParams,
  MostHiredDriver,
  RevenuePoint,
  TopCustomer,
  TransitRow,
} from "@/services/transporterDashboardService";

/**
 * One query per dashboard widget so each loads independently — whichever
 * endpoint responds first renders immediately while the slower widgets keep
 * showing their skeletons (T1–T5 in BACKEND_API_REQUIREMENTS.md).
 */

export const transporterDashboardKeys = {
  overview: ["transporter-dashboard", "overview"] as const,
  revenue: (params: TransporterRevenueParams) =>
    ["transporter-dashboard", "revenue", params] as const,
  mostHired: (limit: number) =>
    ["transporter-dashboard", "most-hired", limit] as const,
  topCustomers: (limit: number) =>
    ["transporter-dashboard", "top-customers", limit] as const,
  transit: (limit: number) =>
    ["transporter-dashboard", "transit", limit] as const,
};

export const useTransporterOverview = () =>
  useQuery<TransporterDashboardOverview>({
    queryKey: transporterDashboardKeys.overview,
    queryFn: () => transporterDashboardService.getOverview(),
  });

export const useTransporterRevenue = (params: TransporterRevenueParams = {}) =>
  useQuery<RevenuePoint[]>({
    queryKey: transporterDashboardKeys.revenue(params),
    queryFn: () => transporterDashboardService.getRevenue(params),
  });

export const useTransporterMostHired = (limit = 7) =>
  useQuery<MostHiredDriver[]>({
    queryKey: transporterDashboardKeys.mostHired(limit),
    queryFn: () => transporterDashboardService.getMostHired(limit),
  });

export const useTransporterTopCustomers = (limit = 5) =>
  useQuery<TopCustomer[]>({
    queryKey: transporterDashboardKeys.topCustomers(limit),
    queryFn: () => transporterDashboardService.getTopCustomers(limit),
  });

export const useTransporterTransit = (limit = 10) =>
  useQuery<TransitRow[]>({
    queryKey: transporterDashboardKeys.transit(limit),
    queryFn: () => transporterDashboardService.getTransit(limit),
  });
