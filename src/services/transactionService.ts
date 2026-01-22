// services/transactionService.ts
import { getAuthToken } from "@/utils/loginAuth";

// services/transactionService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = getAuthToken();
  if (!token) {
    console.warn("⚠️ No auth token found. User may not be authenticated.");
    throw new Error("Authentication required");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

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
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }
  return response.json();
};

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

      const url = `${API_BASE_URL}/api/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const headers = await getAuthHeaders();

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const data = await handleResponse(response);

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
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/api/transactions/${id}/status`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ ...statusData, id }),
        },
      );

      const data = await handleResponse(response);
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
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/api/transactions/${id}/contact-customer-care`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(contactData),
        },
      );

      await handleResponse(response);
    } catch (error) {
      console.error("Error contacting customer care:", error);
      throw error;
    }
  },

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  },

  // Helper method to get user info from token (if needed)
  getUserInfo(): { userId: string; email?: string } | null {
    const token = getAuthToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        userId: payload.userId,
        email: payload.email,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};
