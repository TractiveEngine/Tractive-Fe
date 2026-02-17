import { useQuery } from "@tanstack/react-query";
import { getSellers, getSellerById, getSellerProducts } from "@/utils/sellerApi";

export const useGetSellers = () => {
    return useQuery({
        queryKey: ["sellers"],
        queryFn: getSellers,
    });
};

export const useGetSeller = (id: string) => {
    return useQuery({
        queryKey: ["seller", id],
        queryFn: () => getSellerById(id),
        enabled: !!id,
    });
};

export const useGetSellerProducts = (id: string) => {
    return useQuery({
        queryKey: ["sellerProducts", id],
        queryFn: () => getSellerProducts(id),
        enabled: !!id,
    });
};
