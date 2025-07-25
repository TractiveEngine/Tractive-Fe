"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "@/icons/Icons";
import "../TrackOrder.css";
import { NewOrderTracking } from "./orderTracking/NewOrderTracking";
import { PickedOrderTracking } from "./orderTracking/PickedOrderTracking";
import { OnTransitOrderTracking } from "./orderTracking/OnTransitOrderTracking";
import { DeliveredOrderTracking } from "./orderTracking/DeliveredOrderTracking";

export interface TabTitlesProps {
  isPicked: boolean;
  onPickedClick?: () => void;
  isOnTransit: boolean;
  onTransitClick?: () => void;
  isDelivered: boolean;
  onDeliveredClick?: () => void;
}

export const TabTitles = ({
  isPicked,
  onPickedClick,
  isOnTransit,
  onTransitClick,
  isDelivered,
  onDeliveredClick,
}: TabTitlesProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "New" | "Picked" | "On Transit" | "Delivered"
  >("On Transit");
  const newContainerRef = useRef<HTMLDivElement>(null);
  const pickedContainerRef = useRef<HTMLDivElement>(null);
  const onTransitContainerRef = useRef<HTMLDivElement>(null);
  const deliveredContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  const handleSwitchTab = (
    tab: "New" | "Picked" | "On Transit" | "Delivered"
  ) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const updateIndicator = () => {
      let activeContainer: HTMLDivElement | null = null;
      if (activeTab === "New") {
        activeContainer = newContainerRef.current;
      } else if (activeTab === "Picked") {
        activeContainer = pickedContainerRef.current;
      } else if (activeTab === "On Transit") {
        activeContainer = onTransitContainerRef.current;
      } else if (activeTab === "Delivered") {
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
  }, [activeTab]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "New":
        return (
          <NewOrderTracking
            isPicked={isPicked}
            onPickedClick={onPickedClick}
            isOnTransit={isOnTransit}
            isDelivered={isDelivered}
          />
        );
      case "Picked":
        return (
          <PickedOrderTracking
            isPicked={isPicked}
            isOnTransit={isOnTransit}
            onTransitClick={onTransitClick}
            isDelivered={isDelivered}
          />
        );
      case "On Transit":
        return (
          <OnTransitOrderTracking
            isPicked={isPicked}
            isOnTransit={isOnTransit}
            isDelivered={isDelivered}
            onDeliveredClick={onDeliveredClick}
          />
        );
      case "Delivered":
        return (
          <DeliveredOrderTracking
            isPicked={isPicked}
            isOnTransit={isOnTransit}
            isDelivered={isDelivered}
          />
        );
      default:
        return (
          <NewOrderTracking
            isPicked={isPicked}
            onPickedClick={onPickedClick}
            isOnTransit={isOnTransit}
            isDelivered={isDelivered}
          />
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-[#fefefe] pt-4 rounded-[10px]">
      <h2 className="font-montserrat text-center font-medium text-[17px] sm:text-[20px] text-[#2b2b2b]">
        Order Tracking
      </h2>
      <div className="relative w-full px-4">
        <input
          type="text"
          placeholder="Search for chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 sm:pl-10 py-3 bg-[#f1f1f1] text-[#2b2b2b] rounded-[4px] text-[13px] sm:text-[15px] focus:outline-none focus:ring-[#2B9B1E] placeholder:text-[#2b2b2b] placeholder:text-[13px] sm:placeholder:text-[15px] placeholder:font-montserrat placeholder:font-normal"
          aria-label="Search for chat"
        />
        <div className="absolute left-2 sm:left-7 top-1/2 transform -translate-y-1/2">
          <SearchIcon stroke="#808080" className="w-5 h-5" />
        </div>
      </div>
      <div className="">
        <div
          className="relative flex items-center gap-4 sm:gap-6 mb-2"
          ref={containerRef}
          role="tablist"
          aria-label="Order tracking tabs"
        >
          <div
            className="flex items-center gap-1 relative"
            ref={newContainerRef}
          >
            <button
              role="tab"
              id="new-tab"
              onClick={() => handleSwitchTab("New")}
              className={`text-[14px] font-medium cursor-pointer p-2 pb-0 sm:text-base ${
                activeTab === "New" ? "text-[#538e53]" : "text-[#2b2b2b]"
              }`}
              aria-selected={activeTab === "New"}
              aria-controls="new-panel"
            >
              New
            </button>
          </div>
          <div
            className="flex items-center gap-1 relative"
            ref={pickedContainerRef}
          >
            <button
              role="tab"
              id="picked-tab"
              onClick={() => handleSwitchTab("Picked")}
              className={`text-[14px] font-medium cursor-pointer p-2 pb-0 sm:text-base ${
                activeTab === "Picked" ? "text-[#538e53]" : "text-[#2b2b2b]"
              }`}
              aria-selected={activeTab === "Picked"}
              aria-controls="picked-panel"
            >
              Picked
            </button>
          </div>
          <div
            className="flex items-center gap-1 relative"
            ref={onTransitContainerRef}
          >
            <button
              role="tab"
              id="on-transit-tab"
              onClick={() => handleSwitchTab("On Transit")}
              className={`text-[14px] font-medium cursor-pointer p-2 pb-0 sm:text-base ${
                activeTab === "On Transit" ? "text-[#538e53]" : "text-[#2b2b2b]"
              }`}
              aria-selected={activeTab === "On Transit"}
              aria-controls="on-transit-panel"
            >
              On Transit
            </button>
          </div>
          <div
            className="flex items-center gap-1 relative"
            ref={deliveredContainerRef}
          >
            <button
              role="tab"
              id="delivered-tab"
              onClick={() => handleSwitchTab("Delivered")}
              className={`text-[14px] font-medium cursor-pointer p-2 pb-0 sm:text-base ${
                activeTab === "Delivered" ? "text-[#538e53]" : "text-[#2b2b2b]"
              }`}
              aria-selected={activeTab === "Delivered"}
              aria-controls="delivered-panel"
            >
              Delivered
            </button>
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
        role="tabpanel"
        id={`${activeTab.toLowerCase().replace(" ", "-")}-panel`}
        aria-labelledby={`${activeTab.toLowerCase().replace(" ", "-")}-tab`}
      >
        {renderActiveComponent()}
      </div>
    </div>
  );
};
