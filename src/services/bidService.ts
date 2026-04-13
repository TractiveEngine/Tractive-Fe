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
    email?: string;
    avatar?: string;
  };
  farmerId?: string;
  farmerName?: string;
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

export interface BidResponse {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    unit: string;
    owner: string;
    farmer: string | { _id: string; name: string; businessName: string };
    images: string[];
    videos: string[];
    status: string;
    discount: number;
    categories: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  buyer: {
    _id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  agent: string | {
    _id: string;
    email: string;
    roles: string[];
    activeRole: string;
    name: string;
    address: string;
    country: string;
    phone: string;
    state: string;
  };
  amount: number;
  status: "pending" | "approved" | "rejected" | "countered";
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WonBidsCheckoutResponse {
  bids: BidResponse[];
  productsSubtotal: number;
  localTransportTotal: number;
  totalAmount: number;
}

const handleApiError = (error: unknown, operation: string) => {
  console.error(`❌ Error ${operation}:`, error);
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Failed to ${operation}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToBidListing = (item: any): BidListing => {
  return {
    id: item?._id,
    productName: item?.product?.name || "Unknown Product",
    productImage: item?.product?.images?.[0] || "/images/placeholder.png",
    productDescription: item?.product?.description || "",
    productPrice: item?.product?.price || 0,
    proposedPrice: item?.amount || 0,
    quantity: item?.product?.quantity || 0, // Using product quantity as fallback if bid quantity missing
    message: item?.message,
    status: item?.status || "pending",
    buyer: {
      name: item?.buyer?.name || "Unknown Buyer",
      email: item?.buyer?.email,
      avatar: item?.buyer?.avatar, 
    },
    farmerId: typeof item?.product?.farmer === "object" ? item?.product?.farmer?._id : item?.product?.farmer,
    farmerName: typeof item?.product?.farmer === "object" ? item?.product?.farmer?.name : "Unknown Farmer",
    createdAt: item?.createdAt,
  };
};

export const bidService = {
  // GET /api/bids - Get all bids (listings)
  getBids: async (
    page = 1,
    limit = 10,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      let item = response.data.data || response.data;

      // Handle case where response is wrapped in "bid" object
      if (item.bid) {
        item = item.bid;
      }

      const listing = mapToBidListing(item);

      // Map nested bids if available, or fetch them if separate?
      // Assuming they come nested as 'bids' or 'buyers'
      // If single bid object is returned, treat as single bidder
      let rawBids = item.bids || item.buyers || [];
      
      if (rawBids.length === 0 && item.buyer) {
         rawBids = [item];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bids: SingleBid[] = rawBids.map((b: any) => ({
        id: b?._id || b?.id,
        bidderName: b?.buyer?.name || b?.bidderName || b?.user?.name || "Unknown Bidder",
        bidderAvatar: b?.buyer?.avatar || b?.bidderAvatar || b?.user?.avatar,
        amount: b?.amount || b?.proposedPrice || 0,
        quantity: b?.quantity || b?.product?.quantity || 0,
        message: b?.message || "",
        status: b?.status || "pending",
        date: b?.createdAt || b?.date,
      }));

      return {
        ...listing,
        bids,
      };
    } catch (error) {
      return handleApiError(error, "fetch bid details");
    }
  },

  // POST /api/bids - Create a new bid
  createBid: async (data: {
    productId: string;
    amount: number;
    quantity: number;
    message: string;
  }) => {
    try {
      const response = await api.post("/api/bids", data);
      return response.data;
    } catch (error) {
      // Improved error handling to return the message directly
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // PATCH /api/bids/{id} - Update bid status (Accept/Reject)
  updateBidStatus: async (
    id: string,
    updates: {
      status: "accepted" | "rejected";
    },
  ) => {
    try {
      const response = await api.patch(`/api/bids/${id}`, updates);
      return response.data;
    } catch (error) {
      return handleApiError(error, "update bid status");
    }
  },

  // GET /api/buyers/biddings - Get my biddings
  getMyBids: async (): Promise<BidResponse[]> => {
    try {
      const response = await api.get("/api/buyers/biddings");
      return response.data.data;
    } catch (error) {
      return handleApiError(error, "fetch my bids");
    }
  },

  // GET /api/buyers/biddings/won - Get won biddings
  getWonBids: async (): Promise<BidResponse[]> => {
    try {
      const response = await api.get("/api/buyers/biddings/won");
      const data = response.data.data;
      if (data && Array.isArray(data.bids)) {
        return data.bids;
      }
      return Array.isArray(data) ? data : [];
    } catch {
       return []; 
    }
  },

  // GET /api/buyers/biddings/won/checkout - Get won biddings for checkout
  getWonBidsCheckout: async (): Promise<WonBidsCheckoutResponse> => {
    try {
      const response = await api.get("/api/buyers/biddings/won/checkout");
      const data = response.data.data;
      const bids = data && Array.isArray(data.bids) ? data.bids : (Array.isArray(data) ? data : []);
      return {
        bids,
        productsSubtotal: data?.productsSubtotal ?? 0,
        localTransportTotal: data?.localTransportTotal ?? 0,
        totalAmount: data?.totalAmount ?? 0,
      };
    } catch (error) {
      return handleApiError(error, "fetch won bids checkout");
    }
  },
};
