import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productService,
  CreateProductData,
  UpdateProductData,
  ApiProduct,
  ProductsResponse,
  SearchFilters,
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
 * Intelligently routes to /api/products/out-of-stock if status is 'out_of_stock'
 * otherwise uses standard /api/products
 */
export const useProducts = (filters: SearchFilters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters as Record<string, unknown>),
    queryFn: () => {
      // If asking specifically for out_of_stock, use the dedicated endpoint
      if (filters.status === "out_of_stock") {
        // Create a copy of filters but remove 'status' as the endpoint implies it
        const { status, ...rest } = filters;
        return productService.getOutOfStockProducts(rest);
      }
      return productService.getProducts(filters);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData: any) => previousData,
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
      // Optimistically update the "available" list
      queryClient.setQueryData(
        productKeys.list({ status: "available" }),
        (oldData: ProductsResponse | undefined) => {
          if (!oldData) {
            return {
              products: [newProduct],
              total: 1,
              page: 1,
              limit: 10,
            };
          }
          // Prepend new product
          return {
            ...oldData,
            products: [newProduct, ...oldData.products],
            total: oldData.total + 1,
          };
        },
      );

      // Also invalidate general lists just in case
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      toast.success("Product uploaded successfully!");
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to create product";
      toast.error(message);
    },
  });
};

/**
 * Hook to update product status (optimistic)
 */
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "available" | "out_of_stock";
    }) => productService.updateProductStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel queries to avoid overwrites
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      // We need to move the item from one list to another or remove it from current
      // Ideally we invalidate, but for optimistic UI we can try to update

      // Since changing status likely moves it between "available" and "out_of_stock" lists:
      const sourceStatus =
        status === "available" ? "out_of_stock" : "available";
      const targetStatus = status;

      // 1. Remove from source list
      const sourceKey = productKeys.list({ status: sourceStatus });
      const previousSourceData =
        queryClient.getQueryData<ProductsResponse>(sourceKey);

      if (previousSourceData) {
        queryClient.setQueryData(sourceKey, {
          ...previousSourceData,
          products: previousSourceData.products.filter((p) => p.id !== id),
          total: Math.max(0, previousSourceData.total - 1),
        });
      }

      // 2. Add to target list (if we had the full product object, but we might not have it all here)
      // Since we don't have the full product object easily without fetching, simple removal from source
      // and invalidation of target is safer, OR we can just invalidate both.
      // But user wants optimistic updates.
      // best approach: Invalidate both but assume success for UI feedback instantly if possible.

      return { previousSourceData };
    },
    onError: (err, newTodo, context) => {
      // Rollback
      if (context?.previousSourceData) {
        // reconstruct key hard to know exactly without passing filters,
        // so we rely on invalidation mostly for correctness if rollback needed
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      }
      toast.error("Failed to update status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to delete product (optimistic)
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      // Identify which list it might be in (we iterate generic cache or just invalidate)
      // For effective optimistic delete, we can try to remove from all active list queries

      // Snapshot all list queries
      const queries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: productKeys.lists(),
      });

      queries.forEach(([key, oldData]) => {
        if (oldData) {
          queryClient.setQueryData(key, {
            ...oldData,
            products: oldData.products.filter((p) => p.id !== id),
            total: Math.max(0, oldData.total - 1),
          });
        }
      });

      return { queries };
    },
    onError: (err, id, context) => {
      // Rollback
      context?.queries?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error("Failed to delete product");
    },
    onSuccess: () => {
      // Invalidate to ensure sync
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook for bulk delete
 */
export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => productService.deleteMultipleProducts(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      const queries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: productKeys.lists(),
      });

      queries.forEach(([key, oldData]) => {
        if (oldData) {
          queryClient.setQueryData(key, {
            ...oldData,
            products: oldData.products.filter((p) => !ids.includes(p.id)),
            total: Math.max(0, oldData.total - ids.length), // approx
          });
        }
      });
      return { queries };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: () => toast.error("Failed to delete products"),
  });
};

/**
 * Hook for bulk status update
 */
export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: string[];
      status: "available" | "out_of_stock";
    }) => productService.updateMultipleProductsStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Products updated successfully");
    },
    onError: () => toast.error("Failed to update products"),
  });
};
