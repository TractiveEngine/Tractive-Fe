// services/productService.ts
import axios from "axios";
import { getAuthToken } from "../utils/loginAuth";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  images: string[];
  farmerId?: string;
  status: "active" | "out_of_stock";
  createdAt?: string;
  updatedAt?: string;
  // Optional fields that might be in your UI
  stock?: string;
  rating?: string;
  reviews?: number;
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
  status?: "active" | "out_of_stock";
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
  categories: string[];
  images: string[];
  farmerId?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  quantity?: string | number;
  stock?: string | number;
  rating?: string | number;
  categories?: string[];
  images?: string[];
  status?: "active" | "out_of_stock";
}

// Auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token found. API calls may fail.");
    return {
      "Content-Type": "application/json",
    };
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Handle API errors
const handleApiError = (error, operation: string) => {
  console.error(`❌ Error ${operation}:`, error);

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("session");
      toast.error("Session expired. Please login again.", {
        duration: 3000,
        position: "top-center",
      });
      window.location.href = "/login";
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
    farmerId: backendProduct.farmerId,
    status: backendProduct.status || "active",
    createdAt: backendProduct.createdAt,
    updatedAt: backendProduct.updatedAt,
    // Map additional fields for UI compatibility
    stock: backendProduct.quantity?.toString() || "0",
    rating: backendProduct.rating || "0",
    reviews: backendProduct.reviews || 0,
  };
};

export const productService = {
  // GET /api/products - Get products with filters
  getProducts: async (
    filters: SearchFilters = {}
  ): Promise<ProductsResponse> => {
    try {
      console.log("🚀 Fetching products with filters:", filters);

      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const url = `${API_URL}/api/products?${params.toString()}`;
      console.log("📍 Request URL:", url);

      const response = await axios.get(url, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });

      console.log("✅ Products fetched successfully:", response.data);

      let mappedProducts: ApiProduct[] = [];

      if (Array.isArray(response.data.products)) {
        mappedProducts = response.data.products.map(
          mapBackendToFrontendProduct
        );
      } else if (Array.isArray(response.data)) {
        mappedProducts = response.data.map(mapBackendToFrontendProduct);
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
    filters: Omit<SearchFilters, "status"> = {}
  ): Promise<ProductsResponse> => {
    try {
      console.log("🚀 Fetching out-of-stock products:", filters);

      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const url = `${API_URL}/api/products/out-of-stock?${params.toString()}`;
      console.log("📍 Request URL:", url);

      const response = await axios.get(url, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });

      console.log("✅ Out-of-stock products fetched:", response.data);

      let mappedProducts: ApiProduct[] = [];

      if (Array.isArray(response.data.products)) {
        mappedProducts = response.data.products.map(
          mapBackendToFrontendProduct
        );
      } else if (Array.isArray(response.data)) {
        mappedProducts = response.data.map(mapBackendToFrontendProduct);
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
    productData: CreateProductData
  ): Promise<ApiProduct> => {
    try {
      console.log("🚀 Creating product:", productData);

      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: getAuthHeaders(),
          timeout: 30000,
        }
      );

      console.log("✅ Product created:", response.data);
      return mapBackendToFrontendProduct(
        response.data.product || response.data
      );
    } catch (error) {
      return handleApiError(error, "create product");
    }
  },

  // PATCH /api/products/:id/status - Update product status
  updateProductStatus: async (
    id: string,
    status: "active" | "out_of_stock"
  ): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Updating product ${id} status to:`, status);

      const response = await axios.patch(
        `${API_URL}/api/products/${id}/status`,
        { status },
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );

      console.log("✅ Product status updated:", response.data);
      return mapBackendToFrontendProduct(
        response.data.product || response.data
      );
    } catch (error) {
      return handleApiError(error, "update product status");
    }
  },

  // PATCH /api/products/:id - Update product (for edit modal)
  updateProduct: async (
    id: string,
    data: UpdateProductData
  ): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Updating product ${id}:`, data);

      const response = await axios.patch(
        `${API_URL}/api/products/${id}`,
        data,
        {
          headers: getAuthHeaders(),
          timeout: 15000,
        }
      );

      console.log("✅ Product updated:", response.data);
      return mapBackendToFrontendProduct(
        response.data.product || response.data
      );
    } catch (error) {
      return handleApiError(error, "update product");
    }
  },

  // DELETE /api/products/:id - Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      console.log(`🚀 Deleting product ${id}`);

      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });

      console.log("✅ Product deleted successfully");
    } catch (error) {
      return handleApiError(error, "delete product");
    }
  },

  // Bulk operations (you might need to implement these on backend or handle sequentially)
  deleteMultipleProducts: async (ids: string[]): Promise<void> => {
    try {
      // If backend doesn't support bulk delete, delete sequentially
      console.log(`🚀 Bulk deleting ${ids.length} products`);

      await Promise.all(ids.map((id) => productService.deleteProduct(id)));

      console.log("✅ All products deleted successfully");
    } catch (error) {
      return handleApiError(error, "bulk delete products");
    }
  },

  updateMultipleProductsStatus: async (
    ids: string[],
    status: "active" | "out_of_stock"
  ): Promise<void> => {
    try {
      // If backend doesn't support bulk update, update sequentially
      console.log(
        `🚀 Bulk updating ${ids.length} products status to: ${status}`
      );

      await Promise.all(
        ids.map((id) => productService.updateProductStatus(id, status))
      );

      console.log("✅ All products status updated successfully");
    } catch (error) {
      return handleApiError(error, "bulk update product status");
    }
  },
};
