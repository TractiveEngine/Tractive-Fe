"use client";
// Import necessary React hooks and libraries
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";// Adjust the import path as needed
import { PaidedTrack } from "./_components/PaidedTrack";
import { DeliveredTrack } from "./_components/DeliveredTrack";
import { OrderData, TrackAgentData } from "@/utils/TrackAgentData";

// Define types for slide switching
type SlideType = "Paid" | "Delivered";

// Interface for tab indicator styles
interface IndicatorStyle {
  left: number;
  width: number;
}

// Interface for tab configuration
interface TabConfig {
  id: string;
  label: SlideType;
  displayLabel: string;
  count: number;
  textColor: string;
  colorClass: string;
  colorClassFaded: string;
}

// Main Track Agent component
export default function TrackAgentPage() {
  // State to track the currently active tab (Paid, Delivered)
  const [activeTab, setActiveTab] = useState<SlideType>("Paid");

  // State to manage order data with checkbox status
  const [orderData, setOrderData] = useState<OrderData[]>(TrackAgentData);

  // State to track if all items in the active tab are checked
  const [allChecked, setAllChecked] = useState<boolean>(false);

  // Refs to store tab elements for calculating indicator position
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ref for the tab container to calculate relative positions
  const containerRef = useRef<HTMLDivElement>(null);

  // State for the sliding indicator's position and width
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });

  // Calculate counts for each tab
  const counts = useMemo(
    () => ({
      Paid: orderData.length, // Adjust logic if filtering by status is needed
      Delivered: orderData.length, // Adjust logic if filtering by status is needed
    }),
    [orderData]
  );

  // Define tab configuration
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "paid-tab",
        label: "Paid",
        displayLabel: "Paid",
        count: counts.Paid,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "delivered-tab",
        label: "Delivered",
        displayLabel: "Delivered",
        count: counts.Delivered,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
    ],
    [counts]
  );

  // Handle tab switching
  const handleSwitchTab = (tab: SlideType) => {
    setActiveTab(tab);
    setAllChecked(false); // Reset select all when switching tabs
  };

  // Handle checkbox change for individual items
  const handleCheckboxChange = (id: string) => {
    setOrderData(
      orderData.map((order) =>
        order.id === id ? { ...order, checked: !order.checked } : order
      )
    );
  };

  // Handle select all checkboxes for the active tab
  const handleSelectAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    setOrderData(
      orderData.map((order) => ({ ...order, checked: newAllChecked }))
    );
  };

  // Handle buyer info click
  const handleBuyerInfo = (id: string) => {
    console.log(`Viewing buyer info for order ID: ${id}`);
    // Add logic to display buyer info
  };

  // Handle seller info click
  const handleSellerInfo = (id: string) => {
    console.log(`Viewing seller info for order ID: ${id}`);
    // Add logic to display seller info
  };

  // Update the indicator position and width when activeTab changes
  useEffect(() => {
    const updateIndicator = () => {
      const activeTabIndex = tabs.findIndex((tab) => tab.label === activeTab);
      const activeContainer = tabRefs.current[activeTabIndex];
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
  }, [activeTab, tabs]);

  // Render the appropriate component based on activeTab
  const renderContent = () => {
    const componentMap: Record<SlideType, React.ReactNode> = {
      Paid: (
        <PaidedTrack
          order={orderData}
          handleBuyerInfo={handleBuyerInfo}
          handleSellerInfo={handleSellerInfo}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Delivered: (
        <DeliveredTrack
          order={orderData}
          handleBuyerInfo={handleBuyerInfo}
          handleSellerInfo={handleSellerInfo}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
    };
    return componentMap[activeTab];
  };

  // Main component render
  return (
    <div className="w-[95%] mx-auto mb-5 rounded-[10px] bg-[#fefefe] shadow-md">
      {/* Page title */}
      <h1 className="mb-4 px-6 pt-6 text-base font-normal font-montserrat sm:text-lg">
        Manage Orders
      </h1>
      <div className="flex flex-col overflow-x-auto flex-nowrap">
        {/* Tab navigation */}
        <div
          className="relative mb-2 flex items-center gap-3 px-6 flex-nowrap"
          ref={containerRef}
          role="tablist"
          aria-label="Approval management tabs"
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className="cursor-pointer relative flex items-center gap-1 flex-shrink-0"
              role="tab"
              id={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
            >
              {/* Tab button */}
              <button
                role="tab"
                id={tab.id}
                onClick={() => handleSwitchTab(tab.label)}
                className={`cursor-pointer px-2 text-sm font-normal font-montserrat sm:text-base ${
                  activeTab === tab.label ? tab.textColor : "text-[#2b2b2b]"
                } transition-colors duration-200`}
                aria-selected={activeTab === tab.label}
                aria-controls={`${tab.label.toLowerCase()}-panel`}
              >
                {tab.displayLabel}
              </button>
              {/* Tab count badge */}
              <span
                className={` ${
                  activeTab === tab.label
                    ? `${tab.colorClass} text-[#fefefe]`
                    : `${tab.colorClassFaded} bg-[#2b2b2b]`
                } rounded-[4px] px-1 py-[1px] text-[10px] font-normal font-montserrat`}
              >
                {tab.count}
              </span>
            </div>
          ))}
          {/* Animated tab indicator */}
          <motion.div
            className={`absolute -bottom-2 h-[3.7px] rounded-t-[10px] ${
              tabs.find((tab) => tab.label === activeTab)?.colorClass ||
              "bg-green-600"
            }`}
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        {/* Divider line */}
        <div className="h-[1px] w-[100%] bg-gray-200" />
      </div>

      {/* Content area for the active tab */}
      <div
        className="mb-4"
        role="tabpanel"
        id={`${activeTab.toLowerCase()}-panel`}
        aria-labelledby={tabs.find((tab) => tab.label === activeTab)?.id}
      >
        {renderContent()}
      </div>
    </div>
  );
}
