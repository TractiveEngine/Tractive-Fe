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

export interface OrdersQueryParams {
  search?: string;
  status?: "parked" | "delivered" | "pending";
  year?: string;
  month?: string;
  buyer?: string;
  location?: string;
  readyForTransport?: boolean;
}

export interface CreateOrderPayload {
  products: { product: string; quantity: number }[];
  totalAmount: number;
  address: string;
  phone: string;
  notes?: string;
  bidIds: string[];
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
   * Fetch orders with optional filters
   */
  static async getOrders(params?: OrdersQueryParams): Promise<Order[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.year) queryParams.append("year", params.year);
      if (params?.month) queryParams.append("month", params.month);
      if (params?.buyer) queryParams.append("buyer", params.buyer);
      if (params?.location) queryParams.append("location", params.location);
      if (params?.readyForTransport) queryParams.append("readyForTransport", "true");

      const url = `/api/orders${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await api.get(url);
      return response.data;
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
