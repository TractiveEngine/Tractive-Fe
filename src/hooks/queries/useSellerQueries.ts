import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSellers, getSellerById, getSellerProducts, getSellerReviews, likeReview, GetSellersParams, GetSellerProductsParams } from "@/utils/sellerApi";
import { toast } from "sonner";

export const useGetSellers = (params?: GetSellersParams) => {
    return useQuery({
        queryKey: ["sellers", params],
        queryFn: () => getSellers(params),
    });
};

export const useGetSeller = (id: string) => {
    return useQuery({
        queryKey: ["seller", id],
        queryFn: () => getSellerById(id),
        enabled: !!id,
    });
};

export const useGetSellerProducts = (id: string, params?: GetSellerProductsParams) => {
    return useQuery({
        queryKey: ["sellerProducts", id, params],
        queryFn: () => getSellerProducts(id, params),
        enabled: !!id,
    });
};

export const useGetSellerReviews = (id: string) => {
    return useQuery({
        queryKey: ["sellerReviews", id],
        queryFn: () => getSellerReviews(id),
        enabled: !!id,
    });
};

export const useLikeReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reviewId: string) => likeReview(reviewId),
        onSuccess: () => {
             toast.success("Review liked");
             queryClient.invalidateQueries({ queryKey: ["sellerReviews"] });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
             const message = error?.response?.data?.message || "Failed to like review";
             toast.error(message);
        }
    })
};
