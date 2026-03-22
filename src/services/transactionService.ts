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

export const transactionService = {
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
