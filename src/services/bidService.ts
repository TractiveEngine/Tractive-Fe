import api from "@/lib/axios";
import axios from "axios";

export interface BidListing {
  id: string;
  productName: string;
  productImage: string;
  productDescription?: string;
  productPrice: number;
  proposedPrice: number;
  quantity: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "countered";
  buyer: {
    name: string;
    avatar?: string;
  };
  farmerId?: string;
  createdAt: string;
}

// ... (interfaces)
export interface SingleBid {
  id: string; // Bid ID
  bidderName: string;
  bidderAvatar?: string;
  amount: number;
  quantity: number;
  message: string;
  status: "pending" | "accepted" | "rejected" | "countered";
  date: string;
}

export interface BidListingDetails extends BidListing {
  bids: SingleBid[];
}

const handleApiError = (error: any, operation: string) => {
  console.error(`❌ Error ${operation}:`, error);
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Failed to ${operation}`);
};

const mapToBidListing = (item: any): BidListing => {
  return {
    id: item._id,
    productName: item.product?.name || "Unknown Product",
    productImage: item.product?.images?.[0] || "/images/placeholder.png",
    productDescription: item.product?.description || "",
    productPrice: item.product?.price || 0,
    proposedPrice: item.amount || 0,
    quantity: item.product?.quantity || 0, // Using product quantity as fallback if bid quantity missing
    message: item.message,
    status: item.status || "pending",
    buyer: {
      name: item.buyer?.name || "Unknown Buyer",
      avatar: item.buyer?.avatar, // JSON doesn't show avatar in buyer object, but interface allows it
    },
    farmerId: item.product?.farmer,
    createdAt: item.createdAt,
  };
};

export const bidService = {
  // GET /api/bids - Get all bids (listings)
  getBids: async (
    page = 1,
    limit = 10,
  ): Promise<{ data: BidListing[]; pagination: any }> => {
    try {
      const response = await api.get("/api/bids", { params: { page, limit } });
      const rawData = response.data.data || [];
      const data = rawData.map(mapToBidListing);
      return {
        data,
        pagination: response.data.pagination || {
          page,
          limit,
          total: data.length,
        },
      };
    } catch (error) {
      return handleApiError(error, "fetch bids");
    }
  },

  // GET /api/bids/{id} - Get single bid details (Listing with Bidders)
  getBidDetails: async (id: string): Promise<BidListingDetails> => {
    try {
      const response = await api.get(`/api/bids/${id}`);
      const item = response.data.data || response.data;

      const listing = mapToBidListing(item);

      // Map nested bids if available, or fetch them if separate?
      // Assuming they come nested as 'bids' or 'buyers'
      const rawBids = item.bids || item.buyers || [];
      const bids: SingleBid[] = rawBids.map((b: any) => ({
        id: b.id || b._id,
        bidderName: b.bidderName || b.user?.name || "Unknown Bidder",
        bidderAvatar: b.bidderAvatar || b.user?.avatar,
        amount: b.amount || b.proposedPrice || 0,
        quantity: b.quantity || 0,
        message: b.message || "",
        status: b.status || "pending",
        date: b.createdAt || b.date,
      }));

      return {
        ...listing,
        bids,
      };
    } catch (error) {
      return handleApiError(error, "fetch bid details");
    }
  },

  // POST /api/bids - Create a new bid listing
  createBid: async (data: {
    product: string;
    proposedPrice: number;
    quantity: number;
    message: string;
  }) => {
    try {
      const response = await api.post("/api/bids", data);
      return response.data;
    } catch (error) {
      return handleApiError(error, "create bid");
    }
  },

  // PATCH /api/bids/{id} - Update bid status (Accept/Reject/Counter)
  updateBidStatus: async (
    id: string,
    updates: {
      status: "accepted" | "rejected" | "countered";
      counterOffer?: number;
    },
  ) => {
    try {
      const response = await api.patch(`/api/bids/${id}`, updates);
      return response.data;
    } catch (error) {
      return handleApiError(error, "update bid status");
    }
  },
};
