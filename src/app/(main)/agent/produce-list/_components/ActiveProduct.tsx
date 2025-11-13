// components/ActiveProduct.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { CalenderIcon } from "@/icons/DashboardIcons";
import { ProductTable } from "./table/ProductTable";
import { productService, SearchFilters } from "@/services/productService";
import { toast } from "sonner";
import { getAuthToken } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";

interface ActiveProductProps {
  onProductsUpdate: (counts: { active: number; out_of_stock: number }) => void;
}

export const ActiveProduct: React.FC<ActiveProductProps> = ({
  onProductsUpdate,
}) => {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    status: "active",
    year: "",
    month: "",
  });
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Check auth on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      console.log("❌ No auth token in ActiveProduct");
      toast.error("Please login to manage products", {
        duration: 3000,
        position: "top-center",
      });
      router.push("/login");
    }
  }, [router]);

  // Generate years from 2019 to 2025
  const years = Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i);
  const months = [
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearOpen(false);
      }
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMonthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsYearOpen(false);
        setIsMonthOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update filters when search, year, or month changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        year: selectedYear,
        month: selectedMonth,
        status: "active",
      }));
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [selectedYear, selectedMonth]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: event.target.value }));
  };

  // Handle bulk delete operation
  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) {
      toast.warning("Please select products to delete", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedProductIds.length} product(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      console.log(`🗑️ Bulk deleting ${selectedProductIds.length} products`);

      await productService.deleteMultipleProducts(selectedProductIds);

      // Clear selection after successful deletion
      setSelectedProductIds([]);

      toast.success(
        `Successfully deleted ${selectedProductIds.length} product(s)`,
        {
          duration: 3000,
          position: "top-center",
        }
      );

      console.log("✅ Bulk delete successful");

      // Force a refresh by updating timestamp
      setFilters((prev) => ({ ...prev, timestamp: Date.now() }));
    } catch (error) {
      console.error("❌ Bulk delete error:", error);
      toast.error(
        error.message || "Failed to delete products. Please try again.",
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  };

  // Handle bulk out of stock operation
  const handleBulkOutOfStock = async () => {
    if (selectedProductIds.length === 0) {
      toast.warning("Please select products to mark as out of stock", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (
      !confirm(
        `Are you sure you want to mark ${selectedProductIds.length} product(s) as out of stock?`
      )
    ) {
      return;
    }

    try {
      console.log(
        `⚠️ Marking ${selectedProductIds.length} products as out of stock`
      );

      await productService.updateMultipleProductsStatus(
        selectedProductIds,
        "out_of_stock"
      );

      // Clear selection after successful update
      setSelectedProductIds([]);

      toast.success(
        `Successfully marked ${selectedProductIds.length} product(s) as out of stock`,
        {
          duration: 3000,
          position: "top-center",
        }
      );

      console.log("✅ Bulk status update successful");

      // Force a refresh
      setFilters((prev) => ({ ...prev, timestamp: Date.now() }));
    } catch (error) {
      console.error("❌ Bulk out of stock error:", error);
      toast.error(
        error.message || "Failed to update products status. Please try again.",
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  };

  // Handle product selection updates from ProductTable
  const handleProductSelectionUpdate = (selectedIds: string[]) => {
    setSelectedProductIds(selectedIds);
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full bg-[#FAF7F7] mt-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-6">
          {/* Search and Dropdowns */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-[100%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
            {/* Search Input */}
            <div className="relative w-[100%] sm:w-[70%] flex-grow">
              <input
                type="text"
                placeholder="Search"
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-8 py-2 border-[1px] border-gray-300 rounded-[4px] text-sm sm:text-base focus:outline-none focus:ring-[#538e53] placeholder:text-[#808080] placeholder:text-sm sm:placeholder:text-base placeholder:font-montserrat placeholder:font-medium"
                aria-label="Search active products"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <SearchIcon
                  stroke="#808080"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </div>
            </div>
            <div className="flex items-center w-full sm:w-auto">
              {/* Year Dropdown */}
              <div className="relative flex-1" ref={yearDropdownRef}>
                <button
                  onClick={() => setIsYearOpen(!isYearOpen)}
                  className="px-3 pl-8 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tl-[4px] rounded-bl-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
                  role="combobox"
                  aria-expanded={isYearOpen}
                  aria-controls="year-dropdown"
                  aria-label={selectedYear ? "Selected year" : "Select year"}
                >
                  {selectedYear || "Year"}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                    {isYearOpen ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                    <CalenderIcon />
                  </div>
                </button>
                <AnimatePresence>
                  {isYearOpen && (
                    <motion.div
                      id="year-dropdown"
                      className="absolute z-10 mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                      role="listbox"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div
                        onClick={() => {
                          setSelectedYear("");
                          setIsYearOpen(false);
                        }}
                        className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
                          selectedYear === "" ? "bg-gray-200" : ""
                        }`}
                        role="option"
                        aria-selected={selectedYear === ""}
                      >
                        Year
                      </div>
                      {years.map((year) => (
                        <div
                          key={year}
                          onClick={() => {
                            setSelectedYear(year.toString());
                            setIsYearOpen(false);
                          }}
                          className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
                            selectedYear === year.toString()
                              ? "bg-gray-200"
                              : ""
                          }`}
                          role="option"
                          aria-selected={selectedYear === year.toString()}
                        >
                          {year}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Month Dropdown */}
              <div className="relative flex-1" ref={monthDropdownRef}>
                <button
                  onClick={() => setIsMonthOpen(!isMonthOpen)}
                  className="px-3 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tr-[4px] rounded-br-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
                  role="combobox"
                  aria-expanded={isMonthOpen}
                  aria-controls="month-dropdown"
                  aria-label={selectedMonth ? "Selected month" : "Select month"}
                >
                  {selectedMonth || "Month"}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                    {isMonthOpen ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {isMonthOpen && (
                    <motion.div
                      id="month-dropdown"
                      className="absolute z-10 mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                      role="listbox"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div
                        onClick={() => {
                          setSelectedMonth("");
                          setIsMonthOpen(false);
                        }}
                        className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
                          selectedMonth === "" ? "bg-gray-200" : ""
                        }`}
                        role="option"
                        aria-selected={selectedMonth === ""}
                      >
                        Month
                      </div>
                      {months.map((month) => (
                        <div
                          key={month}
                          onClick={() => {
                            setSelectedMonth(month);
                            setIsMonthOpen(false);
                          }}
                          className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
                            selectedMonth === month ? "bg-gray-200" : ""
                          }`}
                          role="option"
                          aria-selected={selectedMonth === month}
                        >
                          {month}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 justify-start md:justify-end">
            <button
              onClick={handleBulkDelete}
              disabled={selectedProductIds.length === 0}
              className={`cursor-pointer px-4 sm:px-6 py-2 opacity-[0.9] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors ${
                selectedProductIds.length === 0
                  ? "bg-[#b28362]/50 cursor-not-allowed"
                  : "bg-[#b28362] hover:bg-[#9f6f50]"
              }`}
              aria-label={`Delete ${selectedProductIds.length} selected products`}
            >
              Delete{" "}
              {selectedProductIds.length > 0
                ? `(${selectedProductIds.length})`
                : ""}
            </button>
            <button
              onClick={handleBulkOutOfStock}
              disabled={selectedProductIds.length === 0}
              className={`cursor-pointer px-4 sm:px-6 py-2 opacity-[0.9] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors ${
                selectedProductIds.length === 0
                  ? "bg-[#538e53]/50 cursor-not-allowed"
                  : "bg-[#538e53] hover:bg-[#467a46]"
              }`}
              aria-label={`Mark ${selectedProductIds.length} selected products as out of stock`}
            >
              Out of Stock{" "}
              {selectedProductIds.length > 0
                ? `(${selectedProductIds.length})`
                : ""}
            </button>
          </div>
        </div>

        {/* Selection Info */}
        {selectedProductIds.length > 0 && (
          <div className="px-6 mt-3">
            <p className="text-sm text-[#538e53] font-medium">
              {selectedProductIds.length} product(s) selected
            </p>
          </div>
        )}
      </div>

      {/* Product List */}
      <div className="mt-6 w-full">
        <ProductTable
          filters={filters}
          onProductsUpdate={onProductsUpdate}
          onSelectionUpdate={handleProductSelectionUpdate}
        />
      </div>
    </div>
  );
};
