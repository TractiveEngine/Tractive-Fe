// services/transactionService.ts
import api from "@/lib/axios";

// services/transactionService.ts
// services/transactionService.ts
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Using axios instance instead

// Frontend Transaction Interface (includes UI-specific fields)
export interface FrontendTransaction {
  _id: string;
  id: string; // Required for BaseData compatibility
  order: {
    _id: string;
    name?: string;
    description?: string;
    image?: string;
  };
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: "pending" | "approved";
  paymentMethod: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;

  // Frontend-only fields for UI
  name?: string;
  description?: string;
  image?: string;
  sold?: number;
  commission?: number;
  date?: string;
  checked?: boolean; // For checkbox compatibility
}

// Backend Transaction Interface (what API expects)
export interface BackendTransaction {
  _id: string;
  order: string;
  buyer: string;
  amount: number;
  status: "pending" | "approved";
  paymentMethod: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsParams {
  status?: "pending" | "approved";
  search?: string;
  year?: string;
  month?: string;
}

export interface UpdateStatusData {
  status: "pending" | "approved";
}

export interface ContactCustomerCareData {
  message: string;
  priority: "low" | "medium" | "high";
}

// Create authenticated headers with role validation
// Auth headers are handled by axios interceptor

// Mock data for images (you can replace this with actual image URLs from your order data)
const mockProductImages = [
  "/images/products/product1.jpg",
  "/images/products/product2.jpg",
  "/images/products/product3.jpg",
  "/images/products/product4.jpg",
  "/images/products/product5.jpg",
];

const getRandomImage = () => {
  return mockProductImages[
    Math.floor(Math.random() * mockProductImages.length)
  ];
};

const getRandomDescription = () => {
  const descriptions = [
    "Fresh organic vegetables",
    "Premium quality fruits",
    "Farm fresh produce",
    "Organic dairy products",
    "Local farm harvest",
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Helper function to handle API responses
// Response handling is managed by axios interceptor/wrapper where applicable, but we keep basic error handling here if needed.
// const handleResponse = ... (removed as axios throws on error status by default or we handle it in catch)

export interface CreateTransactionPayload {
  order: string;
  amount: number;
  paymentMethod: string;
  paymentReference?: string;
}

export interface CreateTransactionResponse {
  transaction: {
    _id: string;
    [key: string]: unknown;
  };
  message?: string;
}

export type AdminTransactionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "refunded";
export type AdminTransactionMethod = "cash" | "bank_transfer" | "card";

export interface AdminTransactionListParams {
  status?: AdminTransactionStatus;
  method?: AdminTransactionMethod;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface TransactionListResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export const transactionService = {
  async createTransaction(payload: CreateTransactionPayload): Promise<CreateTransactionResponse> {
    try {
      const response = await api.post("/api/transactions", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  // GET /api/admin/transactions?status=&method=&fromDate=&toDate=&page=&limit=
  async getAllTransactions(
    params: AdminTransactionListParams = {},
  ): Promise<TransactionListResponse> {
    try {
      const response = await api.get("/api/admin/transactions", {
        params: {
          ...(params.status ? { status: params.status } : {}),
          ...(params.method ? { method: params.method } : {}),
          ...(params.fromDate ? { fromDate: params.fromDate } : {}),
          ...(params.toDate ? { toDate: params.toDate } : {}),
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      });
      const body = response.data;
      const payload = body?.data ?? body;
      const data = payload?.transactions ?? payload ?? [];
      return {
        data: Array.isArray(data) ? data : [],
        pagination: payload?.pagination ?? {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          total: Array.isArray(data) ? data.length : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  // GET /api/admin/transactions/{id}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getTransactionById(id: string): Promise<any> {
    try {
      const response = await api.get(`/api/admin/transactions/${id}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  },

  async getTransactions(
    params?: GetTransactionsParams,
  ): Promise<FrontendTransaction[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.year) queryParams.append("year", params.year);
      if (params?.month) queryParams.append("month", params.month);

      const url = `/api/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const response = await api.get(url);

      const data = response.data;

      // Transform backend data to frontend format with UI enhancements
      const transactions: FrontendTransaction[] = data.transactions.map(
        (transaction: BackendTransaction) => {
          // Calculate commission (10% of amount for example)
          const commission = transaction.amount * 0.1;

          return {
            ...transaction,
            // Required fields for BaseData compatibility
            id: transaction._id, // Required for BaseData
            // Frontend-only fields for UI
            name: `Order #${transaction.order.slice(-8)}`,
            description: getRandomDescription(),
            image: getRandomImage(),
            sold: transaction.amount,
            commission: commission,
            date: new Date(transaction.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            checked: false, // Default unchecked for checkboxes
          };
        },
      );

      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  async updateTransactionStatus(
    id: string,
    statusData: UpdateStatusData,
  ): Promise<FrontendTransaction> {
    try {
      const response = await api.patch(`/api/transactions/${id}/status`, {
        ...statusData,
        id,
      });

      const data = response.data;
      return data.transaction;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  },

  // PATCH /api/admin/transactions/{id}/status — admin alias for approve/reject
  async adminUpdateTransactionStatus(
    id: string,
    status: AdminTransactionStatus,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const response = await api.patch(
        `/api/admin/transactions/${id}/status`,
        { status },
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("Error updating admin transaction status:", error);
      throw error;
    }
  },

  // POST /api/admin/transactions/refund
  async refundTransaction(payload: {
    transactionId: string;
    reason: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    try {
      const response = await api.post(
        `/api/admin/transactions/refund`,
        payload,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("Error refunding transaction:", error);
      throw error;
    }
  },

  async contactCustomerCare(
    id: string,
    contactData: ContactCustomerCareData,
  ): Promise<void> {
    try {
      await api.post(
        `/api/transactions/${id}/contact-customer-care`,
        contactData,
      );
    } catch (error) {
      console.error("Error contacting customer care:", error);
      throw error;
    }
  },

  // Helper method to check if user is authenticated - Rely on session check in components
  isAuthenticated(): boolean {
    return true; // Simplify or remove, components should check session
  },

  // Helper method to get user info from token (if needed) - Rely on session
  getUserInfo(): { userId: string; email?: string } | null {
    return null; // Simplify or remove
  },
};
