// services/customerService.ts

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
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  state?: string;
  year?: number;
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

interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export class CustomerService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Get authentication token from localStorage
   */
  private static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  /**
   * Build headers with authentication
   */
  private static buildHeaders(customHeaders?: HeadersInit): Headers {
    // Initialize Headers object from any provided HeadersInit
    const headers = new Headers(customHeaders);

    // Ensure default content type is set when not provided
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = this.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Handle API response with detailed debugging
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      console.error("❌ API Response not OK:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      let error: ApiError;

      try {
        const errorText = await response.text();
        console.error("📄 Error response body:", errorText);

        error = errorText
          ? JSON.parse(errorText)
          : {
              message: response.statusText || "An error occurred",
              statusCode: response.status,
            };
      } catch (parseError) {
        console.error("❌ Error parsing error response:", parseError);
        error = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      // Handle specific status codes
      if (response.status === 404) {
        console.error("🚨 404 - Endpoint not found. Please check:");
        console.error("   - Is the backend server running?");
        console.error("   - Is the API route correct?");
        console.error("   - Is the base URL correct?");
        error.message = `API endpoint not found: ${response.url}`;
      }

      // Handle authentication errors
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }

      throw error;
    }

    // If response is OK, parse and return
    try {
      const data = await response.json();
      console.log("✅ API call successful:", data);
      return data;
    } catch (parseError) {
      console.error("❌ Error parsing successful response:", parseError);
      throw {
        message: "Failed to parse response",
        statusCode: 500,
      };
    }
  }

  /**
   * Make GET request with detailed debugging
   */
  private static async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    console.log("🚀 Making API request:");
    console.log("   URL:", url);
    console.log("   Base URL:", this.baseURL);
    console.log("   Endpoint:", endpoint);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.buildHeaders(),
      });

      console.log("📡 Response received:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log("   URL:", response.url);
      console.log("   OK:", response.ok);

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("💥 Fetch failed completely:", error);
      throw error;
    }
  }

  /**
   * Make POST request
   */
  private static async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

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

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/customers?${queryString}`
        : "/api/customers";

      const response = await this.get<GetCustomersResponse>(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }

  /**
   * Test the API endpoint directly (for debugging)
   */
  static async testApiEndpoint(): Promise<void> {
    const testURL = `${this.baseURL}/api/customers`;
    console.log("🧪 Testing API endpoint directly:", testURL);

    try {
      const response = await fetch(testURL, {
        method: "GET",
        headers: this.buildHeaders(),
      });

      console.log("🧪 Direct test results:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log("   OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("   Error Body:", errorText);
      } else {
        const data = await response.json();
        console.log("   Success Data:", data);
      }
    } catch (error) {
      console.error("🧪 Direct test failed:", error);
    }
  }

  /**
   * Get a single customer profile by ID
   */
  static async getCustomerProfile(customerId: string): Promise<Customer> {
    try {
      const response = await this.get<Customer>(`/api/customers/${customerId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Initiate a chat with a customer
   */
  static async initiateChat(
    customerId: string,
    payload: ChatInitiatePayload,
  ): Promise<ChatInitiateResponse> {
    try {
      const response = await this.post<ChatInitiateResponse>(
        `/api/customers/${customerId}/chat`,
        payload,
      );
      return response;
    } catch (error) {
      console.error(
        `Error initiating chat with customer ${customerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Set authentication token
   */
  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  /**
   * Clear authentication token
   */
  static clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }
}
