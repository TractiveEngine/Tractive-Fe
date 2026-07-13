import { getSession } from "next-auth/react";
import api from "@/lib/axios";
import { API_BASE_URL } from "@/lib/config";
import { tokenManager } from "@/lib/tokenManager";

export interface AppNotification {
  _id: string;
  title?: string;
  message: string;
  type?: string;
  isRead: boolean;
  link?: string;
  image?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetNotificationsParams {
  unread?: boolean;
  page?: number;
  limit?: number;
}

export interface GetNotificationsResult {
  notifications: AppNotification[];
  unreadCount: number;
  pagination?: NotificationPagination;
}

/**
 * Pull the notification array out of the response envelope. The backend sends
 * `{ success, data: [...], notifications: [...], unreadCount, pagination }`,
 * but we tolerate a bare array or a nested `data.notifications` too.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractList = (payload: any): AppNotification[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.notifications)) {
    return payload.data.notifications;
  }
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
};

/**
 * Same memory-first, session-fallback lookup the axios request interceptor
 * does. Needed separately because EventSource cannot send an Authorization
 * header, so the stream carries the token as a query param instead.
 */
const resolveAccessToken = async (): Promise<string | null> => {
  let token = tokenManager.getToken();
  if (!token) {
    const session = await getSession();
    token = session?.accessToken || session?.user?.token || null;
    if (token) tokenManager.setToken(token);
  }
  return token;
};

export const notificationService = {
  /**
   * URL for the live SSE feed: GET /api/notifications/stream?token=<jwt>
   * Returns null when there is no token — the caller stays on polling.
   */
  async getStreamUrl(): Promise<string | null> {
    const token = await resolveAccessToken();
    if (!token) return null;
    return `${API_BASE_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`;
  },

  /**
   * GET /api/notifications?unread&page&limit
   * Returns the list plus the server-side unread count and pagination.
   */
  async getNotifications(
    params?: GetNotificationsParams,
  ): Promise<GetNotificationsResult> {
    const query: Record<string, unknown> = {};
    if (params?.unread) query.unread = true;
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;

    const response = await api.get("/api/notifications", {
      params: Object.keys(query).length ? query : undefined,
    });
    const body = response.data;
    const notifications = extractList(body);
    const unreadCount =
      typeof body?.unreadCount === "number"
        ? body.unreadCount
        : typeof body?.data?.unreadCount === "number"
          ? body.data.unreadCount
          : notifications.filter((n) => !n.isRead).length;
    const pagination = body?.pagination ?? body?.data?.pagination;
    return { notifications, unreadCount, pagination };
  },

  /**
   * Authoritative unread badge count (independent of the paged list).
   * GET /api/notifications/unread/count → { count }
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get("/api/notifications/unread/count");
    const body = response.data;
    return body?.count ?? body?.data?.count ?? body?.unreadCount ?? 0;
  },

  /**
   * Mark a single notification as read.
   * PATCH /api/notifications/{id} · body { isRead: true }
   */
  async markAsRead(id: string): Promise<void> {
    await api.patch(`/api/notifications/${id}`, { isRead: true });
  },

  /**
   * Mark every notification as read.
   * PATCH /api/notifications · body { isRead: true }
   */
  async markAllRead(): Promise<void> {
    await api.patch("/api/notifications", { isRead: true });
  },
};
