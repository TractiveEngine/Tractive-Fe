import api from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";

export interface Owner {
  id: string;
  _id?: string;
  name: string;
  email: string;
  activeRole: string;
  country?: string;
  state?: string;
  phone?: string;
  address?: string;
  roles?: string[];
  isFollowing?: boolean;
  rating?: number;
}


export interface Farmer {
  id: string;
  name: string;
  businessName?: string;
  phone?: string;
  country?: string;
  state?: string;
  address?: string;
  approvalStatus?: string;
}

export interface ReviewSummary {
  count: number;
  averageRating: number;
}

export interface BidSummary {
  count: number;
  leadingBid?: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    buyer: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  images: string[];
  videos?: string[];
  farmerId?: string;
  status: "available" | "out_of_stock" | "discontinued";
  createdAt?: string;
  updatedAt?: string;
  stock?: string;
  rating?: string;
  reviews?: number;
  unit?: string;
  discount?: number;
  // New fields
  owner?: Owner;
  farmer?: Farmer;
  reviewSummary?: ReviewSummary;
  bidSummary?: BidSummary;
  recentReviews?: any[];
  isWishlisted?: boolean;
}

// ... (Product, PaginationMeta, ProductsResponse, SearchFilters interfaces remain the same)
export interface Product extends ApiProduct {
  checked: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ProductsResponse {
  products: ApiProduct[];
  pagination: PaginationMeta;
  total: number;
  page: number;
  limit: number;
}

export interface TopSellingProduct {
  productId: string;
  name: string;
  ordersCount: number;
  totalQuantity: number;
  totalAmount: number;
  price: number;
  unit: string;
}

export interface TopSellingResponse {
  success: boolean;
  data: TopSellingProduct[];
}

export interface SearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "available" | "out_of_stock" | "discontinued";
  category?: string;
  farmer?: string;
  owner?: string;
  minPrice?: number;
  maxPrice?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  full?: boolean;
  includeMedia?: boolean;
  year?: string;
  month?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  categories: string[];
  images: string[];
  farmer: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  images?: string[];
  videos?: string[];
}

export interface Bidder {
  id: string;
  name: string;
  avatar?: string;
  amount: number;
  timestamp?: string;
  isLeading?: boolean;
}

export interface BidRequest {
  amount: number;
  message: string;
}

export interface BidResponse {
  success: boolean;
  message: string;
  bid?: {
    id: string;
    amount: number;
    createdAt: string;
  };
}

// Handle API errors
const handleApiError = (error: any, operation: string) => {
  console.error(`❌ Error ${operation}:`, error);

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        console.warn("Session expired or unauthorized");
      }
      throw new Error("Authentication failed");
    }

    if (error.response?.status === 403) {
      throw new Error("Permission denied");
    }

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
  }

  throw new Error(`Failed to ${operation}`);
};

// Map backend product to frontend format
const mapBackendToFrontendProduct = (backendProduct: any): ApiProduct => {
  const mapOwner = (owner: any): Owner | undefined => {
    if (!owner) return undefined;
    return {
      id: owner._id || owner.id,
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      activeRole: owner.activeRole,
      country: owner.country,
      state: owner.state,
      phone: owner.phone,
      address: owner.address,
      roles: owner.roles,
      isFollowing: owner.isFollowing,
    };

  };

  const mapFarmer = (farmer: any): Farmer | undefined => {
    if (!farmer) return undefined;
    return {
      id: farmer._id || farmer.id,
      name: farmer.name,
      businessName: farmer.businessName,
      phone: farmer.phone,
      country: farmer.country,
      state: farmer.state,
      address: farmer.address,
      approvalStatus: farmer.approvalStatus,
    };
  };

  return {
    id: backendProduct._id || backendProduct.id,
    name: backendProduct.name || "",
    description: backendProduct.description || "",
    price: backendProduct.price || 0,
    quantity: backendProduct.quantity || 0,
    categories: backendProduct.categories || [],
    images: backendProduct.images || [],
    videos: backendProduct.videos || [],
    farmerId:
      backendProduct.owner?._id ||
      backendProduct.farmer?._id ||
      backendProduct.farmerId,
    status:
      backendProduct.status === "active"
        ? "available"
        : backendProduct.status || "available",
    createdAt: backendProduct.createdAt,
    updatedAt: backendProduct.updatedAt,
    stock: backendProduct.quantity?.toString() || "0",
    rating: backendProduct.reviewSummary?.averageRating?.toString() || "0",
    reviews: backendProduct.reviewSummary?.count || 0,
    unit: backendProduct.unit || "",
    discount: backendProduct.discount,
    owner: mapOwner(backendProduct.owner),
    farmer: mapFarmer(backendProduct.farmer),
    reviewSummary: backendProduct.reviewSummary,
    bidSummary: backendProduct.bidSummary,
    recentReviews: backendProduct.recentReviews,
    isWishlisted: backendProduct.isWishlisted,
  };
};

