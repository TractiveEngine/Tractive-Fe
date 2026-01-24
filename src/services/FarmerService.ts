import api from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";
import { UserProfile, userService } from "./UserService";

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
  revenue?: number;
  ordersCount?: number;
  approvalStatus?: string;
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
  farmers: Farmer[];
  total: number;
  page: number;
  limit: number;
}

// Map backend farmer to frontend format
export const mapBackendToFrontendFarmer = (
  backendFarmer: ApiFarmer,
): Farmer => {
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
    revenue: backendFarmer.revenue
      ? `₦${backendFarmer.revenue.toLocaleString()}`
      : "₦0",
    orders: backendFarmer.ordersCount?.toString() || "0",
    date: backendFarmer.createdAt
      ? new Date(backendFarmer.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    image: "/images/farmer_modal_profile.png",
    // Preserve other fields for editing
    businessName: backendFarmer.businessName,
    businessCAC: backendFarmer.businessCAC,
    country: backendFarmer.country,
    lga: backendFarmer.lga,
  };
};

// Map frontend form data to backend format (Full replacement for PUT)
const mapFrontendToBackendFarmerFull = (frontendData: Partial<Farmer>) => {
  // Simple heuristic: If it starts with RC or BN, treat as CAC, otherwise NIN
  let ninOrCac = frontendData.ninOrCac || "";

  // Clean up placeholder if present
  if (ninOrCac === "-") {
    ninOrCac = "";
  }

  const isCAC =
    ninOrCac.toUpperCase().startsWith("RC") ||
    ninOrCac.toUpperCase().startsWith("BN");

  return {
    name: frontendData.name || "",
    phone: frontendData.mobile || "",
    businessName: frontendData.businessName || "",
    nin: !isCAC ? ninOrCac : "",
    businessCAC: isCAC ? ninOrCac : "",
    address: frontendData.address || "",
    country: frontendData.country || "Nigeria",
    state: frontendData.state || "",
    lga: frontendData.lga || "",
    villageOrLocalMarket: frontendData.localMarket || "",
  };
};

export const farmerService = {
  // GET /api/farmers
  getFarmers: async (): Promise<FarmersResponse> => {
    try {
      console.log("🔄 Fetching farmers from API...");

      const response = await api.get("/api/farmers");

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

      // Map to frontend model
      const mappedFarmers = farmers.map(mapBackendToFrontendFarmer);

      return {
        farmers: mappedFarmers,
        total: mappedFarmers.length,
        page: 1,
        limit: mappedFarmers.length,
      };
    } catch (error) {
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
          error.message || "Failed to fetch farmers. Please try again.",
        );
      }
      throw error;
    }
  },

  // POST /api/farmers
  createFarmer: async (data: Partial<Farmer>): Promise<Farmer> => {
    try {
      console.log("📝 Creating farmer with data:", data);

      const backendData = mapFrontendToBackendFarmerFull(data);
      console.log("📤 Sending to backend:", backendData);

      const response = await api.post("/api/farmers", backendData);

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
    } catch (error) {
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
          error.message || "Failed to create farmer. Please try again.",
        );
      }
      throw error;
    }
  },

  // GET /api/farmers/:id
  getFarmerById: async (id: string): Promise<Farmer> => {
    try {
      console.log(`🔄 Fetching farmer ${id} from API...`);

      const response = await api.get(`/api/farmers/${id}`);

      console.log("✅ Farmer fetched:", response.data);

      let farmer: ApiFarmer;
      if (response.data._id) {
        farmer = response.data;
      } else if (response.data.farmer) {
        farmer = response.data.farmer;
      } else if (response.data.data) {
        farmer = response.data.data;
      } else {
        throw new Error("Invalid response format from server");
      }

      return mapBackendToFrontendFarmer(farmer);
    } catch (error) {
      console.error(`❌ Error fetching farmer ${id}:`, error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        if (status === 404) {
          toast.error("Farmer not found.");
        } else if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          toast.error("You don't have permission to view this farmer.");
        } else {
          toast.error(`Failed to fetch farmer: ${message}`);
        }
      } else {
        toast.error(
          error.message || "Failed to fetch farmer. Please try again.",
        );
      }
      throw error;
    }
  },

  // PUT /api/farmers/:id (Full replace)
  updateFarmer: async (id: string, data: Partial<Farmer>): Promise<Farmer> => {
    try {
      console.log(`📝 Updating farmer ${id} with data:`, data);

      const backendData = mapFrontendToBackendFarmerFull(data);
      console.log("📤 Sending to backend:", backendData);

      const response = await api.put(`/api/farmers/${id}`, backendData);

      console.log("✅ Farmer updated successfully:", response.data);

      let updatedFarmer: ApiFarmer;
      if (response.data._id) {
        updatedFarmer = response.data;
      } else if (response.data.farmer) {
        updatedFarmer = response.data.farmer;
      } else if (response.data.data) {
        updatedFarmer = response.data.data;
      } else {
        throw new Error("Invalid response format from server");
      }

      const mappedFarmer = mapBackendToFrontendFarmer(updatedFarmer);
      toast.success("Farmer updated successfully!");
      return mappedFarmer;
    } catch (error) {
      console.error(`❌ Error updating farmer ${id}:`, error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        if (status === 400) {
          toast.error(`Invalid data: ${message}`);
        } else if (status === 404) {
          toast.error("Farmer not found.");
        } else if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          toast.error("You don't have permission to update farmers.");
        } else {
          toast.error(`Failed to update farmer: ${message}`);
        }
      } else {
        toast.error(
          error.message || "Failed to update farmer. Please try again.",
        );
      }
      throw error;
    }
  },

  // DELETE /api/farmer/:id (Note: USER specified singular 'farmer' for matching 3rd party API)
  deleteFarmer: async (id: string): Promise<void> => {
    try {
      // console.log(`🗑️ Deleting farmer ${id}...`);

      await api.delete(`/api/farmers/${id}`);

      console.log("✅ Farmer deleted successfully");
      toast.success("Farmer deleted successfully!");
    } catch (error) {
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
          error.message || "Failed to delete farmer. Please try again.",
        );
      }
      throw error;
    }
  },
};
