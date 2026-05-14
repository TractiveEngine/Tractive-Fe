import api from "@/lib/axios";
import axios from "axios";

export type AdminProfession = "buyer" | "agent" | "transporter" | "admin";
export type AdminUserStatus = "active" | "suspended" | "removed";
export type AdminApprovalStatus = "approved" | "rejected" | "pending";

export type HistoryRole = "buyer" | "agent" | "transporter";

export type HistoryResource =
  | "orders"
  | "transactions"
  | "transport-payments"
  | "sales"
  | "products"
  | "payments"
  | "trips";

export const HISTORY_RESOURCES_BY_ROLE: Record<HistoryRole, HistoryResource[]> = {
  buyer: ["orders", "transactions", "transport-payments"],
  agent: ["sales", "products"],
  transporter: ["orders", "payments", "trips"],
};

export const HISTORY_RESOURCE_LABELS: Record<HistoryResource, string> = {
  orders: "Orders",
  transactions: "Transactions",
  "transport-payments": "Transport Payments",
  sales: "Sales",
  products: "Products",
  payments: "Payments",
  trips: "Trips",
};

export interface AdminUser {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  businessName?: string;
  address?: string;
  state?: string;
  country?: string;
  profession?: AdminProfession | string;
  activeRole?: string;
  roles?: string[];
  status?: AdminUserStatus | string;
  agentApprovalStatus?: AdminApprovalStatus | string;
  transporterApprovalStatus?: AdminApprovalStatus | string;
  createdAt?: string;
  updatedAt?: string;
  // Allow unknown backend fields until the exact return shape is confirmed.
  [key: string]: unknown;
}

export type AdminUserHistoryItem = Record<string, unknown>;

// Per-role history block from GET /api/admin/users/{id}.
// Shape varies per role (e.g. agent has productsCount/salesCount/recentSales,
// buyer has ordersCount/recentOrders, transporter has tripsCount/recentTrips).
export type AdminUserRoleHistory = Record<string, unknown>;

// Maps each resource to the `recent<Camel>` key the backend returns inside
// the per-role history block.
export const RECENT_KEY_BY_RESOURCE: Record<HistoryResource, string> = {
  orders: "recentOrders",
  transactions: "recentTransactions",
  "transport-payments": "recentTransportPayments",
  sales: "recentSales",
  products: "recentProducts",
  payments: "recentPayments",
  trips: "recentTrips",
};

export interface AdminUserSummary extends AdminUser {
  image?: string;
  approvalStatus?: AdminApprovalStatus | string;
  approvalNotes?: string;
  history?: Partial<Record<HistoryRole, AdminUserRoleHistory | null>>;
}

export interface AdminUserHistoryParams {
  role: HistoryRole;
  resource: HistoryResource;
  page?: number;
  limit?: number;
}

export interface AdminUserHistoryResponse<
  T extends AdminUserHistoryItem = AdminUserHistoryItem,
> {
  data: T[];
  pagination: { page: number; limit: number; total: number };
}

export interface AdminUserListParams {
  profession?: AdminProfession;
  status?: AdminUserStatus;
  search?: string;
  page?: number;
  limit?: number;
  agentApprovalStatus?: AdminApprovalStatus;
  transporterApprovalStatus?: AdminApprovalStatus;
}

export interface AdminUserListResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AdminUserStats {
  total?: number;
  byProfession?: Partial<Record<AdminProfession, number>>;
  byStatus?: Partial<Record<AdminUserStatus, number>>;
  [key: string]: unknown;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  status?: AdminUserStatus;
  profession?: AdminProfession;
  [key: string]: unknown;
}

