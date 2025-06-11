"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ActiveProduct } from "./_components/ActiveProduct";
import { ProductOutOfStock } from "./_components/ProductOutOfStock";

interface SideProps {
  switchSides: "Active" | "OutOfStock";
  setSwitchSides: React.Dispatch<React.SetStateAction<"Active" | "OutOfStock">>;
}

export default function ProduceListPage() {
  const [switchSides, setSwitchSides] =
    useState<SideProps["switchSides"]>("Active");
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

  const handleSwitchSides = (side: SideProps["switchSides"]) => {
    setSwitchSides(side);
  };

  // Update indicator position and width when switchSides changes
  useEffect(() => {
    const updateIndicator = () => {
      const activeContainer =
        switchSides === "Active"
          ? activeContainerRef.current
          : outOfStockContainerRef.current;
      const container = containerRef.current;
      if (activeContainer && container) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeContainer.getBoundingClientRect();
        const left = tabRect.left - containerRect.left;
        const width = tabRect.width;
        setIndicatorStyle({ left, width });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [switchSides]);

  return (
    <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
      <h1 className="text-[16px] font-normal mb-4 px-6 pt-6 sm:text-lg">
        Stock management
      </h1>
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
              onClick={() => handleSwitchSides("Active")}
              className={`text-[14px] font-medium cursor-pointer p-2 sm:text-base ${
                switchSides === "Active"
                  ? "text-[#538e53]"
                  : "text-[#538e53]/70"
              }`}
              aria-selected={switchSides === "Active"}
              aria-controls="active-panel"
            >
              Active
            </button>
            <span className="bg-[#538e53] text-[#fefefe] text-[10px] font-montserrat font-normal rounded-[4px] px-[4px] py-[1px]">
              15
            </span>
          </div>
          <div
            className="flex items-center gap-1 relative"
            ref={outOfStockContainerRef}
          >
            <button
              role="tab"
              id="outofstock-tab"
              onClick={() => handleSwitchSides("OutOfStock")}
              className={`text-[14px] font-medium cursor-pointer p-2 sm:text-base ${
                switchSides === "OutOfStock"
                  ? "text-[#8B4513]"
                  : "text-[#8B4513]/70"
              }`}
              aria-selected={switchSides === "OutOfStock"}
              aria-controls="outofstock-panel"
            >
              Out of Stock
            </button>
            <span className="bg-[#8B4513] text-[#fefefe] text-[10px] font-montserrat font-normal rounded-[4px] px-[4px] py-[1px]">
              15
            </span>
          </div>
          <motion.div
            className={`absolute -bottom-[0.5rem] rounded-t-[10px] h-[3.7px] ${
              switchSides === "Active" ? "bg-[#538e53]" : "bg-[#8B4513]"
            }`}
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        <div className="w-full h-[1px] bg-[#e2e2e2]"></div>
      </div>

      <div
        className="mb-4"
        role="tabpanel"
        id={switchSides === "Active" ? "active-panel" : "outofstock-panel"}
      >
        {switchSides === "Active" ? <ActiveProduct /> : <ProductOutOfStock />}
      </div>
    </div>
  );
}
