// services/FarmerService.ts
import { getAuthToken } from "@/utils/loginAuth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserProfile, userService } from "./UserService";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

// Backend API Farmer Interface (matches API response)
export interface ApiFarmer {
  _id: string;
  name: string;
  phone?: string;
  businessName?: string;
  nin?: string;
  businessCAC?: string;
  address?: string;
  country?: string;
  state?: string;
  lga?: string;
  villageOrLocalMarket?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend Farmer Interface (includes UI state)
export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  altMobile: string;
  state: string;
  address: string;
  localMarket: string;
  ninOrCac: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  revenue: string;
  orders: string;
  date: string;
  image: string;
  checked?: boolean;
  businessName?: string;
  businessCAC?: string;
  country?: string;
  lga?: string;
}

export interface FarmersResponse {
  farmers: ApiFarmer[];   
  total: number;
  page: number;
  limit: number;
}

// Create authenticated headers with role validation
const getAuthHeaders = async () => {
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

// Check if user has permission to manage farmers
const checkFarmerPermissions = async (): Promise<UserProfile> => {
  try {
    const user = await userService.getCurrentUser();
    console.log("👤 Current user roles:", user.roles);
    console.log("👤 Active role:", user.activeRole);

    // Check if user has farmer management permissions
    if (!userService.canManageFarmers(user)) {
      throw new Error(
        `Your role (${user.activeRole}) does not have permission to manage farmers`
      );
    }

    return user;
  } catch (error) {
    console.error("❌ Permission check failed:", error);
    throw error;
  }
};

// Map backend farmer to frontend format
const mapBackendToFrontendFarmer = (backendFarmer: ApiFarmer): Farmer => {
  return {
    id: backendFarmer._id,
    name: backendFarmer.name || "-",
    mobile: backendFarmer.phone || "-",
    altMobile: "-",
    state: backendFarmer.state || "-",
    address: backendFarmer.address || "-",
    localMarket: backendFarmer.villageOrLocalMarket || "-",
    ninOrCac: backendFarmer.nin || backendFarmer.businessCAC || "-",
    bankName: "-",
    accountNumber: "-",
    accountName: "-",
    revenue: "₦0",
    orders: "0",
    date: backendFarmer.createdAt
      ? new Date(backendFarmer.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    image: "/images/farmer_modal_profile.png",
  };
};

// Map frontend form data to backend format
const mapFrontendToBackendFarmer = (frontendData: Partial<Farmer>) => {
  return {
    name: frontendData.name || "",
    phone: frontendData.mobile || "",
    businessName: frontendData.businessName || "",
    nin: frontendData.ninOrCac || "",
    businessCAC: frontendData.businessCAC || "",
    address: frontendData.address || "",
    country: frontendData.country || "Nigeria",
    state: frontendData.state || "",
    lga: frontendData.lga || "",
    villageOrLocalMarket: frontendData.localMarket || "",
  };
};

export const farmerService = {
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  getToken: (): string | null => {
    return getAuthToken();
  },

  // Get current user with roles
  getCurrentUser: async (): Promise<UserProfile> => {
    return await userService.getCurrentUser();
  },

  // Check if current user can manage farmers
  canManageFarmers: async (): Promise<boolean> => {
    try {
      const user = await userService.getCurrentUser();
      return userService.canManageFarmers(user);
    } catch (error) {
      return false;
    }
  },

  // GET /api/farmers
  getFarmers: async (): Promise<FarmersResponse> => {
    try {
      console.log("🔄 Fetching farmers from API...");

      // Check permissions first
      await checkFarmerPermissions();

      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/api/farmers`, {
        headers,
        timeout: 10000,
      });

      console.log("✅ API Response:", response.data);

      let farmers: ApiFarmer[] = [];
      if (Array.isArray(response.data)) {
        farmers = response.data;
      } else if (
        response.data.farmers &&
        Array.isArray(response.data.farmers)
      ) {
        farmers = response.data.farmers;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        farmers = response.data.data;
      } else {
        // If no farmers array found, use the response data directly if it's an array-like object
        farmers = [response.data].filter(Boolean);
      }

      return {
        farmers: farmers,
        total: farmers.length,
        page: 1,
        limit: farmers.length,
      };
    } catch (error: any) {
      console.error("❌ Error fetching farmers:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          toast.error("You don't have permission to view farmers.");
        } else {
          toast.error(`Failed to fetch farmers: ${message}`);
        }
      } else {
        toast.error(
          error.message || "Failed to fetch farmers. Please try again."
        );
      }
      throw error;
    }
  },

  // POST /api/farmers
  createFarmer: async (data: Partial<Farmer>): Promise<Farmer> => {
    try {
      console.log("📝 Creating farmer with data:", data);

      // Check permissions first
      await checkFarmerPermissions();

      const backendData = mapFrontendToBackendFarmer(data);
      console.log("📤 Sending to backend:", backendData);

      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/api/farmers`, backendData, {
        headers,
        timeout: 15000,
      });

      console.log("✅ Farmer created successfully:", response.data);

      let createdFarmer: ApiFarmer;
      if (response.data._id) {
        createdFarmer = response.data;
      } else if (response.data.farmer) {
        createdFarmer = response.data.farmer;
      } else if (response.data.data) {
        createdFarmer = response.data.data;
      } else {
        throw new Error("Invalid response format from server");
      }

      const mappedFarmer = mapBackendToFrontendFarmer(createdFarmer);
      toast.success("Farmer onboarded successfully!");
      return mappedFarmer;
    } catch (error: any) {
      console.error("❌ Error creating farmer:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        if (status === 400) {
          toast.error(`Invalid data: ${message}`);
        } else if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          toast.error("You don't have permission to create farmers.");
        } else {
          toast.error(`Failed to create farmer: ${message}`);
        }
      } else {
        toast.error(
          error.message || "Failed to create farmer. Please try again."
        );
      }
      throw error;
    }
  },

  // DELETE /api/farmers/:id
  deleteFarmer: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Deleting farmer ${id}...`);

      // Check permissions first
      await checkFarmerPermissions();

      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/api/farmers/${id}`, {
        headers,
        timeout: 10000,
      });

      console.log("✅ Farmer deleted successfully");
      toast.success("Farmer deleted successfully!");
    } catch (error: any) {
      console.error("❌ Error deleting farmer:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        if (status === 404) {
          toast.error("Farmer not found.");
        } else if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          toast.error("You don't have permission to delete farmers.");
        } else {
          toast.error(`Failed to delete farmer: ${message}`);
        }
      } else {
        toast.error(
          error.message || "Failed to delete farmer. Please try again."
        );
      }
      throw error;
    }
  },
};