export const productService = {
  // GET /api/products - Get products with filters
  getProducts: async (
    filters: SearchFilters = {},
  ): Promise<ProductsResponse> => {
    try {
      console.log("🚀 Fetching products with filters:", filters);

      const params: any = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...filters,
      };

      const response = await api.get("/api/products", {
        params,
      });

      console.log("✅ Products fetched successfully:", response.data);

      let mappedProducts: ApiProduct[] = [];
      const data = response.data.data || [];
      const pagination = response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
      };

      if (Array.isArray(data)) {
        mappedProducts = data.map(mapBackendToFrontendProduct);
      }

      return {
        products: mappedProducts,
        pagination,
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
      };
    } catch (error) {
      return handleApiError(error, "fetch products");
    }
  },

  // GET /api/products/:id - Get single product
  getProduct: async (id: string): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Fetching product details for ${id}`);

      const response = await api.get(`/api/products/${id}`);

      console.log("✅ Product details fetched:", response.data);
      const productData =
        response.data.data || response.data.product || response.data;
      return mapBackendToFrontendProduct(productData);
    } catch (error) {
      return handleApiError(error, "fetch product details");
    }
  },

  // GET /api/product/:id/similar - Get similar products
  getSimilarProducts: async (id: string): Promise<ApiProduct[]> => {
    try {
      console.log(`🚀 Fetching similar products for ${id}`);

      const response = await api.get(`/api/products/${id}/similar`);

      console.log("✅ Similar products fetched:", response.data);
      let mappedProducts: ApiProduct[] = [];
      const data = response.data.data || response.data.products || response.data || [];
      
      if (Array.isArray(data)) {
        mappedProducts = data.map(mapBackendToFrontendProduct);
      }
      
      return mappedProducts;
    } catch (error) {
      console.error("Failed to fetch similar products:", error);
      return []; // Return empty array to not break UI on error
    }
  },

  // Get Pending Products
  getPendingProducts: async (): Promise<ProductsResponse> => {
    try {
      const response = await api.get("/api/farmers/products/pending");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending products:", error);
      throw error;
    }
  },

  // Get Top Selling Products
  getTopSellingProducts: async (): Promise<TopSellingResponse> => {
    try {
      const response = await api.get("/api/buyers/top-selling");
      return response.data;
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      throw error;
    }
  },

  // GET /api/products/out-of-stock - Get out-of-stock products
  getOutOfStockProducts: async (
    filters: Omit<SearchFilters, "status"> = {},
  ): Promise<ProductsResponse> => {
    try {
      console.log("🚀 Fetching out-of-stock products:", filters);

      const params: any = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...filters,
      };

      const response = await api.get("/api/products/out-of-stock", {
        params,
      });

      console.log("✅ Out-of-stock products fetched:", response.data);

      let mappedProducts: ApiProduct[] = [];
      const data =
        response.data.data || response.data.products || response.data;
      const pagination = response.data.pagination || {
        page: 1,
        limit: 10,
        total: Array.isArray(data) ? data.length : 0,
      };

      if (Array.isArray(data)) {
        mappedProducts = data.map(mapBackendToFrontendProduct);
      }

      return {
        products: mappedProducts,
        pagination,
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
      };
    } catch (error) {
      return handleApiError(error, "fetch out-of-stock products");
    }
  },

  // POST /api/products - Create product
  createProduct: async (
    productData: CreateProductData,
  ): Promise<ApiProduct> => {
    try {
      console.log("🚀 Creating product:", productData);

      const response = await api.post("/api/products", productData);

      console.log("✅ Product created:", response.data);
      return mapBackendToFrontendProduct(
        response.data.product || response.data,
      );
    } catch (error) {
      return handleApiError(error, "create product");
    }
  },

  // PATCH /api/products/:id/status - Update product status
  updateProductStatus: async (
    id: string,
    status: "available" | "out_of_stock" | "discontinued",
  ): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Updating product ${id} status to:`, status);

      // Changed to PATCH as requested
      const response = await api.patch(`/api/products/${id}`, {
        status,
      });

      console.log("✅ Product status updated:", response.data);
      return mapBackendToFrontendProduct(
        response.data.product || response.data,
      );
    } catch (error) {
      return handleApiError(error, "update product status");
    }
  },

  // PUT /api/products/:id - Update product (Full Update)
  updateProduct: async (
    id: string,
    data: UpdateProductData,
  ): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Updating product ${id} (PUT):`, data);

      const response = await api.put(`/api/products/${id}`, data);

      console.log("✅ Product updated:", response.data);
      const updated =
        response.data.data || response.data.product || response.data;
      return mapBackendToFrontendProduct(updated);
    } catch (error) {
      return handleApiError(error, "update product");
    }
  },

  // DELETE /api/products/:id - Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      console.log(`🚀 Deleting product ${id}`);

      await api.delete(`/api/products/${id}`);

      console.log("✅ Product deleted successfully");
    } catch (error) {
      return handleApiError(error, "delete product");
    }
  },

  // POST /api/products/bulk/delete
  deleteMultipleProducts: async (ids: string[]): Promise<void> => {
    try {
      console.log(`🚀 Bulk deleting ${ids.length} products`);

      await api.post("/api/products/bulk/delete", { productIds: ids });

      console.log("✅ All products deleted successfully");
    } catch (error) {
      return handleApiError(error, "bulk delete products");
    }
  },

  // PUT /api/products/bulk/status
  updateMultipleProductsStatus: async (
    ids: string[],
    status: "available" | "out_of_stock" | "discontinued",
  ): Promise<void> => {
    try {
      console.log(
        `🚀 Bulk updating ${ids.length} products status to: ${status}`,
      );

      // Changed to PUT as requested
      await api.put("/api/products/bulk/status", { products: ids, status });

      console.log("✅ All products status updated successfully");
    } catch (error) {
      return handleApiError(error, "bulk update product status");
    }
  },

  // GET /api/buyers/biddings - Get all buyers bidding on a product
  getBidders: async (productId: string): Promise<Bidder[]> => {
    try {
      console.log(`🚀 Fetching bidders for product ${productId}`);
      // Assuming productId is passed as a query param or part of the path.
      // The prompt says: GET /api/buyers/biddings
      // Be safer to send it as query param
      const response = await api.get("/api/buyers/biddings", {
        params: { productId },
      });

      console.log("✅ Bidders fetched:", response.data);
      return response.data.data || response.data || [];
    } catch (error) {
      // Return empty list instead of throwing to avoid breaking the UI for this section
      console.error("Failed to fetch bidders", error);
      return [];
    }
  },

  // GET /api/buyers/biddings/won - Get winning/leading bidder
  getWinningBidder: async (productId: string): Promise<Bidder | null> => {
    try {
      console.log(`🚀 Fetching winning bidder for product ${productId}`);
      const response = await api.get("/api/buyers/biddings/won", {
        params: { productId },
      });

      console.log("✅ Winning bidder fetched:", response.data);
      return response.data.data || response.data || null;
    } catch (error) {
      // It's okay if there is no winner yet
      return null;
    }
  },

  // POST /api/buyers/products/:id/bid - Place a bid
  placeBid: async (
    productId: string,
    data: BidRequest,
  ): Promise<BidResponse> => {
    try {
      console.log(`🚀 Placing bid for product ${productId}:`, data);
      const response = await api.post(
        `/api/buyers/products/${productId}/bid`,
        data,
      );

      console.log("✅ Bid placed successfully:", response.data);
      return {
        success: true,
        message: response.data.message || "Bid placed successfully",
        bid: response.data.bid,
      };
    } catch (error) {
      return handleApiError(error, "place bid");
    }
  },
};
