import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  OrdersApiService,
  OrdersQueryParams,
  CreateOrderPayload,
  UpdateTransportStatusPayload,
} from "@/services/OrderService";
import { toast } from "sonner";

// Query key factory
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: OrdersQueryParams) => [...orderKeys.lists(), params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  transporterBuyer: (orderId: string) =>
    [...orderKeys.all, "transporter", orderId, "buyer"] as const,
  transporterProduct: (orderId: string) =>
    [...orderKeys.all, "transporter", orderId, "product"] as const,
  transporterTracking: (orderId: string) =>
    [...orderKeys.all, "transporter", orderId, "tracking"] as const,
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

/**
 * Orders where the buyer has paid for both the product AND the transport.
 * Placeholder filter `paidForTransport=true` — backend param name to be
 * confirmed; centralized here so swapping is a one-line change.
 */
// --- Transporter delivery flow ---

export const useTransporterOrderBuyer = (
  orderId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: orderKeys.transporterBuyer(orderId),
    queryFn: () => OrdersApiService.getTransporterOrderBuyer(orderId),
    enabled: !!orderId && options?.enabled !== false,
    staleTime: 1000 * 60 * 3,
  });
};

export const useTransporterOrderProduct = (
  orderId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: orderKeys.transporterProduct(orderId),
    queryFn: () => OrdersApiService.getTransporterOrderProduct(orderId),
    enabled: !!orderId && options?.enabled !== false,
    staleTime: 1000 * 60 * 3,
  });
};

export const useTransporterOrderTracking = (
  orderId: string,
  options?: { enabled?: boolean; refetchInterval?: number },
) => {
  return useQuery({
    queryKey: orderKeys.transporterTracking(orderId),
    queryFn: () => OrdersApiService.getTransporterOrderTracking(orderId),
    enabled: !!orderId && options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: 1000 * 30,
  });
};

export const useUpdateTransportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: UpdateTransportStatusPayload;
    }) => OrdersApiService.updateTransportStatus(orderId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Transport status updated!", {
        duration: 4000,
        position: "top-center",
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.transporterTracking(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to update status. Please try again.",
        { duration: 4000, position: "top-center" },
      );
    },
  });
};

export const usePaidShippingOrders = () => {
  return useQuery({
    queryKey: orderKeys.list({ paidForTransport: true }),
    queryFn: () => OrdersApiService.getOrders({ paidForTransport: true }),
    staleTime: 1000 * 60 * 3,
    retry: (failureCount, error: { response?: { status?: number } }) => {
      if (error?.response?.status === 401 || error?.response?.status === 403)
        return false;
      return failureCount < 2;
    },
  });
};
