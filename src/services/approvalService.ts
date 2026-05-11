import api from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";
import { AgentsProps, TransportersProps } from "@/utils/Approvals";

export type ApprovalDecision = "approved" | "rejected";

export interface ApprovalQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  state?: string;
  year?: string;
  month?: string;
}

export interface ApprovalListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface ApiAgent {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  fullname?: string;
  email?: string;
  avatar?: string;
  image?: string;
  state?: string;
  address?: string;
  location?: string;
  profession?: string;
  activeRole?: string;
  phone?: string;
  mobile?: string;
  nin?: string;
  NIN?: string;
  createdAt?: string;
  date?: string;
  [key: string]: unknown;
}

interface ApiTransporter {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  fullname?: string;
  email?: string;
  avatar?: string;
  image?: string;
  state?: string;
  address?: string;
  location?: string;
  profession?: string;
  activeRole?: string;
  phone?: string;
  mobile?: string;
  vehicleType?: string;
  vehicle?: string;
  plateNumber?: string;
  licenseNumber?: string;
  createdAt?: string;
  date?: string;
  [key: string]: unknown;
}

const formatDate = (raw?: string): string => {
  if (!raw) return "-";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toISOString().split("T")[0];
};

const mapApiAgent = (a: ApiAgent): AgentsProps => ({
  id: (a._id as string) || (a.id as string) || "",
  fullname: a.fullName || a.fullname || a.name || "—",
  email: a.email || "—",
  image: a.avatar || a.image || "/images/TopAgent.png",
  location: a.state || a.location || a.address || "—",
  profession: a.profession || a.activeRole || "Agent",
  mobile: a.phone || a.mobile || "—",
  NIN: a.nin || a.NIN || "—",
  date: formatDate(a.createdAt || a.date),
  checked: false,
});

const mapApiTransporter = (t: ApiTransporter): TransportersProps => ({
  id: (t._id as string) || (t.id as string) || "",
  fullname: t.fullName || t.fullname || t.name || "—",
  email: t.email || "—",
  image: t.avatar || t.image || "/images/TopAgent.png",
  location: t.state || t.location || t.address || "—",
  profession: t.profession || t.activeRole || "Transporter",
  mobile: t.phone || t.mobile || "—",
  vehicleType: t.vehicleType || t.vehicle || "—",
  plateNumber: t.plateNumber || t.licenseNumber || "—",
  date: formatDate(t.createdAt || t.date),
  checked: false,
});

const extractList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  const obj = payload as { data?: T[]; results?: T[]; items?: T[] } | undefined;
  return obj?.data ?? obj?.results ?? obj?.items ?? [];
};

const extractPagination = (
  payload: unknown,
  fallback: { page: number; limit: number; total: number },
) => {
  const obj = payload as
    | { pagination?: { page?: number; limit?: number; total?: number }; total?: number; page?: number; limit?: number }
    | undefined;
  const p = obj?.pagination;
  return {
    page: p?.page ?? obj?.page ?? fallback.page,
    limit: p?.limit ?? obj?.limit ?? fallback.limit,
    total: p?.total ?? obj?.total ?? fallback.total,
  };
};

const handleError = (error: unknown, operation: string): never => {
  console.error(`❌ Error ${operation}:`, error);
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    if (status === 401) {
      toast.error("Authentication failed. Please log in again.");
    } else if (status === 403) {
      toast.error("You don't have permission for this action.");
    } else {
      toast.error(message || `Failed to ${operation}`);
    }
    throw new Error(message || `Failed to ${operation}`);
  }
  toast.error(`Failed to ${operation}`);
  throw error instanceof Error ? error : new Error(`Failed to ${operation}`);
};

export const approvalService = {
  // GET /api/admin/approvals/agents
  getPendingAgents: async (
    params: ApprovalQueryParams = {},
  ): Promise<ApprovalListResponse<AgentsProps>> => {
    try {
      const response = await api.get("/api/admin/approvals/agents", {
        params: {
          ...(params.search ? { search: params.search } : {}),
          ...(params.state ? { state: params.state } : {}),
          ...(params.year ? { year: params.year } : {}),
          ...(params.month ? { month: params.month } : {}),
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      });
      const list = extractList<ApiAgent>(response.data);
      return {
        data: list.map(mapApiAgent),
        pagination: extractPagination(response.data, {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          total: list.length,
        }),
      };
    } catch (error) {
      return handleError(error, "fetch pending agents");
    }
  },

  // PATCH /api/admin/approvals/agents/{id}
  updateAgentApproval: async (
    id: string,
    payload: { status: ApprovalDecision; reason: string },
  ): Promise<void> => {
    try {
      await api.patch(`/api/admin/approvals/agents/${id}`, payload);
    } catch (error) {
      return handleError(error, "update agent approval");
    }
  },

  // GET /api/admin/approvals/transporters
  getPendingTransporters: async (
    params: ApprovalQueryParams = {},
  ): Promise<ApprovalListResponse<TransportersProps>> => {
    try {
      const response = await api.get("/api/admin/approvals/transporters", {
        params: {
          ...(params.search ? { search: params.search } : {}),
          ...(params.state ? { state: params.state } : {}),
          ...(params.year ? { year: params.year } : {}),
          ...(params.month ? { month: params.month } : {}),
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      });
      const list = extractList<ApiTransporter>(response.data);
      return {
        data: list.map(mapApiTransporter),
        pagination: extractPagination(response.data, {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          total: list.length,
        }),
      };
    } catch (error) {
      return handleError(error, "fetch pending transporters");
    }
  },

  // PATCH /api/admin/approvals/transporters/{id}
  updateTransporterApproval: async (
    id: string,
    payload: { status: ApprovalDecision; reason: string },
  ): Promise<void> => {
    try {
      await api.patch(`/api/admin/approvals/transporters/${id}`, payload);
    } catch (error) {
      return handleError(error, "update transporter approval");
    }
  },

};
