import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, Bidder } from "@/services/productService";
import { bidService } from "@/services/bidService";
import { toast } from "sonner";

export const bidKeys = {
  all: ["bids"] as const,
  lists: () => [...bidKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...bidKeys.lists(), filters] as const,
  bidders: (productId: string) =>
    [...bidKeys.all, "bidders", productId] as const,
  winning: (productId: string) =>
    [...bidKeys.all, "winning", productId] as const,
};

/**
 * Hook to fetch bidders for a specific product
 */
export const useBidders = (productId: string | undefined) => {
  return useQuery({
    queryKey: bidKeys.bidders(productId || ""),
    queryFn: () => productService.getBidders(productId!),
    enabled: !!productId,
  });
};

/**
 * Hook to fetch winning bidder for a specific product
 */
export const useWinningBidder = (productId: string | undefined) => {
  return useQuery({
    queryKey: bidKeys.winning(productId || ""),
    queryFn: () => productService.getWinningBidder(productId!),
    enabled: !!productId,
  });
};

export const useMyBids = () => {
  return useQuery({
    queryKey: ["myBids"],
    queryFn: () => bidService.getMyBids(),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useWonBids = () => {
  return useQuery({
    queryKey: ["wonBids"],
    queryFn: () => bidService.getWonBids(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWonBidsCheckout = () => {
  return useQuery({
    queryKey: ["wonBidsCheckout"],
    queryFn: () => bidService.getWonBidsCheckout(),
    staleTime: 0, // Always fresh for checkout
  });
};
