import api from "@/lib/axios";
import axios from "axios";

/**
 * Transporter dashboard analytics service.
 *
 * Wires the 5 dashboard widgets (T1–T5 in BACKEND_API_REQUIREMENTS.md) to the
 * real backend. The transporter is inferred from the auth token, so none of
 * these calls take an id. Parsing mirrors `agentDashboardService` /
 * `adminDashboardService` and is intentionally tolerant: every call unwraps
 * `{ data }` envelopes and reads each field through a fallback list, so a
 * slightly different field name from the backend degrades gracefully instead
 * of crashing the widget. Tighten these once the real responses are confirmed
 * from the browser Network tab.
 */

// ── T1: GET /api/transporters/dashboard/overview ──────────────────────
export interface OverviewBlock {
  value: number;
  deltaPercent: number;
}

export interface TransporterDashboardOverview {
  revenue: OverviewBlock;
  customers: OverviewBlock;
  fleets: OverviewBlock;
  drivers: OverviewBlock;
}

// ── T2: GET /api/transporters/dashboard/revenue ───────────────────────
export interface RevenuePoint {
  date: string;
  value: number;
}

export interface TransporterRevenueParams {
  from?: string;
  to?: string;
  granularity?: "day" | "month" | "year";
}

// ── T3: GET /api/transporters/dashboard/most-hired-drivers ────────────
export interface MostHiredDriver {
  id: string;
  name: string;
  description: string;
  image: string;
  hires: number;
  rating: number;
}

// ── T4: GET /api/transporters/dashboard/top-customers ─────────────────
export interface TopCustomer {
  id: string;
  name: string;
  image: string;
  location: string;
  orders: number;
}

// ── T5: GET /api/transporters/dashboard/transit ───────────────────────
export interface TransitRow {
  id: string;
  name: string;
  description: string;
  image: string;
  iot: string;
  route: string;
  driver: string;
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
// `deltas` object (the shape the agent endpoint uses) — handle both.
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
      return { value: toNumber(raw), deltaPercent: toNumber(deltas[key]) };
    }
  }
  return { value: 0, deltaPercent: 0 };
};

export const transporterDashboardService = {
  // GET /api/transporters/dashboard/overview
  getOverview: async (): Promise<TransporterDashboardOverview> => {
    try {
      const res = await api.get("/api/transporters/dashboard/overview");
      const raw = unwrap<Record<string, unknown>>(res.data) ?? {};
      return {
        revenue: normalizeBlock(raw, "revenue", "totalRevenue", "payments"),
        customers: normalizeBlock(raw, "customers", "bookings", "totalCustomers"),
        fleets: normalizeBlock(raw, "fleets", "totalFleets"),
        drivers: normalizeBlock(raw, "drivers", "totalDrivers"),
      };
    } catch (error) {
      return handleApiError(error, "fetch dashboard overview");
    }
  },

  // GET /api/transporters/dashboard/revenue
  getRevenue: async (
    params: TransporterRevenueParams = {},
  ): Promise<RevenuePoint[]> => {
    try {
      const res = await api.get("/api/transporters/dashboard/revenue", {
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

  // GET /api/transporters/dashboard/most-hired-drivers
  getMostHired: async (limit = 7): Promise<MostHiredDriver[]> => {
    try {
      const res = await api.get(
        "/api/transporters/dashboard/most-hired-drivers",
        { params: { limit } },
      );
      const arr = unwrap<Record<string, unknown>[]>(res.data);
      return asArray(arr).map((d) => {
        const fleet = (d.fleet ?? {}) as Record<string, unknown>;
        return {
          id: pickString(d.id, d._id),
          name: pickString(d.name, d.fleetName, fleet.name, d.title),
          description: pickString(
            d.description,
            d.model,
            fleet.model,
            d.subtitle,
          ),
          image: pickString(d.image, d.avatar, fleet.image, d.imageUrl),
          hires: toNumber(d.hires, d.hireCount, d.bookings),
          rating: toNumber(d.rating, d.averageRating),
        };
      });
    } catch (error) {
      return handleApiError(error, "fetch most-hired drivers");
    }
  },

  // GET /api/transporters/dashboard/top-customers
  getTopCustomers: async (limit = 5): Promise<TopCustomer[]> => {
    try {
      const res = await api.get("/api/transporters/dashboard/top-customers", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data);
      return asArray(arr).map((c) => ({
        id: pickString(c.id, c._id),
        name: pickString(c.name, c.fullName),
        image: pickString(c.image, c.avatar),
        location: pickString(c.location, c.state),
        orders: toNumber(c.orders, c.ordersCount, c.totalOrders),
      }));
    } catch (error) {
      return handleApiError(error, "fetch top customers");
    }
  },

  // GET /api/transporters/dashboard/transit
  getTransit: async (limit = 10): Promise<TransitRow[]> => {
    try {
      const res = await api.get("/api/transporters/dashboard/transit", {
        params: { limit },
      });
      const arr = unwrap<Record<string, unknown>[]>(res.data);
      return asArray(arr).map((t) => {
        const fleet = (t.fleet ?? {}) as Record<string, unknown>;
        return {
          id: pickString(t.id, t._id, t.tripId),
          name: pickString(t.name, fleet.name, t.fleetName),
          description: pickString(t.description, fleet.model, t.model),
          image: pickString(t.image, fleet.image, t.imageUrl),
          iot: pickString(t.iot, fleet.iot, t.iotId, t.deviceId),
          route: pickString(t.route, t.routeLabel),
          driver: pickString(t.driver, t.driverName),
        };
      });
    } catch (error) {
      return handleApiError(error, "fetch transit list");
    }
  },
};
