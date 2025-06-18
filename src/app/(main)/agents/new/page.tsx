"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NewProduct } from "./_components/Tables/NewProduct";
import { DeliveredProduct } from "./_components/Tables/DeliveredProduct";
import { PackedProduct } from "./_components/Tables/PackedProduct";

interface SideProps {
  switchSides: "New" | "Packed" | "Delivered";
  setSwitchSides: React.Dispatch<
    React.SetStateAction<"New" | "Packed" | "Delivered">
  >;
}

export default function ProduceListPage() {
  const [switchSides, setSwitchSides] =
    useState<SideProps["switchSides"]>("New");
  const newContainerRef = useRef<HTMLDivElement>(null);
  const parkedContainerRef = useRef<HTMLDivElement>(null);
  const deliveredContainerRef = useRef<HTMLDivElement>(null);
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
      let activeContainer: HTMLDivElement | null = null;
      if (switchSides === "New") {
        activeContainer = newContainerRef.current;
      } else if (switchSides === "Packed") {
        activeContainer = parkedContainerRef.current;
      } else if (switchSides === "Delivered") {
        activeContainer = deliveredContainerRef.current;
      }

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
        Order management
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
            ref={newContainerRef}
          >
            <button
              role="tab"
              id="new-tab"
              onClick={() => handleSwitchSides("New")}
              className={`text-[14px] font-medium cursor-pointer p-2 sm:text-base ${
                switchSides === "New" ? "text-[#538e53]" : "text-[#538e53]"
              }`}
              aria-selected={switchSides === "New"}
              aria-controls="new-panel"
            >
              New
            </button>
            <span className="bg-[#538e53] text-[#fefefe] text-[10px] font-montserrat font-normal rounded-[4px] px-[4px] py-[1px]">
              15
            </span>
          </div>
          <div
            className="flex items-center gap-1 relative"
            ref={parkedContainerRef}
          >
            <button
              role="tab"
              id="parked-tab"
              onClick={() => handleSwitchSides("Packed")}
              className={`text-[14px] font-medium cursor-pointer p-2 sm:text-base ${
                switchSides === "Packed" ? "text-[#538e53]" : "text-[#538e53]"
              }`}
              aria-selected={switchSides === "Packed"}
              aria-controls="parked-panel"
            >
              Parked
            </button>
            <span className="bg-[#538e53] text-[#fefefe] text-[10px] font-montserrat font-normal rounded-[4px] px-[4px] py-[1px]">
              15
            </span>
          </div>
          <div
            className="flex items-center gap-1 relative"
            ref={deliveredContainerRef}
          >
            <button
              role="tab"
              id="delivered-tab"
              onClick={() => handleSwitchSides("Delivered")}
              className={`text-[14px] font-medium cursor-pointer p-2 sm:text-base ${
                switchSides === "Delivered"
                  ? "text-[#538e53]"
                  : "text-[#538e53]"
              }`}
              aria-selected={switchSides === "Delivered"}
              aria-controls="delivered-panel"
            >
              Delivered
            </button>
            <span className="bg-[#538e53] text-[#fefefe] text-[10px] font-montserrat font-normal rounded-[4px] px-[4px] py-[1px]">
              15
            </span>
          </div>
          <motion.div
            className="absolute -bottom-[0.5rem] rounded-t-[10px] h-[3.7px] bg-[#538e53]"
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        <div className="w-full h-[1px] bg-[#e2e2e2]"></div>
      </div>

      <div
        className="mb-4"
        role="tabpanel"
        id={
          switchSides === "New"
            ? "new-panel"
            : switchSides === "Packed"
            ? "parked-panel"
            : "delivered-panel"
        }
      >
        {switchSides === "New" ? (
          <NewProduct />
        ) : switchSides === "Packed" ? (
          <PackedProduct />
        ) : (
          <DeliveredProduct />
        )}
      </div>
    </div>
  );
}
