import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productService,
  CreateProductData,
  ApiProduct,
  ProductsResponse,
} from "@/services/productService";
import { toast } from "sonner";

// Query key factory for products
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Hook to fetch all products
 */
export const useProducts = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to create a new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => productService.createProduct(data),
    onSuccess: (newProduct) => {
      // Manually update the list cache to include the new product immediately
      // This avoids a redundant GET /api/product call
      queryClient.setQueryData(
        productKeys.list({}),
        (oldData: ProductsResponse | undefined) => {
          if (!oldData) {
            return {
              products: [newProduct],
              total: 1,
              page: 1,
              limit: 10,
            };
          }
          return {
            ...oldData,
            products: [newProduct, ...oldData.products],
            total: oldData.total + 1,
          };
        },
      );
      toast.success("Product uploaded successfully!");
    },
    onError: (error: any) => {
      // Error handling is mostly done int he service but we can add extra here if needed
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create product";
      // Toast handled in service or component, but good to ensure
      if (!toast.dismiss) {
        // Check if toast is available/active preventing dups if service does it
        toast.error(message);
      }
    },
  });
};
