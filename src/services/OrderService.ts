// services/ordersApi.ts

import api from "@/lib/axios";
import { toast } from "sonner";

export interface Order {
  id: string;
  name: string;
  description: string;
  image: string;
  amount: number;
  buyer: string;
  location: string;
  date: string;
  status: "pending" | "parked" | "delivered";
  checked?: boolean;
}

export type OrderStatus =
  | "pending"
  | "payment_pending"
  | "paid"
  | "delivered";

export type OrderTransportStatus =
  | "pending"
  | "picked"
  | "on_transit"
  | "delivered";

export interface OrdersQueryParams {
  search?: string;
  status?: OrderStatus | "parked";
  transportStatus?: OrderTransportStatus;
  year?: string;
  month?: string;
  buyer?: string;
  location?: string;
  readyForTransport?: boolean;
  paidForTransport?: boolean;
}

export interface OrderProductLine {
  _id?: string;
  product?:
    | string
    | {
        _id?: string;
        name?: string;
        images?: string[];
        unit?: string;
      };
  quantity?: number;
  unitPrice?: number;
  lineSubtotal?: number;
  localTransportRequired?: boolean;
  localTransportFee?: number;
  localTransportFrom?: string;
  localTransportTo?: string;
  localTransportNote?: string;
}

export interface OrderRecord {
  _id?: string;
  id?: string;
  buyer?: string | { _id?: string; name?: string };
  products?: OrderProductLine[];
  bidIds?: string[];
  totalAmount?: number;
  status?: string;
  transportStatus?: string;
  readyForTransport?: boolean;
  paidForTransport?: boolean;
  address?: string;
  phone?: string;
  transporter?:
    | string
    | {
        _id?: string;
        name?: string;
        phone?: string;
      };
  createdAt?: string;
  updatedAt?: string;
  deliveredAt?: string;
}

export interface CreateOrderPayload {
  products: { product: string; quantity: number }[];
  totalAmount: number;
  address: string;
  phone: string;
  notes?: string;
  bidIds: string[];
}

export type TransportStatus =
  | "pending"
  | "ready"
  | "picked"
  | "on_transit"
  | "delivered"
  | "cancelled";

export interface UpdateTransportStatusPayload {
  transportStatus: TransportStatus;
  note?: string;
  location?: string;
}

export interface CreateOrderResponse {
  success?: boolean;
  order: {
    _id: string;
    buyer: string;
    products: {
      product: string;
      quantity: number;
      unitPrice: number;
      lineSubtotal: number;
      localTransportRequired: boolean;
      localTransportFee: number;
      localTransportFrom: string;
      localTransportTo: string;
      localTransportNote: string;
      _id: string;
    }[];
    bidIds: string[];
    totalAmount: number;
    status: string;
    transportStatus: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

// API_URL and Headers managed by axios

export class OrdersApiService {
  /**
   * Create a new order from selected won bids
   */
  static async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    try {
      const response = await api.post("/api/orders", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  /**
   * Fetch orders with optional filters.
   * Unwraps `{ success, data, pagination }` envelope and returns the array.
   */
  static async getOrders(params?: OrdersQueryParams): Promise<OrderRecord[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.transportStatus)
        queryParams.append("transportStatus", params.transportStatus);
      if (params?.year) queryParams.append("year", params.year);
      if (params?.month) queryParams.append("month", params.month);
      if (params?.buyer) queryParams.append("buyer", params.buyer);
      if (params?.location) queryParams.append("location", params.location);
      if (params?.readyForTransport) queryParams.append("readyForTransport", "true");
      if (params?.paidForTransport) queryParams.append("paidForTransport", "true");

      const url = `/api/orders${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await api.get(url);
      const body = response.data;
      if (Array.isArray(body)) return body as OrderRecord[];
      if (body && Array.isArray(body.data)) return body.data as OrderRecord[];
      return [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (
        error instanceof Error &&
        !error.message.includes("Unauthorized") &&
        !error.message.includes("Forbidden")
      ) {
        toast.error("Failed to load orders. Please try again.");
      }
      throw error;
    }
  }

  /**
   * Get single order details
   */
  static async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      if (
        error instanceof Error &&
        !error.message.includes("Unauthorized") &&
        !error.message.includes("Forbidden") &&
        !error.message.includes("not found")
      ) {
        toast.error("Failed to load order details. Please try again.");
      }
      throw error;
    }
  }

  /**
   * Get buyer details for an order assigned to the transporter.
   * GET /api/transporters/orders/{orderId}/buyer
   */
  static async getTransporterOrderBuyer(orderId: string): Promise<unknown> {
    try {
      const response = await api.get(
        `/api/transporters/orders/${orderId}/buyer`,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error(
        `Error fetching buyer for transporter order ${orderId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get product details for an order assigned to the transporter.
   * GET /api/transporters/orders/{orderId}/product
   */
  static async getTransporterOrderProduct(orderId: string): Promise<unknown> {
    try {
      const response = await api.get(
        `/api/transporters/orders/${orderId}/product`,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error(
        `Error fetching product for transporter order ${orderId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update the delivery/transport status on an order the transporter is fulfilling.
   * PATCH /api/transporters/orders/{orderId}/status
   */
  static async updateTransportStatus(
    orderId: string,
    payload: UpdateTransportStatusPayload,
  ): Promise<unknown> {
    try {
      const response = await api.patch(
        `/api/transporters/orders/${orderId}/status`,
        payload,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error(
        `Error updating transport status for order ${orderId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get tracking info (timeline + GPS) for an order assigned to the transporter.
   * GET /api/transporters/orders/{orderId}/tracking
   */
  static async getTransporterOrderTracking(
    orderId: string,
  ): Promise<unknown> {
    try {
      const response = await api.get(
        `/api/transporters/orders/${orderId}/tracking`,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error(
        `Error fetching tracking for transporter order ${orderId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    id: string,
    status: "parked" | "delivered",
  ): Promise<Order> {
    try {
      const response = await api.patch(`/api/orders/${id}/status`, {
        status,
        id,
      });

      const statusText = status === "parked" ? "parked" : "delivered";
      toast.success(`Order marked as ${statusText} successfully!`);

      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
      if (
        error instanceof Error &&
        !error.message.includes("Unauthorized") &&
        !error.message.includes("Forbidden") &&
        !error.message.includes("not found")
      ) {
        toast.error("Failed to update order status. Please try again.");
      }
      throw error;
    }
  }
}
