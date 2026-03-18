import { useQuery } from "@tanstack/react-query";
import { OrdersApiService, OrdersQueryParams } from "@/services/OrderService";

// Query key factory
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: OrdersQueryParams) => [...orderKeys.lists(), params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

/**
 * Fetch orders — cached by status/filter params.
 * staleTime of 5 minutes avoids repeated network calls on every render.
 */
export const useOrders = (params?: OrdersQueryParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => OrdersApiService.getOrders(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: { response?: { status?: number } }) => {
      if (error?.response?.status === 401 || error?.response?.status === 403)
        return false;
      return failureCount < 2;
    },
  });
};
