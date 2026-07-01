import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  agentDashboardService,
  AgentDashboardOverview,
  AgentRevenueParams,
  MostSoldCategory,
  MostSoldItem,
  OutOfStockProduct,
  RestockPayload,
  RevenuePoint,
  TopCustomer,
} from "@/services/agentDashboardService";

/**
 * One query per dashboard widget so each loads independently — whichever
 * endpoint responds first renders immediately while the slower widgets keep
 * showing their skeletons (G1–G6 in BACKEND_API_REQUIREMENTS.md).
 */

export const agentDashboardKeys = {
  overview: ["agent-dashboard", "overview"] as const,
  revenue: (params: AgentRevenueParams) =>
    ["agent-dashboard", "revenue", params] as const,
  topCustomers: (limit: number) =>
    ["agent-dashboard", "top-customers", limit] as const,
  outOfStock: (limit: number) =>
    ["agent-dashboard", "out-of-stock", limit] as const,
  mostSoldItems: (limit: number) =>
    ["agent-dashboard", "most-sold-items", limit] as const,
  mostSoldCategories: ["agent-dashboard", "most-sold-categories"] as const,
};

export const useAgentOverview = () =>
  useQuery<AgentDashboardOverview>({
    queryKey: agentDashboardKeys.overview,
    queryFn: () => agentDashboardService.getOverview(),
  });

export const useAgentRevenue = (params: AgentRevenueParams = {}) =>
  useQuery<RevenuePoint[]>({
    queryKey: agentDashboardKeys.revenue(params),
    queryFn: () => agentDashboardService.getRevenue(params),
  });

export const useAgentTopCustomers = (limit = 5) =>
  useQuery<TopCustomer[]>({
    queryKey: agentDashboardKeys.topCustomers(limit),
    queryFn: () => agentDashboardService.getTopCustomers(limit),
  });

export const useAgentOutOfStock = (limit = 7) =>
  useQuery<OutOfStockProduct[]>({
    queryKey: agentDashboardKeys.outOfStock(limit),
    queryFn: () => agentDashboardService.getOutOfStock(limit),
  });

export const useAgentMostSoldItems = (limit = 4) =>
  useQuery<MostSoldItem[]>({
    queryKey: agentDashboardKeys.mostSoldItems(limit),
    queryFn: () => agentDashboardService.getMostSoldItems(limit),
  });

export const useAgentMostSoldCategories = () =>
  useQuery<MostSoldCategory[]>({
    queryKey: agentDashboardKeys.mostSoldCategories,
    queryFn: () => agentDashboardService.getMostSoldCategories(),
  });

// Restock from the Out-of-Stock widget; on success refresh that list so the
// restocked product drops off without a manual reload.
export const useRestockProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: RestockPayload;
    }) => agentDashboardService.restockProduct(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-dashboard", "out-of-stock"] });
    },
  });
};
