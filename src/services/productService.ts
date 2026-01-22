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
  status?: "active" | "out_of_stock";
}

// Handle API errors
const handleApiError = (error, operation: string) => {
  console.error(`❌ Error ${operation}:`, error);

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Let the session management handle this path, preventing forced reload loop
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
    farmerId: backendProduct.farmer || backendProduct.farmerId,
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
  // GET /api/product - Get products with filters
  getProducts: async (
    filters: SearchFilters = {},
  ): Promise<ProductsResponse> => {
    try {
      console.log("🚀 Fetching products with filters:", filters);

      const response = await api.get("/api/product", {
        params: filters,
        timeout: 10000,
      });

      console.log("✅ Products fetched successfully:", response.data);

      let mappedProducts: ApiProduct[] = [];

      if (Array.isArray(response.data.products)) {
        mappedProducts = response.data.products.map(
          mapBackendToFrontendProduct,
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

      if (Array.isArray(response.data.products)) {
        mappedProducts = response.data.products.map(
          mapBackendToFrontendProduct,
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

  // POST /api/product - Create product
  createProduct: async (
    productData: CreateProductData,
  ): Promise<ApiProduct> => {
    try {
      console.log("🚀 Creating product:", productData);

      const response = await api.post("/api/product", productData, {
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
    status: "active" | "out_of_stock",
  ): Promise<ApiProduct> => {
    try {
      console.log(`🚀 Updating product ${id} status to:`, status);

      const response = await api.patch(
        `/api/products/${id}/status`,
        { status, id },
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

      const response = await api.patch(
        `/api/products/${id}`,
        { ...data, id },
        {
          timeout: 15000,
        },
      );

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
    status: "active" | "out_of_stock",
  ): Promise<void> => {
    try {
      // If backend doesn't support bulk update, update sequentially
      console.log(
        `🚀 Bulk updating ${ids.length} products status to: ${status}`,
      );

      await Promise.all(
        ids.map((id) => productService.updateProductStatus(id, status)),
      );

      console.log("✅ All products status updated successfully");
    } catch (error) {
      return handleApiError(error, "bulk update product status");
    }
  },
};
