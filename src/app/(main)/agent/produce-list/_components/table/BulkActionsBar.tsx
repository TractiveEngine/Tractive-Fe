"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useBulkDeleteProducts,
  useBulkUpdateStatus,
} from "@/hooks/queries/useProductQueries";

interface BulkActionsBarProps {
  selectedIds: Set<string>;
  clearSelection: () => void;
  isOutOfStockPage: boolean;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedIds,
  clearSelection,
  isOutOfStockPage,
}) => {
  const bulkDeleteMutation = useBulkDeleteProducts();
  const bulkUpdateStatusMutation = useBulkUpdateStatus();
  const [loading, setLoading] = React.useState(false);

  const selectedCount = selectedIds.size;
  const ids = Array.from(selectedIds);

  const handleBulkMarkOutOfStock = async () => {
    if (ids.length === 0) return;
    setLoading(true);
    bulkUpdateStatusMutation.mutate(
      { ids, status: "out_of_stock" },
      {
        onSettled: () => {
          setLoading(false);
          clearSelection();
        },
      },
    );
  };

  const handleBulkMarkInStock = async () => {
    if (ids.length === 0) return;
    setLoading(true);
    bulkUpdateStatusMutation.mutate(
      { ids, status: "available" },
      {
        onSettled: () => {
          setLoading(false);
          clearSelection();
        },
      },
    );
  };

  const handleBulkDelete = async () => {
    if (ids.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${ids.length} product(s)?`))
      return;

    setLoading(true);
    bulkDeleteMutation.mutate(ids, {
      onSettled: () => {
        setLoading(false);
        clearSelection();
      },
    });
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[50] flex items-center bg-white shadow-2xl rounded-full border border-gray-100 px-6 py-3 gap-6 min-w-[320px] max-w-[90vw] justify-between"
        >
          <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
            <div className="bg-[#538e53] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {selectedCount}
            </div>
            <span className="text-sm font-medium text-gray-700 font-montserrat whitespace-nowrap">
              Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isOutOfStockPage && (
              <button
                onClick={handleBulkMarkOutOfStock}
                disabled={loading}
                className="text-xs font-semibold font-montserrat px-3 py-1.5 rounded-full text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                Mark Out of Stock
              </button>
            )}

            {isOutOfStockPage && (
              <button
                onClick={handleBulkMarkInStock}
                disabled={loading}
                className="text-xs font-semibold font-montserrat px-3 py-1.5 rounded-full text-[#538e53] bg-[#f0f7f0] hover:bg-[#e0f0e0] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                Back in Stock
              </button>
            )}

            <button
              onClick={handleBulkDelete}
              disabled={loading}
              className="text-xs font-semibold font-montserrat px-3 py-1.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Delete
            </button>

            <button
              onClick={clearSelection}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear selection"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
