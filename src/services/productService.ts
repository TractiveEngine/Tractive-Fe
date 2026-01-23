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
  farmerId?: string;
  status: "available" | "out_of_stock"; // Changed from 'active' to 'available'
  createdAt?: string;
  updatedAt?: string;
  // Optional fields that might be in your UI
  stock?: string;
  rating?: string;
  reviews?: number;
  unit?: string; // Added unit from API response
}

export interface Product extends ApiProduct {
  checked: boolean;
}

export interface ProductsResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchFilters {
  search?: string;
  status?: "available" | "out_of_stock"; // Changed from 'active' to 'available'
  year?: string;
  month?: string;
  page?: number;
  limit?: number;
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
  quantity?: string | number;
  unit?: string;
  stock?: string | number;
  rating?: string | number;
  categories?: string[];
  images?: string[];
  status?: "available" | "out_of_stock";
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

      const response = await api.get("/api/products", {
        params: filters,
        timeout: 10000,
      });

      console.log("✅ Products fetched successfully:", response.data);

      let mappedProducts: ApiProduct[] = [];

      // Handle different response structures for robustness
      const rawProducts = response.data.products || response.data;

      if (Array.isArray(rawProducts)) {
        mappedProducts = rawProducts.map(mapBackendToFrontendProduct);
      }

      return {
        products: mappedProducts,
        total: response.data.total || mappedProducts.length,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      return handleApiError(error, "fetch products");
    }
  },

  // GET /api/products/out-of-stock - Get out-of-stock products
  getOutOfStockProducts: async (
    filters: Omit<SearchFilters, "status"> = {},
  ): Promise<ProductsResponse> => {
    try {
      console.log("🚀 Fetching out-of-stock products:", filters);

      const response = await api.get("/api/products/out-of-stock", {
        params: filters,
        timeout: 10000,
      });

      console.log("✅ Out-of-stock products fetched:", response.data);

      let mappedProducts: ApiProduct[] = [];
      const rawProducts = response.data.products || response.data;

      if (Array.isArray(rawProducts)) {
        mappedProducts = rawProducts.map(mapBackendToFrontendProduct);
      }

      return {
        products: mappedProducts,
        total: response.data.total || mappedProducts.length,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
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

      const response = await api.post("/api/products", productData, {
        timeout: 30000,
      });

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
    status: "available" | "out_of_stock",
  ): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Updating product ${id} status to:`, status);

      const response = await api.patch(
        `/api/products/${id}/status`,
        { status },
        {
          timeout: 10000,
        },
      );

      console.log("✅ Product status updated:", response.data);
      return mapBackendToFrontendProduct(
        response.data.product || response.data,
      );
    } catch (error) {
      return handleApiError(error, "update product status");
    }
  },

  // PATCH /api/products/:id - Update product (for edit modal)
  updateProduct: async (
    id: string,
    data: UpdateProductData,
  ): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Updating product ${id}:`, data);

      const response = await api.patch(`/api/products/${id}`, data, {
        timeout: 15000,
      });

      console.log("✅ Product updated:", response.data);
      return mapBackendToFrontendProduct(
        response.data.product || response.data,
      );
    } catch (error) {
      return handleApiError(error, "update product");
    }
  },

  // DELETE /api/products/:id - Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      console.log(`🚀 Deleting product ${id}`);

      await api.delete(`/api/products/${id}`, {
        timeout: 10000,
      });

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

  // PATCH /api/products/bulk/status
  updateMultipleProductsStatus: async (
    ids: string[],
    status: "available" | "out_of_stock",
  ): Promise<void> => {
    try {
      console.log(
        `🚀 Bulk updating ${ids.length} products status to: ${status}`,
      );

      await api.patch("/api/products/bulk/status", { products: ids, status });

      console.log("✅ All products status updated successfully");
    } catch (error) {
      return handleApiError(error, "bulk update product status");
    }
  },
};
