import api from "@/lib/axios";
import axios from "axios";

export type AdminProfession = "buyer" | "agent" | "transporter" | "admin";
export type AdminUserStatus = "active" | "suspended" | "removed";

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
  agentApprovalStatus?: boolean;
  transporterApprovalStatus?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Allow unknown backend fields until the exact return shape is confirmed.
  [key: string]: unknown;
}

export interface AdminUserListParams {
  profession?: AdminProfession;
  status?: AdminUserStatus;
  search?: string;
  page?: number;
  limit?: number;
  agentApprovalStatus?: boolean;
  transporterApprovalStatus?: boolean;
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
          ...(typeof params.agentApprovalStatus === "boolean"
            ? { agentApprovalStatus: params.agentApprovalStatus }
            : {}),
          ...(typeof params.transporterApprovalStatus === "boolean"
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
