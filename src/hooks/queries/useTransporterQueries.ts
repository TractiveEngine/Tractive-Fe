import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transporterService, GetTransportersParams, ApiTruck } from "@/services/transporterService";
import {
  NegotiationService,
  CreateFleetBidPayload,
  NegotiationRespondPayload,
  CreateFleetPaymentPayload,
} from "@/services/negotiationService";
import { toast } from "sonner";

export const transporterKeys = {
  all: ["transporters"] as const,
  list: (params?: GetTransportersParams) => [...transporterKeys.all, "list", params] as const,
  detail: (id: string) => [...transporterKeys.all, "detail", id] as const,
  fleet: (id: string) => [...transporterKeys.all, "fleet", id] as const,
  reviews: (id: string) => [...transporterKeys.all, "reviews", id] as const,
  truck: (id: string) => [...transporterKeys.all, "truck", id] as const,
  trucks: (params: Record<string, unknown> | undefined) => [...transporterKeys.all, "trucks", params] as const,
  fleetBids: () => [...transporterKeys.all, "fleet-bids"] as const,
};

export const useGetTransporters = (params?: GetTransportersParams) => {
  return useQuery({
    queryKey: transporterKeys.list(params),
    queryFn: () => transporterService.getTransporters(params),
  });
};

export const useGetTransporter = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: transporterKeys.detail(id),
    queryFn: () => transporterService.getTransporterById(id),
    enabled: !!id && (options?.enabled !== false),
  });
};

export const useGetFleetById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: transporterKeys.fleet(id),
    queryFn: () => transporterService.getFleetById(id),
    enabled: !!id && (options?.enabled !== false),
  });
};

export const useGetTruckById = (id: string | null, options?: { enabled?: boolean }) => {
  return useQuery<ApiTruck>({
    queryKey: transporterKeys.truck(id || ""),
    queryFn: () => transporterService.getTruckById(id!),
    enabled: !!id && (options?.enabled !== false),
  });
};

export const useGetTransporterReviews = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: transporterKeys.reviews(id),
    queryFn: () => transporterService.getTransporterReviews(id),
    enabled: !!id && (options?.enabled !== false),
  });
};

export const useGetTransporterTrucks = (params?: {
  status?: string;
  fromState?: string;
  toState?: string;
}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: transporterKeys.trucks(params),
    queryFn: () => transporterService.getTransporterTrucks(params),
    enabled: options?.enabled !== false,
  });
};

export const useCreateFleetBid = () => {
  return useMutation({
    mutationFn: ({ fleetId, payload }: { fleetId: string; payload: CreateFleetBidPayload }) =>
      NegotiationService.createFleetBid(fleetId, payload),
    onSuccess: () => {
      toast.success("Bid sent successfully!", { duration: 4000, position: "top-center" });
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to send bid. Please try again.",
        { duration: 4000, position: "top-center" },
      );
    },
  });
};

// --- Fleet Bids Hooks ---

export const useBuyerFleetBids = () => {
  return useQuery({
    queryKey: transporterKeys.fleetBids(),
    queryFn: () => NegotiationService.getBuyerFleetBids(),
    staleTime: 3 * 60 * 1000,
  });
};

export const useRespondToFleetBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fleetId,
      bidId,
      payload,
    }: {
      fleetId: string;
      bidId: string;
      payload: NegotiationRespondPayload;
    }) => NegotiationService.respondToFleetBid(fleetId, bidId, payload),
    onSuccess: () => {
      toast.success("Response sent successfully!", { duration: 4000, position: "top-center" });
      queryClient.invalidateQueries({ queryKey: transporterKeys.fleetBids() });
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to respond. Please try again.",
        { duration: 4000, position: "top-center" },
      );
    },
  });
};

export const useCreateFleetPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFleetPaymentPayload) =>
      NegotiationService.createFleetPayment(payload),
    onSuccess: () => {
      toast.success("Payment submitted successfully!", { duration: 4000, position: "top-center" });
      queryClient.invalidateQueries({ queryKey: transporterKeys.fleetBids() });
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Payment failed. Please try again.",
        { duration: 4000, position: "top-center" },
      );
    },
  });
};