const handleApiError = (error: unknown, operation: string): never => {
  console.error(`❌ Error ${operation}:`, error);
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Failed to ${operation}`);
};

export const adminUserService = {
  // GET /api/admin/users
  getUsers: async (
    params: AdminUserListParams = {},
  ): Promise<AdminUserListResponse> => {
    try {
      const response = await api.get("/api/admin/users", {
        params: {
          ...(params.profession ? { profession: params.profession } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.agentApprovalStatus
            ? { agentApprovalStatus: params.agentApprovalStatus }
            : {}),
          ...(params.transporterApprovalStatus
            ? { transporterApprovalStatus: params.transporterApprovalStatus }
            : {}),
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      });
      const data: AdminUser[] = response.data?.data ?? [];
      return {
        data,
        pagination: response.data?.pagination ?? {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          total: data.length,
        },
      };
    } catch (error) {
      return handleApiError(error, "fetch users");
    }
  },

  // GET /api/admin/users/{id}
  getUserById: async (id: string): Promise<AdminUser> => {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      return handleApiError(error, "fetch user");
    }
  },

  // GET /api/admin/users/{id}
  // Same endpoint, typed for the consolidated detail view (summary + counts + recent items).
  getUserSummary: async (id: string): Promise<AdminUserSummary> => {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      return (response.data?.data ?? response.data) as AdminUserSummary;
    } catch (error) {
      return handleApiError(error, "fetch user summary");
    }
  },

  // GET /api/admin/users/{id}/history
  getUserHistory: async (
    id: string,
    { role, resource, page = 1, limit = 10 }: AdminUserHistoryParams,
  ): Promise<AdminUserHistoryResponse> => {
    try {
      const response = await api.get(`/api/admin/users/${id}/history`, {
        params: { role, resource, page, limit },
      });
      const data: AdminUserHistoryItem[] = response.data?.data ?? [];
      return {
        data,
        pagination: response.data?.pagination ?? {
          page,
          limit,
          total: data.length,
        },
      };
    } catch (error) {
      return handleApiError(error, "fetch user history");
    }
  },

  // PATCH /api/admin/users/{id}
  updateUser: async (
    id: string,
    payload: UpdateAdminUserPayload,
  ): Promise<AdminUser> => {
    try {
      const response = await api.patch(`/api/admin/users/${id}`, payload);
      return response.data?.data ?? response.data;
    } catch (error) {
      return handleApiError(error, "update user");
    }
  },

  // PATCH /api/admin/users/{id}/status
  updateUserStatus: async (
    id: string,
    status: AdminUserStatus,
  ): Promise<AdminUser> => {
    try {
      const response = await api.patch(`/api/admin/users/${id}/status`, {
        status,
      });
      return response.data?.data ?? response.data;
    } catch (error) {
      return handleApiError(error, "update user status");
    }
  },

  // POST /api/admin/users/{id}/reactivate
  reactivateUser: async (id: string): Promise<AdminUser> => {
    try {
      const response = await api.post(`/api/admin/users/${id}/reactivate`);
      return response.data?.data ?? response.data;
    } catch (error) {
      return handleApiError(error, "reactivate user");
    }
  },

  // PATCH /api/admin/users/status (bulk)
  bulkUpdateUserStatus: async (payload: {
    userIds: string[];
    status: AdminUserStatus;
  }): Promise<void> => {
    try {
      await api.patch("/api/admin/users/status", payload);
    } catch (error) {
      return handleApiError(error, "bulk update user status");
    }
  },

  // POST /api/admin/users/reactivate (bulk)
  bulkReactivateUsers: async (payload: {
    userIds: string[];
  }): Promise<void> => {
    try {
      await api.post("/api/admin/users/reactivate", payload);
    } catch (error) {
      return handleApiError(error, "bulk reactivate users");
    }
  },

  // PATCH /api/admin/users/remove (bulk)
  bulkRemoveUsers: async (payload: { userIds: string[] }): Promise<void> => {
    try {
      await api.patch("/api/admin/users/remove", {
        ...payload,
        status: "removed",
      });
    } catch (error) {
      return handleApiError(error, "bulk remove users");
    }
  },

  // GET /api/admin/users/removed
  getRemovedUsers: async (
    params: Omit<AdminUserListParams, "status"> = {},
  ): Promise<AdminUserListResponse> => {
    try {
      const response = await api.get("/api/admin/users/removed", {
        params: {
          ...(params.profession ? { profession: params.profession } : {}),
          ...(params.search ? { search: params.search } : {}),
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      });
      const data: AdminUser[] = response.data?.data ?? [];
      return {
        data,
        pagination: response.data?.pagination ?? {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          total: data.length,
        },
      };
    } catch (error) {
      return handleApiError(error, "fetch removed users");
    }
  },

  // GET /api/admin/users/stats
  getUserStats: async (): Promise<AdminUserStats> => {
    try {
      const response = await api.get("/api/admin/users/stats");
      return response.data?.data ?? response.data ?? {};
    } catch (error) {
      return handleApiError(error, "fetch user stats");
    }
  },
};
