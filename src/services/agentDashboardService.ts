import api from "@/lib/axios";
import axios from "axios";

/**
 * Agent (a.k.a. "Farmer") dashboard analytics service.
 *
 * Wires the 6 dashboard widgets (G1–G6 in BACKEND_API_REQUIREMENTS.md) to the
 * real backend. The agent is inferred from the auth token, so none of these
 * calls take an agentId. Parsing mirrors `adminDashboardService` and is
 * intentionally tolerant: every call unwraps `{ data }` envelopes and reads
 * each field through a fallback list, so a slightly different field name from
 * the backend (e.g. `revenue` vs `value`) degrades gracefully instead of
 * crashing the widget. Tighten these once the real responses are confirmed
 * from the browser Network tab.
 */

// ── G1: GET /api/agents/dashboard/overview ────────────────────────────
export interface OverviewBlock {
  value: number;
  deltaPercent: number;
}

export interface AgentDashboardOverview {
  revenue: OverviewBlock;
  customers: OverviewBlock;
  orders: OverviewBlock;
  products: OverviewBlock;
}

// ── G2: GET /api/agents/dashboard/revenue ─────────────────────────────
export interface RevenuePoint {
  date: string;
  value: number;
}

export interface AgentRevenueParams {
  from?: string;
  to?: string;
  granularity?: "day" | "month" | "year";
}

// ── G3: GET /api/agents/dashboard/top-customers ───────────────────────
export interface TopCustomer {
  id: string;
  name: string;
  image: string;
  location: string;
  ordersCount: number;
  revenue: number;
}

// ── G4: GET /api/agents/dashboard/out-of-stock ────────────────────────
export interface OutOfStockProduct {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface RestockPayload {
  quantity: number;
  restockDate?: string;
}

// ── G5: GET /api/agents/dashboard/most-sold-items ─────────────────────
export interface MostSoldItem {
  productId: string;
  name: string;
  description: string;
  image: string;
  quantitySold: number;
  revenue: number;
}

// ── G6: GET /api/agents/dashboard/most-sold-categories ────────────────
export interface MostSoldCategory {
  category: string;
  percentage: number;
  value: number;
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

const asArray = (raw: unknown): Record<string, unknown>[] => {
  const arr = Array.isArray(raw)
    ? raw
    : ((raw as { data?: unknown[] })?.data ?? []);
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
};

// Read one overview card. Backend may send either a nested block
// (`{ value, deltaPercent }`) or a flat number with deltas in a parallel
// `deltas` object — handle both so the cards never blank out.
const normalizeBlock = (
  root: Record<string, unknown>,
  ...keys: string[]
): OverviewBlock => {
  const deltas = (root.deltas ?? {}) as Record<string, unknown>;
  for (const key of keys) {
    const raw = root[key];
    if (raw && typeof raw === "object") {
      const b = raw as Record<string, unknown>;
      return {
        value: toNumber(b.value, b.total, b.count, b.amount),
        deltaPercent: toNumber(
          b.deltaPercent,
          b.delta,
          b.changePercent,
          b.change,
        ),
      };
    }
    if (raw !== undefined) {
      return {
        value: toNumber(raw),
        deltaPercent: toNumber(deltas[key]),
      };
    }
  }
  return { value: 0, deltaPercent: 0 };
};

export const agentDashboardService = {
  // GET /api/agents/dashboard/overview
  getOverview: async (): Promise<AgentDashboardOverview> => {
    try {
      const res = await api.get("/api/agents/dashboard/overview");
      const raw = unwrap<Record<string, unknown>>(res.data) ?? {};
      return {
        revenue: normalizeBlock(raw, "revenue", "totalRevenue", "payments"),
        customers: normalizeBlock(raw, "customers", "totalCustomers"),
        orders: normalizeBlock(raw, "orders", "totalOrders"),
        products: normalizeBlock(raw, "products", "totalProducts"),
      };
    } catch (error) {
      return handleApiError(error, "fetch dashboard overview");
    }
  },

  // GET /api/agents/dashboard/revenue
  getRevenue: async (params: AgentRevenueParams = {}): Promise<RevenuePoint[]> => {
    try {
      const res = await api.get("/api/agents/dashboard/revenue", {
        params: {
          ...(params.from ? { from: params.from } : {}),
          ...(params.to ? { to: params.to } : {}),
          ...(params.granularity ? { granularity: params.granularity } : {}),
        },
      });
      const raw = unwrap<unknown>(res.data);
      return asArray(raw).map((p) => ({
        date: pickString(p.date, p.label, p.month),
        value: toNumber(p.value, p.revenue, p.amount, p.total),
      }));
    } catch (error) {
      return handleApiError(error, "fetch revenue chart");
    }
  },

  // GET /api/agents/dashboard/top-customers
  getTopCustomers: async (limit = 5): Promise<TopCustomer[]> => {
    try {
      const res = await api.get("/api/agents/dashboard/top-customers", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data);
      return asArray(arr).map((c) => ({
        id: pickString(c.id, c._id),
        name: pickString(c.name, c.fullName),
        image: pickString(c.image, c.avatar),
        location: pickString(c.location, c.state),
        ordersCount: toNumber(c.ordersCount, c.orders, c.totalOrders),
        revenue: toNumber(c.revenue, c.totalSpent, c.amount),
      }));
    } catch (error) {
      return handleApiError(error, "fetch top customers");
    }
  },

  // GET /api/agents/dashboard/out-of-stock
  getOutOfStock: async (limit = 7): Promise<OutOfStockProduct[]> => {
    try {
      const res = await api.get("/api/agents/dashboard/out-of-stock", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data);
      return asArray(arr).map((p) => ({
        id: pickString(p.id, p._id, p.productId),
        name: pickString(p.name, p.title, p.productName),
        description: pickString(p.description, p.desc),
        image: pickString(p.image, p.imageUrl, p.thumbnail),
      }));
    } catch (error) {
      return handleApiError(error, "fetch out-of-stock products");
    }
  },

  // GET /api/agents/dashboard/most-sold-items
  getMostSoldItems: async (limit = 4): Promise<MostSoldItem[]> => {
    try {
      const res = await api.get("/api/agents/dashboard/most-sold-items", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data);
      return asArray(arr).map((p) => ({
        productId: pickString(p.productId, p.id, p._id),
        name: pickString(p.name, p.title, p.productName),
        description: pickString(p.description, p.desc),
        image: pickString(p.image, p.imageUrl, p.thumbnail),
        quantitySold: toNumber(p.quantitySold, p.orders, p.sold, p.quantity),
        revenue: toNumber(p.revenue, p.amount, p.total),
      }));
    } catch (error) {
      return handleApiError(error, "fetch most-sold items");
    }
  },

  // GET /api/agents/dashboard/most-sold-categories
  getMostSoldCategories: async (): Promise<MostSoldCategory[]> => {
    try {
      const res = await api.get("/api/agents/dashboard/most-sold-categories");
      const arr = unwrap<Record<string, unknown>[]>(res.data);
      return asArray(arr).map((c) => ({
        category: pickString(c.category, c.name, c.label),
        percentage: toNumber(c.percentage, c.percent),
        value: toNumber(c.value, c.count, c.total, c.revenue),
      }));
    } catch (error) {
      return handleApiError(error, "fetch most-sold categories");
    }
  },

  // POST /api/agents/products/{productId}/restock
  restockProduct: async (
    productId: string,
    payload: RestockPayload,
  ): Promise<void> => {
    try {
      await api.post(`/api/agents/products/${productId}/restock`, payload);
    } catch (error) {
      handleApiError(error, "restock product");
    }
  },
};
