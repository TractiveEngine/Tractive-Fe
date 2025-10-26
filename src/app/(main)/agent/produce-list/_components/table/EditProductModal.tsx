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
    status: "active",
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
        status: product.status || "active",
        categories: Array.isArray(product.categories) ? product.categories : [],
      });
      setCategoryInput("");
      setError(null);
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
        formData
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
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Price */}
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

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Stock
                  </label>
                  <input
                    type="text"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                    placeholder="Enter stock quantity"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                    Rating
                  </label>
                  <select
                    title="Rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50 resize-none"
                  placeholder="Enter product description"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                  Categories
                </label>

                {/* Category Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyPress={handleCategoryKeyPress}
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                    placeholder="Add a category"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={loading || !categoryInput.trim()}
                    className="px-4 py-2 bg-[#538e53] text-white rounded-md hover:bg-[#467846] font-montserrat text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-2">
                  {formData.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-[#538e53] text-[#fefefe] rounded-full text-sm font-montserrat"
                    >
                      {category}
                      <button
                        title="Remove category"
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        disabled={loading}
                        className="text-[#fefefe] hover:text-red-300 font-bold text-[16px] disabled:opacity-50 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {(!formData.categories ||
                    formData.categories.length === 0) && (
                    <span className="text-gray-500 text-sm font-montserrat italic">
                      No categories added
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#2b2b2b] mb-2 font-montserrat">
                  Status
                </label>
                <select
                  title="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#538e53] focus:border-[#538e53] font-montserrat text-sm disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
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
                  "Update Product"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
