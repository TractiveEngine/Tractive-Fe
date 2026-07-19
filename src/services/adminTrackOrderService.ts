import api from "@/lib/axios";
import axios from "axios";
import { formatCurrency } from "@/lib/format";
import { OrderData, OrderPartyInfo } from "@/utils/TrackAgentData";

/**
 * Admin "Track Orders → Agent" service (A7 + agent half of A9 in
 * BACKEND_API_REQUIREMENTS.md).
 *
 * The transporter side of track-orders is already wired through
 * `fleetTripService` / `useFleetTrips`; this file covers the agent side, which
 * was still rendering the `TrackAgentData` fixture and `console.log`-ing the
 * buyer/seller popups.
 *
 * The confirmed list response is `{ success, data: [{ _id, status,
 * transportStatus, totalAmount, createdAt, buyer: {...}, sellers: [{...}] }],
 * pagination }`. The buyer/seller contact details already arrive on each row,
 * so the Buyer/Seller Info popups (A9) render straight from the list — no second
 * request. Parsing stays tolerant (each field has a fallback chain) so a
 * populated-order shape (`products[].product`, flat `seller`) also renders.
 */

// ── A7: GET /api/admin/orders/track/agent ─────────────────────────────
export type AgentTrackStatus = "paid" | "delivered";

export interface AgentTrackParams {
  status?: AgentTrackStatus;
  search?: string;
  page?: number;
  limit?: number;
  year?: string;
  month?: string;
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

const toArray = (raw: unknown): Record<string, unknown>[] => {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  const obj = raw as { data?: unknown[]; results?: unknown[]; items?: unknown[] };
  const arr = obj?.data ?? obj?.results ?? obj?.items;
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
};

const pickString = (...candidates: unknown[]): string => {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  return "";
};

const pickRecord = (...candidates: unknown[]): Record<string, unknown> => {
  for (const c of candidates) {
    if (c && typeof c === "object" && !Array.isArray(c)) {
      return c as Record<string, unknown>;
    }
  }
  return {};
};

const formatDate = (raw?: unknown): string => {
  if (typeof raw !== "string" || !raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toISOString().split("T")[0];
};

const formatAmount = (raw: unknown): string => {
  if (typeof raw === "number" && Number.isFinite(raw)) return formatCurrency(raw);
  if (typeof raw === "string" && raw.trim()) return raw;
  return "—";
};

/**
 * Map one track-order row. Handles both the flat doc shape and the populated
 * order record (`products[0].product`, `buyer.name`, nested seller/owner).
 */
const mapTrackOrder = (raw: Record<string, unknown>): OrderData => {
  const firstLine = pickRecord((raw.products as unknown[])?.[0]);
  const product = pickRecord(firstLine.product);
  const buyer = pickRecord(raw.buyer);
  // Seller comes back as a `sellers` array (one entry per distinct producer on
  // the order); fall back to a flat `seller` / product owner for other shapes.
  const sellersArr = Array.isArray(raw.sellers)
    ? (raw.sellers as unknown[])
    : [];
  const seller = pickRecord(sellersArr[0], raw.seller, product.owner);
  const sellerName =
    pickString(raw.sellerName, seller.businessName, seller.name, seller.fullName) ||
    "—";
  // When an order spans multiple sellers, hint at it: "crop farm +1".
  const sellerLabel =
    sellersArr.length > 1 ? `${sellerName} +${sellersArr.length - 1}` : sellerName;

  const images = (product.images as unknown[]) ?? (raw.images as unknown[]);

  return {
    id: pickString(raw.id, raw._id, raw.orderId),
    image: pickString(
      raw.image,
      product.image,
      Array.isArray(images) ? images[0] : "",
      "/images/noData.png",
    ),
    title: pickString(raw.title, raw.name, product.name) || "—",
    description: pickString(raw.description, product.description),
    buyerName: pickString(raw.buyerName, buyer.name, buyer.fullName) || "—",
    sellerName: sellerLabel,
    amount: formatAmount(raw.amount ?? raw.totalAmount ?? raw.total),
    date: formatDate(raw.date ?? raw.createdAt),
    checked: false,
    buyerInfo: mapPartyInfo(buyer),
    sellerInfos: (sellersArr.length ? sellersArr : [seller]).map(mapPartyInfo),
  };
};

const mapPartyInfo = (raw: unknown): OrderPartyInfo => {
  const src = pickRecord(raw);
  return {
    id: pickString(src.id, src._id),
    name: pickString(src.name, src.fullName, src.fullname) || "—",
    businessName: pickString(src.businessName, src.company),
    email: pickString(src.email),
    phone: pickString(src.phone, src.mobile, src.phoneNumber),
    state: pickString(src.state, src.location),
    address: pickString(src.address),
    image: pickString(src.image, src.avatar, src.logoUrl, src.photo),
  };
};

export interface AgentTrackResponse {
  data: OrderData[];
  pagination: { page: number; limit: number; total: number };
}

// The list envelope carries `pagination` alongside `data`; `unwrap` drills past
// it, so read it off whichever level actually has it.
const readPagination = (
  payload: unknown,
  fallback: { page: number; limit: number; total: number },
) => {
  const root = payload as { pagination?: unknown; data?: { pagination?: unknown } };
  const found = (root?.pagination ?? root?.data?.pagination) as
    | { page?: number; limit?: number; total?: number }
    | undefined;
  if (!found) return fallback;
  return {
    page: found.page ?? fallback.page,
    limit: found.limit ?? fallback.limit,
    total: found.total ?? fallback.total,
  };
};

export const adminTrackOrderService = {
  // GET /api/admin/orders/track/agent
  getAgentTrackOrders: async (
    params: AgentTrackParams = {},
  ): Promise<AgentTrackResponse> => {
    try {
      const res = await api.get("/api/admin/orders/track/agent", {
        params: {
          ...(params.status ? { status: params.status } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.year ? { year: params.year } : {}),
          ...(params.month ? { month: params.month } : {}),
          page: params.page ?? 1,
          limit: params.limit ?? 20,
        },
      });
      const data = toArray(unwrap(res.data)).map(mapTrackOrder);
      return {
        data,
        pagination: readPagination(res.data, {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          total: data.length,
        }),
      };
    } catch (error) {
      return handleApiError(error, "fetch agent track orders");
    }
  },
};
