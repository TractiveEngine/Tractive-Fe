import api from "@/lib/axios";

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

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    const response = await api.get("/api/notifications");
    const payload = response.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.notifications)) {
      return payload.data.notifications;
    }
    if (Array.isArray(payload?.notifications)) return payload.notifications;
    return [];
  },

  async markAllRead(): Promise<void> {
    await api.patch("/api/notifications", { isRead: true });
  },
};
