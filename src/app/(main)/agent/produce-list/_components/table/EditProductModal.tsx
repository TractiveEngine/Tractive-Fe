// components/modals/EditProductModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Product,
  productService,
  UpdateProductData,
} from "@/services/productService";
import { toast } from "sonner";
import { getAuthToken } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdate: (updatedProduct: Product) => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdate,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<UpdateProductData>({
    name: "",
    description: "",
    price: 0,
    quantity: "",
    stock: "",
    rating: "",
    status: "available",
    unit: "",
    categories: [],
  });
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (isOpen) {
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to edit products", {
          duration: 3000,
          position: "top-center",
        });
        router.push("/login");
        onClose();
      }
    }
  }, [isOpen, router, onClose]);

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      console.log("📝 Initializing edit form with product:", product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        quantity: product.quantity || "",
        stock: product.stock || "",
        rating: product.rating || "",
        status: product.status || "available",
        unit: product.unit || "",
        categories: Array.isArray(product.categories) ? product.categories : [],
      });
      setCategoryInput("");
      setError(null);
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddCategory = () => {
    if (
      categoryInput.trim() &&
      !formData.categories?.includes(categoryInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), categoryInput.trim()],
      }));
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories:
        prev.categories?.filter((cat) => cat !== categoryToRemove) || [],
    }));
  };

  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    // Validate required fields
    if (!formData.name?.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setError("Valid price is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🚀 Updating product:", product.id, formData);

      // Use PATCH method to update the product
      const updatedProduct = await productService.updateProduct(
        product.id,
        formData,
      );

      console.log("✅ Product updated successfully:", updatedProduct);

      // Create updated product with UI state preserved
      const productWithUIState: Product = {
        ...updatedProduct,
        checked: product.checked, // Preserve the checked state
      };

      onProductUpdate(productWithUIState);
      onClose();
    } catch (err) {
      console.error("❌ Error updating product:", err);
      setError(err.message || "Failed to update product. Please try again.");
      toast.error(err.message || "Failed to update product", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold font-montserrat text-[#2b2b2b]">
                Edit Product
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light disabled:opacity-50"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {/* Product ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                  Product ID
                </label>
                <input
                  type="text"
                  value={product.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-montserrat text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name (Read-Only) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Product Name{" "}
                    <span className="text-gray-400 font-normal">
                      (Read-only)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-montserrat text-sm cursor-not-allowed"
                  />
                </div>

                {/* Price (Editable) */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>

                {/* Quantity (Editable) */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Unit (Editable) */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Unit (e.g., kg, pcs)
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                    placeholder="kg"
                  />
                </div>

                {/* Stock (Read-Only / Derived) */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Stock{" "}
                    <span className="text-gray-400 font-normal">
                      (Read-only)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="stock"
                    value={formData.stock}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-montserrat text-sm cursor-not-allowed"
                  />
                </div>

                {/* Status (Read-Only in Edit - Use Table Actions for Status) */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Status{" "}
                    <span className="text-gray-400 font-normal">
                      (Read-only)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={
                      formData.status === "out_of_stock"
                        ? "Out of Stock"
                        : "Active"
                    }
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-montserrat text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Description (Read-Only) */}
              <div>
                <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                  Description{" "}
                  <span className="text-gray-400 font-normal">(Read-only)</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  readOnly
                  disabled
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-montserrat text-sm cursor-not-allowed resize-none"
                />
              </div>

              {/* Categories (Read-Only) */}
              <div>
                <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                  Categories{" "}
                  <span className="text-gray-400 font-normal">(Read-only)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-montserrat"
                    >
                      {category}
                    </span>
                  ))}
                  {(!formData.categories ||
                    formData.categories.length === 0) && (
                    <span className="text-gray-500 text-sm font-montserrat italic">
                      No categories
                    </span>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm font-montserrat bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}
            </form>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-[#2b2b2b] bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 font-montserrat text-sm disabled:opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 text-white bg-[#538e53] border border-[#538e53] rounded-md hover:bg-[#467846] font-montserrat text-sm disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Price & Quantity"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
