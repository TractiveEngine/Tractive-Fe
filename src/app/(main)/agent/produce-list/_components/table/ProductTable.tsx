// components/table/ProductTable.tsx
"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { ProductRow } from "./ProductRow";
import { TickIcon } from "./ProductRow";
import {
  Product,
  productService,
  SearchFilters,
  UpdateProductData,
} from "@/services/productService";
import { EditProductModal } from "./EditProductModal";
import { toast } from "sonner";
import { getAuthToken } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  filters: SearchFilters;
  onProductsUpdate: (counts: { active: number; out_of_stock: number }) => void;
  onSelectionUpdate?: (selectedIds: string[]) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  filters,
  onProductsUpdate,
  onSelectionUpdate,
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Bulk actions loading state
  const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Use ref to track if we've already called onProductsUpdate to prevent loops
  const lastCountsRef = useRef<{ active: number; out_of_stock: number }>({
    active: 0,
    out_of_stock: 0,
  });

  // Check authentication before doing anything
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      console.log("❌ No auth token found in ProductTable");
      toast.error("Please login to view products", {
        duration: 3000,
        position: "top-center",
      });
      router.push("/login");
      return;
    }
  }, [router]);

  // Fetch products with filters using the appropriate API
  useEffect(() => {
    fetchProducts();
  }, [filters.status]); // Refetch when status filter changes

  // Memoize counts calculation
  const productCounts = useMemo(() => {
    const activeCount = allProducts.filter((p) => p.status === "active").length;
    const outOfStockCount = allProducts.filter(
      (p) => p.status === "out_of_stock"
    ).length;
    return { active: activeCount, out_of_stock: outOfStockCount };
  }, [allProducts]);

  // Only call onProductsUpdate when counts actually change
  useEffect(() => {
    const { active, out_of_stock } = productCounts;
    const lastCounts = lastCountsRef.current;

    if (
      lastCounts.active !== active ||
      lastCounts.out_of_stock !== out_of_stock
    ) {
      console.log("📊 Product counts updated:", { active, out_of_stock });
      lastCountsRef.current = { active, out_of_stock };
      onProductsUpdate({ active, out_of_stock });
    }
  }, [productCounts.active, productCounts.out_of_stock, onProductsUpdate]);

  // Apply client-side filters
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      setProducts([]);
      return;
    }

    let filteredProducts = [...allProducts];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.id?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply year/month filter based on createdAt date
    if (filters.year || filters.month) {
      filteredProducts = filteredProducts.filter((product) => {
        if (!product.createdAt) return true;

        const productDate = new Date(product.createdAt);

        if (
          filters.year &&
          productDate.getFullYear().toString() !== filters.year
        ) {
          return false;
        }

        if (filters.month) {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const productMonth = monthNames[productDate.getMonth()];
          if (productMonth !== filters.month) {
            return false;
          }
        }

        return true;
      });
    }

    console.log(
      `🔍 Filtered ${filteredProducts.length} products from ${allProducts.length} total`
    );
    setProducts(filteredProducts);
  }, [
    allProducts,
    filters.search,
    filters.year,
    filters.month,
  ]);

  // Notify parent component of selection changes
  useEffect(() => {
    if (onSelectionUpdate) {
      const selectedIds = products
        .filter((product) => product.checked)
        .map((product) => product.id);
      onSelectionUpdate(selectedIds);
    }
  }, [products, onSelectionUpdate]);

  // Fetch products based on status filter
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🚀 Fetching products with status:", filters.status);

      let response;

      // Use the appropriate API based on status filter
      if (filters.status === "out_of_stock") {
        // Use dedicated out-of-stock API
        response = await productService.getOutOfStockProducts({
          search: filters.search,
          year: filters.year,
          month: filters.month,
          page: filters.page,
          limit: filters.limit,
        });
      } else {
        // Use general products API with status filter
        response = await productService.getProducts({
          status: filters.status,
          search: filters.search,
          year: filters.year,
          month: filters.month,
          page: filters.page,
          limit: filters.limit,
        });
      }

      console.log(`✅ Fetched ${response.products.length} products`);

      const productsWithUiState: Product[] = response.products.map(
        (product) => ({
          ...product,
          checked: false,
        })
      );

      setAllProducts(productsWithUiState);
    } catch (err: any) {
      console.error("❌ Error fetching products:", err);

      // Check if it's an auth error
      if (err.message === "Authentication failed") {
        // Already handled by productService
        return;
      }

      setError("Failed to fetch products");
      toast.error("Failed to load products. Please try again.", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle copy ID to clipboard
  const copyToClipboard = useCallback((id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied ID: ${id}`, {
      duration: 2000,
      position: "top-center",
    });
  }, []);

  // Function to handle checkbox toggle
  const handleCheckboxChange = useCallback((id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, checked: !product.checked } : product
      )
    );
  }, []);

  // Function to handle delete single product
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      console.log("🗑️ Deleting product:", id);

      await productService.deleteProduct(id);

      setAllProducts((prevAllProducts) =>
        prevAllProducts.filter((product) => product.id !== id)
      );
      setActiveMenu(null);

      toast.success("Product deleted successfully", {
        duration: 3000,
        position: "top-center",
      });

      console.log("✅ Product deleted successfully");
    } catch (error: any) {
      console.error("❌ Delete error:", error);
      toast.error(error.message || "Failed to delete product", {
        duration: 5000,
        position: "top-center",
      });
    }
  }, []);

  // Function to handle edit - opens modal
  const handleEdit = useCallback(
    (id: string) => {
      console.log("📝 Opening edit modal for product:", id);
      const productToEdit = allProducts.find((product) => product.id === id);
      if (productToEdit) {
        setSelectedProduct(productToEdit);
        setIsEditModalOpen(true);
        setActiveMenu(null);
      }
    },
    [allProducts]
  );

  // Handle product update from modal - uses updateProduct API
  const handleProductUpdate = useCallback(
    async (updatedData: UpdateProductData) => {
      if (!selectedProduct) return;

      try {
        console.log("✅ Updating product:", selectedProduct.id, updatedData);

        // Call the updateProduct API
        const updatedProduct = await productService.updateProduct(
          selectedProduct.id,
          updatedData
        );

        // Update both allProducts and products arrays
        setAllProducts((prevAllProducts) =>
          prevAllProducts.map((product) =>
            product.id === updatedProduct.id
              ? { ...updatedProduct, checked: product.checked }
              : product
          )
        );

        toast.success("Product updated successfully", {
          duration: 3000,
          position: "top-center",
        });

        // Close modal
        handleCloseEditModal();
      } catch (error: any) {
        console.error("❌ Update error:", error);
        toast.error(error.message || "Failed to update product", {
          duration: 5000,
          position: "top-center",
        });
      }
    },
    [selectedProduct]
  );

  // Close edit modal
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Function to handle status change (out of stock / back in stock)
  const handleOutOfStock = useCallback(
    async (id: string) => {
      try {
        // Determine current status and new status
        const product = allProducts.find((p) => p.id === id);
        if (!product) return;

        const newStatus =
          product.status === "active" ? "out_of_stock" : "active";
        const statusText =
          newStatus === "out_of_stock" ? "out of stock" : "back in stock";

        console.log(`🔄 Marking product ${id} as ${statusText}`);

        // Use updateProductStatus API
        const updatedProduct = await productService.updateProductStatus(
          id,
          newStatus
        );

        setAllProducts((prevAllProducts) =>
          prevAllProducts.map((product) =>
            product.id === id
              ? { ...updatedProduct, checked: product.checked }
              : product
          )
        );

        setActiveMenu(null);

        toast.success(`Product marked as ${statusText}`, {
          duration: 3000,
          position: "top-center",
        });

        console.log(`✅ Product status updated to ${newStatus}`);
      } catch (error: any) {
        console.error("❌ Status update error:", error);
        toast.error(error.message || "Failed to update product status", {
          duration: 5000,
          position: "top-center",
        });
      }
    },
    [allProducts]
  );

  // Handle select all checkbox
  const handleSelectAll = useCallback(() => {
    const allChecked = products.length > 0 && products.every((p) => p.checked);
    setProducts((prevProducts) =>
      prevProducts.map((p) => ({ ...p, checked: !allChecked }))
    );
  }, [products]);

  // BULK DELETE - Delete multiple selected products
  const handleBulkDelete = useCallback(async () => {
    const selectedIds = products
      .filter((product) => product.checked)
      .map((product) => product.id);

    if (selectedIds.length === 0) {
      toast.error("Please select products to delete", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} product(s)?`
      )
    )
      return;

    try {
      setBulkActionLoading(true);
      console.log("🗑️ Bulk deleting products:", selectedIds);

      // Use deleteMultipleProducts API
      await productService.deleteMultipleProducts(selectedIds);

      // Remove deleted products from state
      setAllProducts((prevAllProducts) =>
        prevAllProducts.filter((product) => !selectedIds.includes(product.id))
      );

      toast.success(`${selectedIds.length} product(s) deleted successfully`, {
        duration: 3000,
        position: "top-center",
      });

      console.log("✅ Bulk delete completed");
    } catch (error: any) {
      console.error("❌ Bulk delete error:", error);
      toast.error(error.message || "Failed to delete products", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setBulkActionLoading(false);
    }
  }, [products]);

  // BULK STATUS UPDATE - Mark multiple products as out of stock
  const handleBulkMarkOutOfStock = useCallback(async () => {
    const selectedIds = products
      .filter((product) => product.checked)
      .map((product) => product.id);

    if (selectedIds.length === 0) {
      toast.error("Please select products to mark as out of stock", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    try {
      setBulkActionLoading(true);
      console.log("🔄 Bulk marking products as out of stock:", selectedIds);

      // Use updateMultipleProductsStatus API
      await productService.updateMultipleProductsStatus(
        selectedIds,
        "out_of_stock"
      );

      // Update products in state
      setAllProducts((prevAllProducts) =>
        prevAllProducts.map((product) =>
          selectedIds.includes(product.id)
            ? { ...product, status: "out_of_stock" as const }
            : product
        )
      );

      toast.success(
        `${selectedIds.length} product(s) marked as out of stock`,
        {
          duration: 3000,
          position: "top-center",
        }
      );

      console.log("✅ Bulk status update completed");
    } catch (error: any) {
      console.error("❌ Bulk status update error:", error);
      toast.error(error.message || "Failed to update product status", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setBulkActionLoading(false);
    }
  }, [products]);

  // BULK STATUS UPDATE - Mark multiple products as back in stock
  const handleBulkMarkInStock = useCallback(async () => {
    const selectedIds = products
      .filter((product) => product.checked)
      .map((product) => product.id);

    if (selectedIds.length === 0) {
      toast.error("Please select products to mark as in stock", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    try {
      setBulkActionLoading(true);
      console.log("🔄 Bulk marking products as active:", selectedIds);

      // Use updateMultipleProductsStatus API
      await productService.updateMultipleProductsStatus(selectedIds, "active");

      // Update products in state
      setAllProducts((prevAllProducts) =>
        prevAllProducts.map((product) =>
          selectedIds.includes(product.id)
            ? { ...product, status: "active" as const }
            : product
        )
      );

      toast.success(`${selectedIds.length} product(s) marked as in stock`, {
        duration: 3000,
        position: "top-center",
      });

      console.log("✅ Bulk status update completed");
    } catch (error: any) {
      console.error("❌ Bulk status update error:", error);
      toast.error(error.message || "Failed to update product status", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setBulkActionLoading(false);
    }
  }, [products]);

  // Get selected count
  const selectedCount = useMemo(
    () => products.filter((p) => p.checked).length,
    [products]
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#538e53]"></div>
        <span className="ml-3 text-[#538e53] font-montserrat">
          Loading products...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-600">
        <p className="font-montserrat mb-3">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-[#538e53] text-white rounded hover:bg-[#467846] font-montserrat transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-12 text-gray-500">
        <p className="font-montserrat text-[16px] mb-2">No products found</p>
        <p className="font-montserrat text-[13px] text-gray-400">
          {filters.status === "active"
            ? "Add your first product to get started"
            : "No out of stock products"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-[#f0f7f0] rounded-lg border border-[#538e53] flex items-center justify-between"
        >
          <span className="font-montserrat text-[14px] text-[#2b2b2b]">
            {selectedCount} product(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkMarkOutOfStock}
              disabled={bulkActionLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-montserrat text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkActionLoading ? "Processing..." : "Mark Out of Stock"}
            </button>
            <button
              onClick={handleBulkMarkInStock}
              disabled={bulkActionLoading}
              className="px-4 py-2 bg-[#538e53] text-white rounded hover:bg-[#467846] font-montserrat text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkActionLoading ? "Processing..." : "Mark In Stock"}
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-montserrat text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkActionLoading ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="Table_Container"
      >
        <table className="Table_Style">
          <thead>
            <tr className="text-left text-[13px] font-normal font-montserrat text-[#2b2b2b] md:text-sm">
              <th className="py-3 pl-4 w-[50px] min-w-[50px]">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    checked={
                      products.length > 0 && products.every((p) => p.checked)
                    }
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-[1px] border-gray-300 text-[#538e53] focus:ring-[#538e53] focus:ring-[1px] appearance-none checked:bg-[#538e53] checked:border-[#538e53] touch:p-2 cursor-pointer"
                  />
                  {products.length > 0 && products.every((p) => p.checked) && (
                    <TickIcon />
                  )}
                </div>
              </th>
              <th className="py-1.5 px-4 min-w-[150px] font-montserrat font-normal">
                Item
              </th>
              <th className="py-1.5 px-4 min-w-[100px] sm:table-cell font-montserrat font-normal">
                ID
              </th>
              <th className="py-1.5 px-4 min-w-[100px] md:table-cell font-montserrat font-normal">
                Price
              </th>
              <th className="py-1.5 px-4 min-w-[100px] lg:table-cell font-montserrat font-normal">
                Quantity
              </th>
              <th className="py-1.5 px-4 min-w-[100px] lg:table-cell font-montserrat font-normal">
                Stock
              </th>
              <th className="py-1.5 px-4 min-w-[100px] md:table-cell font-montserrat font-normal">
                Reviews
              </th>
              <th className="py-1.5 px-4 min-w-[100px] md:table-cell font-montserrat font-normal">
                Categories
              </th>
              <th className="py-1.5 px-4 min-w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                index={index}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                copyToClipboard={copyToClipboard}
                handleCheckboxChange={handleCheckboxChange}
                handleEdit={handleEdit}
                handleOutOfStock={handleOutOfStock}
                handleDelete={handleDelete}
                isOutOfStockPage={filters.status === "out_of_stock"}
              />
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
        onProductUpdate={handleProductUpdate}
      />
    </>
  );
};