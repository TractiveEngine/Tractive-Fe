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
import {
  useProducts,
  useDeleteProduct,
  useUpdateProductStatus,
  useBulkDeleteProducts,
  useBulkUpdateStatus,
} from "@/hooks/queries/useProductQueries";
import { EditProductModal } from "./EditProductModal";
import { toast } from "sonner";
import { getAuthToken } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  filters: SearchFilters;
  onProductsUpdate: (counts: {
    active?: number;
    out_of_stock?: number;
  }) => void;
  onSelectionUpdate?: (selectedIds: string[]) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  filters,
  onProductsUpdate,
  onSelectionUpdate,
}) => {
  const router = useRouter();

  // Use React Query hook for data fetching
  const { data, isLoading, isError, error, refetch } = useProducts(filters);
  const deleteProductMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();
  const bulkDeleteMutation = useBulkDeleteProducts();
  const bulkUpdateStatusMutation = useBulkUpdateStatus();

  const allProducts = data?.products || [];

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk actions loading state
  const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // When data changes, update the parent with total count for the current filter
  useEffect(() => {
    if (data?.total !== undefined) {
      if (filters.status === "available") {
        // Changed from 'active'
        onProductsUpdate({ active: data.total });
      } else if (filters.status === "out_of_stock") {
        onProductsUpdate({ out_of_stock: data.total });
      }
    }
  }, [data?.total, filters.status, onProductsUpdate]);

  // Derive products with checked state for rendering
  const products = useMemo(() => {
    return allProducts.map((p) => ({
      ...p,
      checked: selectedIds.has(p.id),
    }));
  }, [allProducts, selectedIds]);

  // Notify parent component of selection changes
  useEffect(() => {
    if (onSelectionUpdate) {
      onSelectionUpdate(Array.from(selectedIds));
    }
  }, [selectedIds, onSelectionUpdate]);

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
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Handle select all checkbox
  const handleSelectAll = useCallback(() => {
    if (allProducts.length === 0) return;

    // Check if all are currently selected
    const allSelected = allProducts.every((p) => selectedIds.has(p.id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set(allProducts.map((p) => p.id));
      setSelectedIds(newSet);
    }
  }, [allProducts, selectedIds]);

  // Close edit modal
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Function to handle edit - opens modal
  const handleEdit = useCallback(
    (id: string) => {
      const productToEdit = allProducts.find((product) => product.id === id);
      if (productToEdit) {
        setSelectedProduct({
          ...productToEdit,
          checked: selectedIds.has(productToEdit.id),
        });
        setIsEditModalOpen(true);
        setActiveMenu(null);
      }
    },
    [allProducts, selectedIds],
  );

  // Handle product update from modal
  const handleProductUpdate = useCallback(() => {
    refetch(); // Refetch to update list
    handleCloseEditModal();
  }, [refetch, handleCloseEditModal]);

  // Function to handle delete single product

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;
      deleteProductMutation.mutate(id);
      setActiveMenu(null);
    },
    [deleteProductMutation],
  );

  // Function to handle status change (out of stock / back in stock)
  const handleOutOfStock = useCallback(
    async (id: string) => {
      const product = allProducts.find((p) => p.id === id);
      if (!product) return;

      const newStatus =
        product.status === "available" ? "out_of_stock" : "available";
      updateStatusMutation.mutate({ id, status: newStatus });
      setActiveMenu(null);
    },
    [allProducts, updateStatusMutation],
  );

  // ... (edit handlers remain - uses service directly or we can add mutation for it later, but scope mainly focused on list actions)

  // BULK DELETE
  const handleBulkDelete = useCallback(async () => {
    const selectedIds = products
      .filter((product) => product.checked)
      .map((product) => product.id);

    if (selectedIds.length === 0) {
      toast.error("Please select products to delete");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} product(s)?`,
      )
    )
      return;

    setBulkActionLoading(true);
    bulkDeleteMutation.mutate(selectedIds, {
      onSettled: () => {
        setBulkActionLoading(false);
        setSelectedIds(new Set());
      },
    });
  }, [products, bulkDeleteMutation]);

  // BULK STATUS UPDATE - Mark multiple products as out of stock
  const handleBulkMarkOutOfStock = useCallback(async () => {
    const selectedIds = products
      .filter((product) => product.checked)
      .map((product) => product.id);

    if (selectedIds.length === 0) {
      toast.error("Please select products");
      return;
    }

    setBulkActionLoading(true);
    bulkUpdateStatusMutation.mutate(
      { ids: selectedIds, status: "out_of_stock" },
      {
        onSettled: () => {
          setBulkActionLoading(false);
          setSelectedIds(new Set());
        },
      },
    );
  }, [products, bulkUpdateStatusMutation]);

  // BULK STATUS UPDATE - Mark multiple products as back in stock
  const handleBulkMarkInStock = useCallback(async () => {
    const selectedIds = products
      .filter((product) => product.checked)
      .map((product) => product.id);

    if (selectedIds.length === 0) {
      toast.error("Please select products");
      return;
    }

    setBulkActionLoading(true);
    bulkUpdateStatusMutation.mutate(
      { ids: selectedIds, status: "available" },
      {
        onSettled: () => {
          setBulkActionLoading(false);
          setSelectedIds(new Set());
        },
      },
    );
  }, [products, bulkUpdateStatusMutation]);

  // Get selected count
  const selectedCount = useMemo(
    () => products.filter((p) => p.checked).length,
    [products],
  );

  // Loading state
  if (isLoading) {
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
        <p className="font-montserrat mb-3">
          {error.message || "An error occurred"}
        </p>
        <button
          onClick={() => refetch()}
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
          {filters.status === "available"
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
                Stock
              </th>
              {/* <th className="py-1.5 px-4 min-w-[100px] lg:table-cell font-montserrat font-normal">
                Stock
              </th>
              <th className="py-1.5 px-4 min-w-[100px] md:table-cell font-montserrat font-normal">
                Reviews
              </th> */}
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

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
        onProductUpdate={handleProductUpdate}
      />
    </>
  );
};


// {
//   "name": "Farmer John",
//   "phone": "+2348055555555",
//   "businessName": "John Farms",
//   "address": "Farm Village, Kaduna",
//   "country": "Nigeria",
//   "state": "Kaduna",
//   "lga": "Ikeja",
//   "villageOrLocalMarket": "Sabon Gari Market"
// }