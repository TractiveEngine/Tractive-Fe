"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { bannerService, type BannerPayload } from "@/services/bannerService";

// Query key factory
export const bannerKeys = {
  all: ["banners"] as const,
  list: () => [...bannerKeys.all, "list"] as const,
  adminList: () => [...bannerKeys.all, "admin", "list"] as const,
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

/**
 * Every banner (active or not) for the admin settings screen. Kept fresh for
 * only a minute — admins expect their own edits to show up straight away.
 */
export const useAdminBanners = () => {
  return useQuery({
    queryKey: bannerKeys.adminList(),
    queryFn: () => bannerService.getAdminBanners(),
    staleTime: 60 * 1000,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BannerPayload) => bannerService.createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner created");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not create the banner"));
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<BannerPayload>;
    }) => bannerService.updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner updated");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not update the banner"));
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bannerService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner deleted");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not delete the banner"));
    },
  });
};
