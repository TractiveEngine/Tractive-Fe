import { useQuery } from "@tanstack/react-query";
import { transporterService } from "@/services/transporterService";

export const transporterKeys = {
  all: ["transporters"] as const,
  detail: (id: string) => [...transporterKeys.all, "detail", id] as const,
  reviews: (id: string) => [...transporterKeys.all, "reviews", id] as const,
  trucks: (params: Record<string, unknown> | undefined) => [...transporterKeys.all, "trucks", params] as const,
};

export const useGetTransporters = () => {
  return useQuery({
    queryKey: transporterKeys.all,
    queryFn: transporterService.getTransporters,
  });
};

export const useGetTransporter = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: transporterKeys.detail(id),
    queryFn: () => transporterService.getTransporterById(id),
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
  // We use structured params for the query key
  return useQuery({
    queryKey: transporterKeys.trucks(params),
    queryFn: () => transporterService.getTransporterTrucks(params),
    enabled: options?.enabled !== false,
  });
};
