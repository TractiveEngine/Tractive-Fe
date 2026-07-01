import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  notificationService,
  type GetNotificationsParams,
} from "@/services/notificationService";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: GetNotificationsParams) =>
    [...notificationKeys.all, "list", params ?? {}] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export const useNotifications = (
  enabled: boolean = true,
  params?: GetNotificationsParams,
) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getNotifications(params),
    enabled,
    staleTime: 60 * 1000,
    refetchInterval: enabled ? 60 * 1000 : false,
    refetchOnWindowFocus: true,
  });
};

/**
 * Authoritative unread badge count (not limited by the paged list).
 */
export const useUnreadNotificationCount = (enabled: boolean = true) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    staleTime: 60 * 1000,
    refetchInterval: enabled ? 60 * 1000 : false,
    refetchOnWindowFocus: true,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
