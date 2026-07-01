import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";

// Query key factory
export const categoryKeys = {
  all: ["categories"] as const,
  list: (withSubcategories: boolean) =>
    [...categoryKeys.all, "list", withSubcategories] as const,
};

/**
 * Category reference data (with subcategories). Cached long — this list is
 * effectively static, so it's shared across the Agent AddToStore picker and
 * the Buyer header/filters without refetching.
 */
export const useCategories = (withSubcategories = true) => {
  return useQuery({
    queryKey: categoryKeys.list(withSubcategories),
    queryFn: () => CategoryService.getCategories(withSubcategories),
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: { response?: { status?: number } }) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
};
