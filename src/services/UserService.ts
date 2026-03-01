import api from "@/lib/axios";
import axios from "axios";

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  phone: string;
  nin: string;
  businessName: string;
  villageOrLocalMarket: string;
  interests: string[];
  role?: string[]; // Handle potential backend inconsistency (role vs roles)
  roles: string[];
  activeRole: string;
  isVerified: boolean;
  lastResendAt: string | null;
  resendCountToday: number;
  __v: number;
}

export const userService = {
  // GET /api/profile - Get current user profile
  getCurrentUser: async (): Promise<UserProfile> => {
    try {
      console.log("🔄 Fetching current user profile...");
      const response = await api.get("/api/profile");

      console.log("✅ User profile response:", response.data);

      // Your API returns the user object directly
      const userData = response.data.user || response.data;

      if (!userData || !userData._id) {
        throw new Error("Invalid user response format");
      }

      return userData;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        if (status === 401) {
          console.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          console.error("You don't have permission to access this resource.");
        }
        throw new Error(message || "Failed to fetch user profile");
      }
      throw error;
    }
  },

  // Check if user has specific role
  hasRole: (user: UserProfile | null, role: string): boolean => {
    return user ? user.roles.includes(role) : false;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (user: UserProfile | null, roles: string[]): boolean => {
    return user ? user.roles.some((role) => roles.includes(role)) : false;
  },

  // Get current active role
  getActiveRole: (user: UserProfile | null): string => {
    return user?.activeRole || "user";
  },

  // Check if user can manage farmers (agent, admin, supervisor, etc.)
  canManageFarmers: (user: UserProfile | null): boolean => {
    if (!user) return false;

    const farmerManagementRoles = ["admin", "agent"];
    return farmerManagementRoles.includes(user.activeRole);
  },

  // Add new account/role
  addAccount: async (data: {
    role: string;
    name: string;
    phone: string;
    address: string;
    country: string;
    state: string;
    lga: string;
  }): Promise<any> => {
    try {
      const response = await api.post("/api/auth/add-account", data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding account:", error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message || "Failed to add account");
      }
      throw error;
    }
  },
  
  // Follow a farmer (Buyer action)
  followFarmer: async (farmerId: string): Promise<any> => {
    try {
      const response = await api.post(`/api/buyers/sellers/${farmerId}/follow`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error following farmer ${farmerId}:`, error);
      throw error;
    }
  },

  // Unfollow a farmer (Buyer action)
  unfollowFarmer: async (farmerId: string): Promise<any> => {
    try {
      const response = await api.delete(`/api/buyers/sellers/${farmerId}/follow`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error unfollowing farmer ${farmerId}:`, error);
      throw error;
    }
  },

  // Add product to wishlist
  addToWishlist: async (productId: string): Promise<any> => {
    try {
      console.log(`🚀 Adding product ${productId} to wishlist`);
      const response = await api.post(`/api/wishlist`, { productId });
      return response.data;
    } catch (error) {
      console.error(`❌ Error adding product ${productId} to wishlist:`, error);
      throw error;
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: string): Promise<any> => {
    try {
      console.log(`🚀 Removing product ${productId} from wishlist`);
      const response = await api.delete(`/api/wishlist`, {
        data: { productId },
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error removing product ${productId} from wishlist:`,
        error
      );
      throw error;
    }
  },

  // Get wishlist items
  getWishlist: async (page = 1, limit = 20): Promise<any> => {
    try {
      const response = await api.get(`/api/wishlist`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching wishlist:`, error);
      throw error;
    }
  },

  // Get Top Sellers
  getTopSellers: async (): Promise<any> => {
    try {
      const response = await api.get(`/api/buyers/top-sellers`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching top sellers:`, error);
      throw error;
    }
  },
};
