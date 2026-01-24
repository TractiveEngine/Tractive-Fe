"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { InfoIcon } from "@/icons/Icons";
import AddToStore from "../_components/AddToStore";
import { ProductTable } from "./_components/table/ProductTable";
import { SearchFilters } from "@/services/productService";
import { productKeys, useProducts } from "@/hooks/queries/useProductQueries";
import { ActiveProduct } from "./_components/ActiveProduct";
import { ProductOutOfStock } from "./_components/ProductOutOfStock";

interface SideProps {
  switchSides: "active" | "out_of_stock";
  setSwitchSides: React.Dispatch<
    React.SetStateAction<"active" | "out_of_stock">
  >;
}

export default function ProduceListPage() {
  const [switchSides, setSwitchSides] =
    useState<SideProps["switchSides"]>("active");
  const activeContainerRef = useRef<HTMLDivElement>(null);
  const outOfStockContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  // Pre-fetch both lists to display counts immediately
  const {
    data: activeData,
    isLoading: isActiveLoading,
    refetch: refetchActive,
  } = useProducts({ status: "available" });
  const {
    data: outOfStockData,
    isLoading: isOutOfStockLoading,
    refetch: refetchOutOfStock,
  } = useProducts({ status: "out_of_stock" });

  // Update counts when data loads
  useEffect(() => {
    if (activeData?.total !== undefined) {
      setActiveCount(activeData.total);
    }
  }, [activeData?.total]);

  useEffect(() => {
    if (outOfStockData?.total !== undefined) {
      setOutOfStockCount(outOfStockData.total);
    }
  }, [outOfStockData?.total]);

  const handleProductsUpdate = useCallback(
    (counts: { active?: number; out_of_stock?: number }) => {
      if (counts.active !== undefined) setActiveCount(counts.active);
      if (counts.out_of_stock !== undefined)
        setOutOfStockCount(counts.out_of_stock);
    },
    [],
  );

  const handleRefetchAll = () => {
    refetchActive();
    refetchOutOfStock();
  };

  // Determine current view data
  const currentData = switchSides === "active" ? activeData : outOfStockData;
  const currentLoading =
    switchSides === "active" ? isActiveLoading : isOutOfStockLoading;

  const handleSwitchSides = (side: "active" | "out_of_stock") => {
    setSwitchSides(side);
  };

  useEffect(() => {
    const updateIndicator = () => {
      const activeTab =
        switchSides === "active"
          ? activeContainerRef.current
          : outOfStockContainerRef.current;

      if (activeTab && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        setIndicatorStyle({
          left: tabRect.left - containerRect.left,
          width: tabRect.width,
        });
      }
    };

    updateIndicator();
    // Update on window resize too for responsiveness
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [switchSides]);

  return (
    <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
      {/* ... (Header omitted) ... */}
      <div className="flex justify-between items-center px-6 pt-6 mb-4">
        <h1 className="text-[16px] font-normal font-montserrat sm:text-lg">
          Stock management
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#538e53] text-white px-4 py-2 rounded-md text-sm font-montserrat hover:bg-[#467a46] transition-colors"
        >
          + Add Item
        </button>
      </div>

      <div className="flex flex-col">
        <div
          className="relative flex items-center gap-4 sm:gap-6 mb-2 px-6"
          ref={containerRef}
          role="tablist"
          aria-label="Stock management tabs"
        >
          <div
            className="flex items-center gap-1 relative"
            ref={activeContainerRef}
          >
            <button
              role="tab"
              id="active-tab"
              onClick={() => handleSwitchSides("active")}
              className={`text-[14px] font-medium cursor-pointer p-2 sm:text-base ${
                switchSides === "active"
                  ? "text-[#538e53]"
                  : "text-[#538e53]/70"
              }`}
              aria-selected={switchSides === "active"}
              aria-controls="active-panel"
            >
              Active
            </button>
            <span className="bg-[#538e53] text-[#fefefe] text-[10px] font-montserrat font-normal rounded-[4px] px-[4px] py-[1px]">
              {activeCount}
            </span>
          </div>
          <div
            className="flex items-center gap-1 relative"
            ref={outOfStockContainerRef}
          >
            <button
              role="tab"
              id="out_of_stock-tab"
              onClick={() => handleSwitchSides("out_of_stock")}
              className={`text-[14px] font-medium cursor-pointer p-2 sm:text-base ${
                switchSides === "out_of_stock"
                  ? "text-[#8B4513]"
                  : "text-[#8B4513]/70"
              }`}
              aria-selected={switchSides === "out_of_stock"}
              aria-controls="out_of_stock-panel"
            >
              Out of Stock
            </button>
            <span className="bg-[#8B4513] text-[#fefefe] text-[10px] font-montserrat font-normal rounded-[4px] px-[4px] py-[1px]">
              {outOfStockCount}
            </span>
          </div>
          <motion.div
            className={`absolute -bottom-[0.5rem] rounded-t-[10px] h-[3.7px] ${
              switchSides === "active" ? "bg-[#538e53]" : "bg-[#8B4513]"
            }`}
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        <div className="w-full h-[1px] bg-[#e2e2e2]"></div>
      </div>

      <div
        className="mb-4 min-h-[300px] flex flex-col pt-2"
        role="tabpanel"
        id={switchSides === "active" ? "active-panel" : "out_of_stock-panel"}
      >
        {switchSides === "active" ? (
          <ActiveProduct onProductsUpdate={handleProductsUpdate} />
        ) : (
          <ProductOutOfStock onProductsUpdate={handleProductsUpdate} />
        )}
      </div>

      {/* Add To Store Modal */}
      <AddToStore
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
