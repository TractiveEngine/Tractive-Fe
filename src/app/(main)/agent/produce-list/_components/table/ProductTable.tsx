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
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Use ref to track if we've already called onProductsUpdate to prevent loops
  const lastCountsRef = useRef<{ active: number; out_of_stock: number }>({
    active: 0,
    out_of_stock: 0,
  });

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Memoize counts calculation
  const productCounts = useMemo(() => {
    const activeCount = allProducts.filter((p) => p.status === "active").length;
    const outOfStockCount = allProducts.filter(
      (p) => p.status === "out_of_stock"
    ).length;
    return { active: activeCount, out_of_stock: outOfStockCount };
  }, [allProducts]);

  // Only call onProductsUpdate when counts actually change (use ref to prevent loops)
  useEffect(() => {
    const { active, out_of_stock } = productCounts;
    const lastCounts = lastCountsRef.current;

    if (
      lastCounts.active !== active ||
      lastCounts.out_of_stock !== out_of_stock
    ) {
      lastCountsRef.current = { active, out_of_stock };
      onProductsUpdate({ active, out_of_stock });
    }
  }, [productCounts.active, productCounts.out_of_stock]); // Only depend on the actual values, not the callback

  // Apply filters - completely separate from onProductsUpdate
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      setProducts([]);
      return;
    }

    let filteredProducts = [...allProducts];

    // Apply status filter
    if (filters.status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === filters.status
      );
    }

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

    setProducts(filteredProducts);
  }, [
    allProducts,
    filters.status,
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

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProducts();

      const productsWithUiState: Product[] = response.products.map(
        (product) => ({
          ...product,
          checked: false,
        })
      );

      setAllProducts(productsWithUiState);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle copy ID to clipboard
  const copyToClipboard = useCallback((id: string) => {
    navigator.clipboard.writeText(id);
    alert(`Copied ID: ${id}`);
  }, []);

  // Function to handle checkbox toggle
  const handleCheckboxChange = useCallback((id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, checked: !product.checked } : product
      )
    );
  }, []);

  // Function to handle delete single product using API
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productService.deleteProduct(id);

      setAllProducts((prevAllProducts) =>
        prevAllProducts.filter((product) => product.id !== id)
      );
      setActiveMenu(null);

      alert("Product deleted successfully");
    } catch (error) {
      alert("Failed to delete product");
      console.error("Delete error:", error);
    }
  }, []);

  // Updated Function to handle edit - now opens modal
  const handleEdit = useCallback((id: string) => {
    const productToEdit = allProducts.find((product) => product.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setIsEditModalOpen(true);
      setActiveMenu(null);
    }
  }, [allProducts]);

  // Handle product update from modal
  const handleProductUpdate = useCallback((updatedProduct: Product) => {
    // Update both allProducts and products arrays
    setAllProducts((prevAllProducts) =>
      prevAllProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  }, []);

  // Close edit modal
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Function to handle out of stock
  const handleOutOfStock = useCallback(async (id: string) => {
    try {
      await productService.updateProductStatus(id, "out_of_stock");

      setAllProducts((prevAllProducts) =>
        prevAllProducts.map((product) =>
          product.id === id
            ? { ...product, status: "out_of_stock" as const }
            : product
        )
      );

      setActiveMenu(null);
      alert("Product marked as out of stock");
    } catch (error) {
      alert("Failed to update product status");
      console.error("Out of stock error:", error);
    }
  }, []);

  // Function to handle back in stock
  const handleBackInStock = useCallback(async (id: string) => {
    try {
      await productService.updateProductStatus(id, "active");

      setAllProducts((prevAllProducts) =>
        prevAllProducts.map((product) =>
          product.id === id
            ? { ...product, status: "active" as const }
            : product
        )
      );

      setActiveMenu(null);
      alert("Product marked as active");
    } catch (error) {
      alert("Failed to update product status");
      console.error("Back in stock error:", error);
    }
  }, []);

  // Handle select all checkbox
  const handleSelectAll = useCallback(() => {
    const allChecked = products.length > 0 && products.every((p) => p.checked);
    setProducts((prevProducts) =>
      prevProducts.map((p) => ({ ...p, checked: !allChecked }))
    );
  }, [products]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#538e53]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchAllProducts}
          className="mt-4 px-4 py-2 bg-[#538e53] text-white rounded hover:bg-[#467846]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 text-gray-500">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <>
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
                    className="w-5 h-5 rounded border-[1px] border-gray-300 text-[#538e53] focus:ring-[#538e53] focus:ring-[1px] appearance-none checked:bg-[#538e53] checked:border-[#538e53] touch:p-2"
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
                handleOutOfStock={
                  filters.status === "active"
                    ? handleOutOfStock
                    : handleBackInStock
                }
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