// services/UserService.ts
import { getAuthToken } from "@/utils/loginAuth";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  phone: string;
  nin: string;
  businessName: string;
  villageOrLocalMarket: string;
  interests: string[];
  roles: string[];
  activeRole: string;
  isVerified: boolean;
  lastResendAt: string | null;
  resendCountToday: number;
  __v: number;
}

// Create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn("⚠️ No auth token found. User may not be authenticated.");
    return { "Content-Type": "application/json" };
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const userService = {
  // GET /api/profile - Get current user profile
  getCurrentUser: async (): Promise<UserProfile> => {
    try {
      console.log("🔄 Fetching current user profile...");
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });

      console.log("✅ User profile response:", response.data);

      // Your API returns the user object directly
      const userData = response.data.user || response.data;

      if (!userData || !userData._id) {
        throw new Error("Invalid user response format");
      }

      return userData;
    } catch (error: any) {
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

    const farmerManagementRoles = [
      "admin",
      "agent",
    ];
    return farmerManagementRoles.includes(user.activeRole);
  },
};
