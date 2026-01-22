// services/ordersApi.ts

import { getAuthToken } from "@/utils/loginAuth";
import { toast } from "sonner";

/**
 * Redirect to login page
 */
const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Create authenticated headers with role validation
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn("⚠️ No auth token found. User may not be authenticated.");
    toast.error("Authentication required. Please login again.");
    redirectToLogin();
    throw new Error("Authentication required");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export class OrdersApiService {
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

      const url = `${API_URL}/api/orders${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const headers = getAuthHeaders();

      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          redirectToLogin();
          throw new Error("Unauthorized: Please login again");
        }
        if (response.status === 403) {
          toast.error("You don't have permission to access orders.");
          throw new Error(
            "Forbidden: You don't have permission to access this resource",
          );
        }
        toast.error(`Failed to fetch orders: ${response.statusText}`);
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      return await response.json();
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
      const headers = getAuthHeaders();

      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          redirectToLogin();
          throw new Error("Unauthorized: Please login again");
        }
        if (response.status === 403) {
          toast.error("You don't have permission to view this order.");
          throw new Error(
            "Forbidden: You don't have permission to access this resource",
          );
        }
        if (response.status === 404) {
          toast.error("Order not found.");
          throw new Error(`Order with ID ${id} not found`);
        }
        toast.error(`Failed to fetch order: ${response.statusText}`);
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }

      return await response.json();
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
      const headers = getAuthHeaders();

      const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status, id }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          redirectToLogin();
          throw new Error("Unauthorized: Please login again");
        }
        if (response.status === 403) {
          toast.error("You don't have permission to update this order.");
          throw new Error(
            "Forbidden: You don't have permission to update this order",
          );
        }
        if (response.status === 404) {
          toast.error("Order not found.");
          throw new Error(`Order with ID ${id} not found`);
        }
        toast.error(`Failed to update order: ${response.statusText}`);
        throw new Error(
          `Failed to update order status: ${response.statusText}`,
        );
      }

      const statusText = status === "parked" ? "parked" : "delivered";
      toast.success(`Order marked as ${statusText} successfully!`);

      return await response.json();
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
