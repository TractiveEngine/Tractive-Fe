import api from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  images: string[];
  videos?: string[]; // Added videos
  farmerId?: string;
  status: "available" | "out_of_stock" | "discontinued"; // Changed from 'active' to 'available'
  createdAt?: string;
  updatedAt?: string;
  // Optional fields that might be in your UI
  stock?: string;
  rating?: string;
  reviews?: number;
  unit?: string; // Added unit from API response
  discount?: number; // Added discount
}

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
  total: number; // Keeping for backward compat, mapped from pagination
  page: number;
  limit: number;
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
  discount?: number;
  images?: string[];
  videos?: string[];
}

// Handle API errors
const handleApiError = (error, operation: string) => {
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
const mapBackendToFrontendProduct = (backendProduct): ApiProduct => {
  return {
    id: backendProduct._id || backendProduct.id,
    name: backendProduct.name || "",
    description: backendProduct.description || "",
    price: backendProduct.price || 0,
    quantity: backendProduct.quantity || 0,
    categories: backendProduct.categories || [],
    images: backendProduct.images || [],
    videos: backendProduct.videos || [],
    // Map 'owner' or 'farmer' to farmerId
    farmerId:
      backendProduct.owner || backendProduct.farmer || backendProduct.farmerId,
    // Ensure status is correctly mapped if backend returns something else, but API says 'available'
    status:
      backendProduct.status === "active"
        ? "available"
        : backendProduct.status || "available",
    createdAt: backendProduct.createdAt,
    updatedAt: backendProduct.updatedAt,
    // Map additional fields for UI compatibility
    stock: backendProduct.quantity?.toString() || "0",
    rating: backendProduct.rating || "0",
    reviews: backendProduct.reviews || 0,
    unit: backendProduct.unit || "",
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

      // Changed to PUT as requested
      const response = await api.put(`/api/products/${id}/status`, {
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
};
