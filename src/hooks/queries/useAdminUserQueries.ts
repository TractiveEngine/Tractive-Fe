import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminUserService,
  AdminUserHistoryParams,
  AdminUserHistoryResponse,
  AdminUserSummary,
} from "@/services/adminUserService";

export const adminUserSummaryKey = (id: string | undefined) =>
  ["admin-user", id] as const;

export const adminUserHistoryKey = (
  id: string | undefined,
  params: AdminUserHistoryParams,
) =>
  [
    "admin-user-history",
    id,
    params.role,
    params.resource,
    params.page ?? 1,
    params.limit ?? 10,
  ] as const;

export const useAdminUserSummary = (id: string | undefined) =>
  useQuery<AdminUserSummary>({
    queryKey: adminUserSummaryKey(id),
    queryFn: () => adminUserService.getUserSummary(id as string),
    enabled: Boolean(id),
  });

export const useAdminUserHistory = (
  id: string | undefined,
  params: AdminUserHistoryParams,
) =>
  useQuery<AdminUserHistoryResponse>({
    queryKey: adminUserHistoryKey(id, params),
    queryFn: () => adminUserService.getUserHistory(id as string, params),
    enabled: Boolean(id),
    placeholderData: (prev) => prev,
  });

export const useInvalidateAdminUser = () => {
  const queryClient = useQueryClient();
  return (id: string | undefined) => {
    queryClient.invalidateQueries({ queryKey: adminUserSummaryKey(id) });
    queryClient.invalidateQueries({ queryKey: ["admin-user-history", id] });
  };
};
