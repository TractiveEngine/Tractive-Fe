import axios from "axios";
import { toast } from "sonner";

export interface Seller {
  sellerId: string;
  name: string;
  email: string;
  productsCount: number;
  roles: string[];
  activeRole: string;
  // UI fields not in API - optional or with defaults
  image?: string;
  rating?: number;
  rateStatus?: string;
  sellerYear?: string;
  customerNumber?: number;
  sellerBio?: string;
  location?: string;
}

interface SellersResponse {
  success: boolean;
  data: Seller[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const getSellers = async (): Promise<Seller[]> => {
  try {
    const response = await axios.get<SellersResponse>(
      "https://tractive-be.vercel.app/api/sellers"
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error("Failed to load sellers");
      return [];
    }
  } catch (error) {
    console.error("Error fetching sellers:", error);
    toast.error("Error loading sellers list");
    return [];
  }
};

export const getSellerById = async (id: string): Promise<Seller | null> => {
  try {
    // Try hitting the specific endpoint first
    // Note: This endpoint is currently returning 400, so this block might be skipped to catch directly
    // based on previous tests, but keeping it for when API is fixed.
    try {
      const response = await axios.get<{ success: boolean; data: Seller }>(
        `https://tractive-be.vercel.app/api/sellers/${id}`
      );
      if (response.data.success) {
        return response.data.data;
      }
    } catch (specificError) {
      console.warn("Direct seller fetch failed, trying fallback...", specificError);
    }

    // Fallback: Fetch all sellers and find by ID
    const sellers = await getSellers();
    const seller = sellers.find((s) => s.sellerId === id);
    return seller || null;
  } catch (error) {
    console.error("Error fetching seller details:", error);
    return null;
  }
};

export const getSellerProducts = async (id: string): Promise<any[]> => {
    try {
        const response = await axios.get<{ success: boolean; data: any[] }>(
            `https://tractive-be.vercel.app/api/sellers/${id}/products`
        );
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching seller products:", error);
        return [];
    }
}
