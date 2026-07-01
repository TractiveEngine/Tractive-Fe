import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/bannerService";

// Query key factory
export const bannerKeys = {
  all: ["banners"] as const,
  list: () => [...bannerKeys.all, "list"] as const,
};

/**
 * Buyer homepage banners (BuyersHeader slider). Cached for a while — banners
 * change rarely and are shared across the header slider.
 */
export const useBanners = () => {
  return useQuery({
    queryKey: bannerKeys.list(),
    queryFn: () => bannerService.getBanners(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error: { response?: { status?: number } }) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
};
