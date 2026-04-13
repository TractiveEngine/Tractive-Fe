import { useQuery, useMutation } from "@tanstack/react-query";
import { OrdersApiService, OrdersQueryParams, CreateOrderPayload } from "@/services/OrderService";
import { toast } from "sonner";

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
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => OrdersApiService.createOrder(payload),
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to create order. Please try again.",
        { duration: 4000, position: "top-center" },
      );
    },
  });
};

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

export const useTransportReadyOrders = () => {
  return useQuery({
    queryKey: orderKeys.list({ readyForTransport: true }),
    queryFn: () => OrdersApiService.getOrders({ readyForTransport: true }),
    staleTime: 1000 * 60 * 3,
    retry: (failureCount, error: { response?: { status?: number } }) => {
      if (error?.response?.status === 401 || error?.response?.status === 403)
        return false;
      return failureCount < 2;
    },
  });
};
