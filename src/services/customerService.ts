// services/customerService.ts

import api from "@/lib/axios";

export interface Customer {
  id: string;
  name: string;
  state: string;
  revenue: number;
  orders: number;
  mobile: string;
  date: string;
  image?: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  lastOrderAt?: string;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  state?: string;
  year?: number;
  // Backend support pending — see API-FEEDBACK-FOR-BACKEND.md (Item 8).
  month?: number;
}

export interface GetCustomersResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ChatInitiatePayload {
  message: string;
  subject: string;
}

export interface ChatInitiateResponse {
  chatId: string;
  message: string;
  timestamp: string;
}

/**
 * Map a raw customer record (as it comes off the wire) to the `Customer`
 * shape the UI expects. The backend may use `_id`, `phone`, `totalSpent`,
 * `ordersCount`, `avatar`, `createdAt`, etc., so we normalise defensively.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToCustomer = (raw: any): Customer => {
  const address = raw?.address ?? raw?.location ?? "";
  return {
    id: raw?.id ?? raw?._id ?? "",
    name: raw?.name ?? raw?.fullName ?? raw?.buyer?.name ?? "Unknown",
    state: raw?.state ?? raw?.location ?? (typeof address === "string" ? address : ""),
    revenue: raw?.revenue ?? raw?.totalSpent ?? raw?.totalRevenue ?? 0,
    orders: raw?.orders ?? raw?.ordersCount ?? raw?.orderCount ?? raw?.totalOrders ?? 0,
    mobile: raw?.mobile ?? raw?.phone ?? raw?.phoneNumber ?? "—",
    date: raw?.date ?? raw?.createdAt ?? "",
    image: raw?.image ?? raw?.avatar ?? raw?.profileImage,
    email: raw?.email,
    address: typeof address === "string" ? address : undefined,
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
    lastOrderAt: raw?.lastOrderAt,
  };
};

/**
 * Customer API.
 *
 * Uses the shared `@/lib/axios` instance, which injects the NextAuth Bearer
 * token and handles 401 refresh/logout centrally. (Previously this read a
 * never-set `localStorage.authToken`, so every request went out unauthenticated.)
 */
export class CustomerService {
  /**
   * Get all customers with optional filtering
   * GET /api/customers?page&limit&search&name&state&year
   */
  static async getCustomers(
    params?: GetCustomersParams,
  ): Promise<GetCustomersResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page !== undefined)
        queryParams.append("page", String(params.page));
      if (params?.limit !== undefined)
        queryParams.append("limit", String(params.limit));
      if (params?.search) queryParams.append("search", params.search);
      if (params?.name) queryParams.append("name", params.name);
      if (params?.state) queryParams.append("state", params.state);
      if (params?.year !== undefined)
        queryParams.append("year", String(params.year));
      if (params?.month !== undefined)
        queryParams.append("month", String(params.month));

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/customers?${queryString}`
        : "/api/customers";

      const response = await api.get(endpoint);

      // Be defensive about the response envelope — the API may return
      // `{ data: [...] }`, `{ data: { customers: [...], pagination } }`,
      // `{ customers: [...] }`, `{ success, data: [...] }`, or a bare array.
      const body = response.data;
      const payload = body?.data ?? body;
      const list = Array.isArray(payload)
        ? payload
        : payload?.customers ?? payload?.data ?? payload?.items ?? [];
      const rawList = Array.isArray(list) ? list : [];

      const rawPagination =
        body?.pagination ?? payload?.pagination ?? null;
      const limit = params?.limit ?? rawPagination?.limit ?? rawList.length;
      const total = rawPagination?.total ?? rawList.length;

      return {
        data: rawList.map(mapToCustomer),
        pagination: {
          page: rawPagination?.page ?? params?.page ?? 1,
          limit,
          total,
          totalPages:
            rawPagination?.totalPages ??
            (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1),
        },
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }

  /**
   * Get a single customer profile by ID
   */
  static async getCustomerProfile(customerId: string): Promise<Customer> {
    try {
      const response = await api.get(`/api/customers/${customerId}`);
      const body = response.data;
      const raw = body?.data ?? body?.customer ?? body;
      return mapToCustomer(raw);
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Initiate a chat with a customer
   *
   * NOTE: only the transporter-scoped route (`/api/transporters/customers/{id}/chat`,
   * see `transporterService.initiateCustomerChat`) is confirmed by the backend.
   * This agent-scoped route is not in Swagger yet and may 404.
   */
  static async initiateChat(
    customerId: string,
    payload: ChatInitiatePayload,
  ): Promise<ChatInitiateResponse> {
    try {
      const response = await api.post(
        `/api/customers/${customerId}/chat`,
        payload,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error(
        `Error initiating chat with customer ${customerId}:`,
        error,
      );
      throw error;
    }
  }
}
