// services/productService.ts
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

export interface ApiProduct {
  id: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  quantity: string;
  stock: string;
  rating: string;
  reviews: number;
  status: "active" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
  categories?: any[];
  owner?: string;
  videos?: string[];
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
  year?: string;
  month?: string;
  status?: "active" | "out_of_stock";
  page?: number;
  limit?: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  quantity?: string;
  stock?: string;
  rating?: string;
  status?: "active" | "out_of_stock";
  categories?: any[];
  images?: string[];
  reviews?: number;
}

// Helper function to get auth token - check multiple possible locations
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  // Check multiple possible token storage locations
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    null
  );
};

// Helper function to create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token found. Check if user is logged in.");
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Safe mapper function that ensures serializable data
const mapBackendToFrontendProduct = (backendProduct: any): ApiProduct => {
  const safeProduct = {
    id: String(backendProduct._id || backendProduct.id || ""),
    images: Array.isArray(backendProduct.images) ? backendProduct.images : [],
    name: String(backendProduct.name || "-"),
    description: String(backendProduct.description || "-"),
    price: Number(backendProduct.price) || 0,
    quantity: String(backendProduct.quantity || "-"),
    stock: String(backendProduct.stock || backendProduct.quantity || "-"),
    rating: String(backendProduct.rating || "-"),
    reviews: Number(backendProduct.reviews) || 0,
    status:
      backendProduct.status === "out_of_stock"
        ? ("out_of_stock" as const)
        : ("active" as const),
    createdAt: backendProduct.createdAt
      ? new Date(backendProduct.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: backendProduct.updatedAt
      ? new Date(backendProduct.updatedAt).toISOString()
      : new Date().toISOString(),
    categories: Array.isArray(backendProduct.categories)
      ? backendProduct.categories
      : [],
    owner: String(backendProduct.owner || "-"),
    videos: Array.isArray(backendProduct.videos) ? backendProduct.videos : [],
  };

  return safeProduct;
};

export const productService = {
  // GET /api/products — List products
  getProducts: async (
    filters: SearchFilters = {}
  ): Promise<ProductsResponse> => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_URL}/api/products?${params}`);

      let mappedProducts: ApiProduct[] = [];

      if (Array.isArray(response.data.products)) {
        mappedProducts = response.data.products.map((product: any) =>
          mapBackendToFrontendProduct(product)
        );
      }

      return {
        products: mappedProducts,
        total: Number(response.data.total) || 0,
        page: Number(response.data.page) || 1,
        limit: Number(response.data.limit) || 10,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        products: [],
        total: 0,
        page: 1,
        limit: 10,
      };
    }
  },

  // GET /api/products/{id} — Get product by ID
  getProduct: async (id: string): Promise<ApiProduct> => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      // Based on your API route, response should be { product: ... }
      return mapBackendToFrontendProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return mapBackendToFrontendProduct({});
    }
  },

  // PATCH /api/products/{id} — Update product (admin/agent only)
  updateProduct: async (
    id: string,
    data: UpdateProductData
  ): Promise<ApiProduct> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in to update products.");
      }

      console.log(`Updating product ${id} with data:`, data);
      console.log(`Using token: ${token.substring(0, 20)}...`);

      const response = await axios.patch(
        `${API_URL}/api/products/${id}`,
        data,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Update response:", response.data);

      // Based on your API route, response should be { product: ... }
      return mapBackendToFrontendProduct(response.data.product);
    } catch (error: any) {
      console.error("Error updating product:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        switch (status) {
          case 401:
            throw new Error("Authentication failed. Please log in again.");
          case 403:
            throw new Error(
              "You don't have permission to update products. Admin or agent role required."
            );
          case 404:
            throw new Error("Product not found.");
          default:
            throw new Error(`Update failed: ${message}`);
        }
      }

      throw new Error("Failed to update product. Please try again.");
    }
  },

  // Client-side delete simulation (since no DELETE endpoint exists)
  deleteProduct: async (id: string): Promise<void> => {
    console.log(`Product with ID ${id} deleted (client-side simulation).`);
    return Promise.resolve();
  },

  // Update product status using PATCH endpoint
  updateProductStatus: async (
    id: string,
    status: "active" | "out_of_stock"
  ): Promise<ApiProduct> => {
    return productService.updateProduct( id, {status} );
  },

  // Client-side bulk operations (since no bulk endpoints exist)
  deleteMultipleProducts: async (ids: string[]): Promise<void> => {
    console.log(
      `Products with IDs [${ids.join(", ")}] deleted (client-side simulation).`
    );
    return Promise.resolve();
  },

  updateMultipleProductsStatus: async (
    ids: string[],
    status: "active" | "out_of_stock"
  ): Promise<void> => {
    console.log(
      `Products with IDs [${ids.join(
        ", "
      )}] updated to status ${status} (client-side simulation).`
    );
    return Promise.resolve();
  },
};
