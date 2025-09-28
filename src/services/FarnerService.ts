// services/FarmerService.ts
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

// Backend farmer structure (what your API expects/returns)
export interface BackendFarmer {
  _id: string;
  name: string;
  phone: string;
  businessName: string;
  nin: string;
  businessCAC: string;
  address: string;
  country: string;
  state: string;
  lga: string;
  villageOrLocalMarket: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend farmer structure (what your components use)
export interface ApiFarmer {
  id: string;
  name: string;
  state: string;
  address: string;
  localMarket: string;
  ninOrCac: string;
  mobile: string;
  altMobile: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  revenue: string;
  orders: string;
  date: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Farmer extends ApiFarmer {
  checked?: boolean;
}

export interface FarmersResponse {
  farmers: ApiFarmer[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateFarmerData {
  name: string;
  phone: string;
  businessName: string;
  nin: string;
  businessCAC: string;
  address: string;
  country: string;
  state: string;
  lga: string;
  villageOrLocalMarket: string;
}

export interface UpdateFarmerData {
  name?: string;
  phone?: string;
  businessName?: string;
  nin?: string;
  businessCAC?: string;
  address?: string;
  country?: string;
  state?: string;
  lga?: string;
  villageOrLocalMarket?: string;
}

export interface SearchFilters {
  search?: string;
  year?: string;
  month?: string;
  page?: number;
  limit?: number;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    null
  );
};

// Helper function to create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token found. Check if user is logged in.");
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Map frontend form data to backend API format
const mapFrontendToBackend = (
  frontendData: Omit<Farmer, "id" | "revenue" | "orders" | "date">
): CreateFarmerData => {
  return {
    name: frontendData.name,
    phone: frontendData.mobile,
    businessName: frontendData.name, // Use name as business name
    nin: frontendData.ninOrCac,
    businessCAC: frontendData.ninOrCac,
    address: frontendData.address,
    country: "Nigeria", // Default
    state: frontendData.state,
    lga: frontendData.state, // Use state as LGA
    villageOrLocalMarket: frontendData.localMarket,
  };
};

// Map backend API response to frontend format
const mapBackendToFrontend = (backendFarmer: BackendFarmer): ApiFarmer => {
  return {
    id: backendFarmer._id,
    name: backendFarmer.name || "",
    state: backendFarmer.state || backendFarmer.lga || "",
    address: backendFarmer.address || "",
    localMarket: backendFarmer.villageOrLocalMarket || "",
    ninOrCac: backendFarmer.nin || backendFarmer.businessCAC || "",
    mobile: backendFarmer.phone || "",
    altMobile: "", // Not in backend schema
    bankName: "", // Not in backend schema
    accountNumber: "", // Not in backend schema
    accountName: "", // Not in backend schema
    revenue: "$0", // Default value
    orders: "0", // Default value
    date: backendFarmer.createdAt
      ? new Date(backendFarmer.createdAt).toLocaleDateString("en-GB")
      : new Date().toLocaleDateString("en-GB"),
    image: "/images/farmer_modal_profile.png", // Default image
    createdAt: backendFarmer.createdAt,
    updatedAt: backendFarmer.updatedAt,
  };
};

export const farmerService = {
  // POST /api/farmers — Create farmer (agent/admin only)
  createFarmer: async (
    formData: Omit<Farmer, "id" | "revenue" | "orders" | "date">
  ): Promise<ApiFarmer> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in to create farmers.");
      }

      // Map frontend data to backend format
      const backendData = mapFrontendToBackend(formData);

      console.log(`Creating farmer with data:`, backendData);
      console.log(`Using token: ${token.substring(0, 20)}...`);

      const response = await axios.post(`${API_URL}/api/farmers`, backendData, {
        headers: getAuthHeaders(),
      });

      console.log("Create farmer response:", response.data);

      // Map response back to frontend format
      return mapBackendToFrontend(response.data.farmer);
    } catch (error: any) {
      console.error("Error creating farmer:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        switch (status) {
          case 401:
            throw new Error("Authentication failed. Please log in again.");
          case 403:
            throw new Error(
              "You don't have permission to create farmers. Agent or admin role required."
            );
          case 400:
            throw new Error(`Invalid data: ${message}`);
          default:
            throw new Error(`Create failed: ${message}`);
        }
      }

      throw new Error("Failed to create farmer. Please try again.");
    }
  },

  // GET /api/farmers — List farmers created by you
  getFarmers: async (filters: SearchFilters = {}): Promise<FarmersResponse> => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.warn("No auth token found for getFarmers");
        return {
          farmers: [],
          total: 0,
          page: 1,
          limit: 10,
        };
      }

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_URL}/api/farmers?${params}`, {
        headers: getAuthHeaders(),
      });

      // Map backend farmers to frontend format
      const mappedFarmers = response.data.farmers.map((farmer: BackendFarmer) =>
        mapBackendToFrontend(farmer)
      );

      return {
        farmers: mappedFarmers,
        total: response.data.total || mappedFarmers.length,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error: any) {
      console.error("Error fetching farmers:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          console.error("Authentication failed when fetching farmers");
        }
      }

      return {
        farmers: [],
        total: 0,
        page: 1,
        limit: 10,
      };
    }
  },

  // GET /api/farmers/{id} — Get farmer by ID
  getFarmer: async (id: string): Promise<ApiFarmer> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in to view farmer details.");
      }

      const response = await axios.get(`${API_URL}/api/farmers/${id}`, {
        headers: getAuthHeaders(),
      });

      return mapBackendToFrontend(response.data.farmer);
    } catch (error: any) {
      console.error("Error fetching farmer:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        switch (status) {
          case 401:
            throw new Error("Authentication failed. Please log in again.");
          case 403:
            throw new Error("You don't have permission to view this farmer.");
          case 404:
            throw new Error("Farmer not found.");
          default:
            throw new Error(`Failed to fetch farmer: ${message}`);
        }
      }

      throw new Error("Failed to fetch farmer details.");
    }
  },

  // PATCH /api/farmers/{id} — Update farmer (agent only)
  updateFarmer: async (
    id: string,
    formData: Omit<Farmer, "id" | "revenue" | "orders" | "date">
  ): Promise<ApiFarmer> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in to update farmers.");
      }

      // Map frontend data to backend format
      const backendData: UpdateFarmerData = {
        name: formData.name,
        phone: formData.mobile,
        businessName: formData.name,
        nin: formData.ninOrCac,
        businessCAC: formData.ninOrCac,
        address: formData.address,
        state: formData.state,
        lga: formData.state,
        villageOrLocalMarket: formData.localMarket,
      };

      console.log(`Updating farmer ${id} with data:`, backendData);

      const response = await axios.patch(
        `${API_URL}/api/farmers/${id}`,
        backendData,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Update farmer response:", response.data);

      return mapBackendToFrontend(response.data.farmer);
    } catch (error: any) {
      console.error("Error updating farmer:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        switch (status) {
          case 401:
            throw new Error("Authentication failed. Please log in again.");
          case 403:
            throw new Error(
              "You don't have permission to update farmers. Agent role required."
            );
          case 404:
            throw new Error("Farmer not found.");
          case 400:
            throw new Error(`Invalid data: ${message}`);
          default:
            throw new Error(`Update failed: ${message}`);
        }
      }

      throw new Error("Failed to update farmer. Please try again.");
    }
  },

  // Check authentication status
  isAuthenticated: (): boolean => {
    return getAuthToken() !== null;
  },

  // Get current auth token (for debugging)
  getToken: (): string | null => {
    return getAuthToken();
  },
};
