import api from "@/lib/axios";
import axios from "axios";

/**
 * Admin dashboard analytics service.
 *
 * Wires the 5 dashboard widgets (A1–A5 in BACKEND_API_REQUIREMENTS.md) to the
 * real backend. Every type below mirrors the doc's "Must RETURN" shape, but the
 * parsing is intentionally tolerant: each call unwraps `{ data }` envelopes and
 * each numeric field is read through a fallback so a slightly different field
 * name from the backend (e.g. `revenue` vs `value`) degrades gracefully instead
 * of crashing the widget. Tighten these once the real responses are confirmed
 * from the browser Network tab.
 */

// ── A1: GET /api/admin/dashboard/overview ─────────────────────────────
export interface OverviewBlock {
  value: number;
  deltaPercent: number;
}

export interface AdminDashboardOverview {
  users: OverviewBlock;
  payments: OverviewBlock;
  orders: OverviewBlock;
  visitors: OverviewBlock;
}

// ── A2: GET /api/admin/dashboard/revenue ──────────────────────────────
export interface RevenuePoint {
  date: string;
  value: number;
}

export interface AdminRevenueParams {
  period?: "month" | "year";
  from?: string;
  to?: string;
}

// ── A3: GET /api/admin/dashboard/top-agents ───────────────────────────
export interface TopAgent {
  id: string;
  name: string;
  image: string;
  location: string;
  revenue: number;
  orders: number;
}

// ── A4: GET /api/admin/dashboard/top-buyers ───────────────────────────
export interface TopBuyer {
  id: string;
  name: string;
  image: string;
  totalSpent: number;
}

// ── A5: GET /api/admin/dashboard/top-transporters ─────────────────────
export interface TopTransporter {
  id: string;
  name: string;
  image: string;
  location: string;
  revenue: number;
  bookings: number;
}

const handleApiError = (error: unknown, operation: string): never => {
  console.error(`❌ Error ${operation}:`, error);
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Failed to ${operation}`);
};

// Unwrap `{ data: X }` | `{ data: { data: X } }` | bare `X`.
const unwrap = <T>(payload: unknown): T => {
  const root = payload as { data?: unknown };
  const inner = (root?.data ?? payload) as { data?: unknown };
  return (inner?.data ?? inner) as T;
};

const toNumber = (...candidates: unknown[]): number => {
  for (const c of candidates) {
    const n = typeof c === "string" ? Number(c.replace(/[^0-9.-]/g, "")) : c;
    if (typeof n === "number" && Number.isFinite(n)) return n;
  }
  return 0;
};

const pickString = (...candidates: unknown[]): string => {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  return "";
};

const normalizeBlock = (raw: unknown): OverviewBlock => {
  const b = (raw ?? {}) as Record<string, unknown>;
  return {
    value: toNumber(b.value, b.total, b.count, b.amount),
    deltaPercent: toNumber(b.deltaPercent, b.delta, b.changePercent, b.change),
  };
};

export const adminDashboardService = {
  // GET /api/admin/dashboard/overview
  getOverview: async (): Promise<AdminDashboardOverview> => {
    try {
      const res = await api.get("/api/admin/dashboard/overview");
      const raw = unwrap<Record<string, unknown>>(res.data) ?? {};
      return {
        users: normalizeBlock(raw.users),
        payments: normalizeBlock(raw.payments ?? raw.receivedPayments),
        orders: normalizeBlock(raw.orders),
        visitors: normalizeBlock(raw.visitors),
      };
    } catch (error) {
      return handleApiError(error, "fetch dashboard overview");
    }
  },

  // GET /api/admin/dashboard/revenue
  getRevenue: async (params: AdminRevenueParams = {}): Promise<RevenuePoint[]> => {
    try {
      const res = await api.get("/api/admin/dashboard/revenue", {
        params: {
          ...(params.period ? { period: params.period } : {}),
          ...(params.from ? { from: params.from } : {}),
          ...(params.to ? { to: params.to } : {}),
        },
      });
      const raw = unwrap<unknown>(res.data);
      const arr = Array.isArray(raw)
        ? raw
        : ((raw as { data?: unknown[] })?.data ?? []);
      return (arr as Record<string, unknown>[]).map((p) => ({
        date: pickString(p.date, p.label, p.month),
        value: toNumber(p.value, p.revenue, p.amount, p.total),
      }));
    } catch (error) {
      return handleApiError(error, "fetch revenue chart");
    }
  },

  // GET /api/admin/dashboard/top-agents
  getTopAgents: async (limit = 5): Promise<TopAgent[]> => {
    try {
      const res = await api.get("/api/admin/dashboard/top-agents", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data) ?? [];
      return (Array.isArray(arr) ? arr : []).map((a) => ({
        id: pickString(a.id, a._id),
        name: pickString(a.name, a.fullName, a.businessName),
        image: pickString(a.image, a.avatar, a.logoUrl),
        location: pickString(a.location, a.state),
        revenue: toNumber(a.revenue, a.totalRevenue, a.amount),
        orders: toNumber(a.orders, a.ordersCount, a.totalOrders),
      }));
    } catch (error) {
      return handleApiError(error, "fetch top agents");
    }
  },

  // GET /api/admin/dashboard/top-buyers
  getTopBuyers: async (limit = 7): Promise<TopBuyer[]> => {
    try {
      const res = await api.get("/api/admin/dashboard/top-buyers", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data) ?? [];
      return (Array.isArray(arr) ? arr : []).map((b) => ({
        id: pickString(b.id, b._id),
        name: pickString(b.name, b.fullName),
        image: pickString(b.image, b.avatar),
        totalSpent: toNumber(b.totalSpent, b.revenue, b.amount, b.total),
      }));
    } catch (error) {
      return handleApiError(error, "fetch top buyers");
    }
  },

  // GET /api/admin/dashboard/top-transporters
  getTopTransporters: async (limit = 5): Promise<TopTransporter[]> => {
    try {
      const res = await api.get("/api/admin/dashboard/top-transporters", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data) ?? [];
      return (Array.isArray(arr) ? arr : []).map((t) => ({
        id: pickString(t.id, t._id),
        name: pickString(t.name, t.fullName, t.businessName),
        image: pickString(t.image, t.avatar, t.logoUrl),
        location: pickString(t.location, t.state),
        revenue: toNumber(t.revenue, t.totalRevenue, t.amount),
        bookings: toNumber(t.bookings, t.bookingsCount, t.totalBookings),
      }));
    } catch (error) {
      return handleApiError(error, "fetch top transporters");
    }
  },
};
