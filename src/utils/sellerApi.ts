import axios from "axios";
import { toast } from "sonner";

export interface Seller {
  sellerId: string;
  name: string;
  email: string;
  productsCount: number;
  farmersCount?: number;
  roles: string[];
  activeRole: string;
  followersCount?: number;
  phoneNumbers?: string[];
  yearsOfExperience?: number;
  bio?: string;
  averageRating?: number;
  totalReviews?: number;
  amountOfSales?: number;
  recommendations?: unknown[];
  // UI fields not in API - optional or with defaults
  image?: string;
  rating?: number;
  rateStatus?: string;
  sellerYear?: string;
  customerNumber?: number;
  sellerBio?: string;
  location?: string;
  isFollowing?: boolean;
  isVerified?: boolean;
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

export interface GetSellersParams {
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
  year?: number;
  rating?: number;
}

export const getSellers = async (params?: GetSellersParams): Promise<SellersResponse> => {
  try {
    const response = await axios.get<SellersResponse>(
      "https://tractive-be.vercel.app/api/sellers",
      { params }
    );

    if (response.data.success) {
      return response.data;
    } else {
      toast.error("Failed to load sellers");
      return { success: false, data: [], pagination: { page: 1, limit: 12, total: 0 } };
    }
  } catch (error) {
    console.error("Error fetching sellers:", error);
    toast.error("Error loading sellers list");
    return { success: false, data: [], pagination: { page: 1, limit: 12, total: 0 } };
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
    const sellersResponse = await getSellers();
    const seller = sellersResponse.data.find((s) => s.sellerId === id);
    return seller || null;
  } catch (error) {
    console.error("Error fetching seller details:", error);
    return null;
  }
};

export interface GetSellerProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "available" | "out_of_stock" | "discontinued";
  category?: string;
}

export const getSellerProducts = async (id: string, params?: GetSellerProductsParams): Promise<unknown[]> => {
    try {
        const response = await axios.get<{ success: boolean; data: unknown[] }>(
            `https://tractive-be.vercel.app/api/sellers/${id}/products`,
            { params }
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

// Get seller reviews
export const getSellerReviews = async (id: string): Promise<unknown> => {
    try {
        const response = await axios.get(
            `https://tractive-be.vercel.app/api/sellers/${id}/reviews`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching seller reviews:", error);
        return null;
    }
}

// Like a review
export const likeReview = async (reviewId: string): Promise<unknown> => {
    try {
        const response = await axios.post(
            `https://tractive-be.vercel.app/api/reviews/${reviewId}/like`
        );
        return response.data;
    } catch (error) {
        console.error("Error liking review:", error);
        throw error;
    }
}
