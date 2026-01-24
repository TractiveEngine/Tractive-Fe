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
 * Hook to fetch single product details
 */
export const useProduct = (id: string | null) => {
  return useQuery({
    queryKey: productKeys.detail(id || ""),
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
              pagination: {
                page: 1,
                limit: 10,
                total: 1,
              },
              total: 1,
              page: 1,
              limit: 10,
            };
          }
          // Prepend new product
          const newTotal = oldData.total + 1;
          return {
            ...oldData,
            products: [newProduct, ...oldData.products],
            pagination: {
              ...oldData.pagination,
              total: newTotal,
            },
            total: newTotal,
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
 * Hook to update product details (Price & Quantity)
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Invalidate relevant queries to ensure consistency
      // Ideally we updates cache manually for perfect optimistic UI, but for edit details invalidation is often acceptable
      // However, let's try to update the cache for better UX
      const status = updatedProduct.status || "available";
      const listKey = productKeys.list({ status });

      queryClient.setQueryData(
        listKey,
        (oldData: ProductsResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            products: oldData.products.map((p) =>
              p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p,
            ),
          };
        },
      );

      toast.success("Product updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update product");
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
      status: "available" | "out_of_stock" | "discontinued";
    }) => productService.updateProductStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel queries to avoid overwrites
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      const targetStatus = status;

      // We need to find where the product currently is (available or out_of_stock)
      // We check all list queries
      const queries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: productKeys.lists(),
      });

      let movedProduct: ApiProduct | undefined;
      let previousDataMap = new Map(); // To store previous data for rollback

      queries.forEach(([queryKey, oldData]) => {
        if (!oldData) return;

        previousDataMap.set(queryKey, oldData);

        const productIndex = oldData.products.findIndex((p) => p.id === id);

        // If found in this list
        if (productIndex !== -1) {
          const product = oldData.products[productIndex];
          movedProduct = { ...product, status: targetStatus };

          const newTotal = Math.max(0, oldData.total - 1);

          // Remove from this list (it's moving)
          queryClient.setQueryData(queryKey, {
            ...oldData,
            products: oldData.products.filter((p) => p.id !== id),
            pagination: {
              ...oldData.pagination,
              total: newTotal,
            },
            total: newTotal,
          });
        }
      });

      // If we found the product and we have a target list loaded, add it there
      if (movedProduct) {
        // We only add to a list if we have a specific query for that status key
        // e.g., if we are moving to 'discontinued', we might not show that list, so we don't add it anywhere.
        const targetListKey = productKeys.list({ status: targetStatus });
        const targetListData =
          queryClient.getQueryData<ProductsResponse>(targetListKey);

        if (targetListData) {
          const newTotal = targetListData.total + 1;
          queryClient.setQueryData(targetListKey, {
            ...targetListData,
            products: [movedProduct, ...targetListData.products],
            pagination: {
              ...targetListData.pagination,
              total: newTotal,
            },
            total: newTotal,
          });
        }
      }

      return { previousDataMap };
    },
    onError: (err, newTodo, context) => {
      // Rollback
      if (context?.previousDataMap) {
        context.previousDataMap.forEach((data, key) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error("Failed to update status");
    },
    onSuccess: () => {
      // We still invalidate to ensure ultimate consistency
      // queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to delete product (optimistic)
 * Uses POST /api/products/bulk/delete with single ID as per requirements
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteMultipleProducts([id]),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      const queries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: productKeys.lists(),
      });

      queries.forEach(([key, oldData]) => {
        if (oldData) {
          const newTotal = Math.max(0, oldData.total - 1);
          queryClient.setQueryData(key, {
            ...oldData,
            products: oldData.products.filter((p) => p.id !== id),
            pagination: {
              ...oldData.pagination,
              total: newTotal,
            },
            total: newTotal,
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
      // Ideally no refetch needed if optimistic update worked
      // queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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
          const countToRemove = oldData.products.filter((p) =>
            ids.includes(p.id),
          ).length;
          const newTotal = Math.max(0, oldData.total - countToRemove); // Better accuracy than just substracting ids.length if not all are here
          queryClient.setQueryData(key, {
            ...oldData,
            products: oldData.products.filter((p) => !ids.includes(p.id)),
            pagination: {
              ...oldData.pagination,
              total: newTotal,
            },
            total: newTotal,
          });
        }
      });
      return { queries };
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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
      status: "available" | "out_of_stock" | "discontinued";
    }) => productService.updateMultipleProductsStatus(ids, status),
    onSuccess: (data, variables) => {
      // Since we don't know exactly which items moved where without complex logic,
      // invalidation is the safest bet for bulk actions.
      // However, we can improve this if needed.
      // For now, strict 'Insert into correct table' implies we should try to refresh or move.
      // Given complexity of bulk move, refetch is safest for correctness,
      // BUT Requirement says "❌ Do NOT refetch /api/products after mutations".

      // So we must optimistically update.

      const { ids, status: targetStatus } = variables;

      const queries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: productKeys.lists(),
      });

      let movedProducts: ApiProduct[] = [];

      // 1. Remove from all method lists & collect moved items
      queries.forEach(([key, oldData]) => {
        if (!oldData) return;

        const found = oldData.products.filter((p) => ids.includes(p.id));
        if (found.length > 0) {
          // Track found items, update their status
          found.forEach((p) => {
            // De-duplicate if needed, though usually an item is in one list
            if (!movedProducts.find((mp) => mp.id === p.id)) {
              movedProducts.push({ ...p, status: targetStatus });
            }
          });

          const newTotal = Math.max(0, oldData.total - found.length);

          // Remove from list
          queryClient.setQueryData(key, {
            ...oldData,
            products: oldData.products.filter((p) => !ids.includes(p.id)),
            pagination: {
              ...oldData.pagination,
              total: newTotal,
            },
            total: newTotal,
          });
        }
      });

      // 2. Add to target list if exists
      const targetKey = productKeys.list({ status: targetStatus });
      const targetData = queryClient.getQueryData<ProductsResponse>(targetKey);

      if (targetData) {
        const newTotal = targetData.total + movedProducts.length;
        queryClient.setQueryData(targetKey, {
          ...targetData,
          products: [...movedProducts, ...targetData.products],
          pagination: {
            ...targetData.pagination,
            total: newTotal,
          },
          total: newTotal,
        });
      }

      toast.success("Products updated successfully");
    },
    onError: () => toast.error("Failed to update products"),
  });
};
