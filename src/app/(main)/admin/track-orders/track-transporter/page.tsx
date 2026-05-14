"use client";

// Import necessary React hooks and libraries
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion"; // Adjust the import path as needed
import { TrackPicked } from "./_components/TrackPicked";
import { TrackOnTransit } from "./_components/TrackOnTransit";
import { TrackDelivered } from "./_components/TrackDelivered";
import { TransporterData } from "@/utils/TrackTransporterData";
import { useFleetTrips } from "@/hooks/queries/useTransporterQueries";
import {
  FleetTripStatus,
  FleetTripSummary,
} from "@/services/fleetTripService";
import { TableSkeleton } from "../../_components/TableSkeleton";

// Define types for slide switching
type SlideType = "Picked" | "OnTransit" | "Delivered";

const TAB_TO_STATUS: Record<SlideType, FleetTripStatus> = {
  Picked: "picked",
  OnTransit: "on_transit",
  Delivered: "delivered",
};

const tripFleetName = (trip: FleetTripSummary): string => {
  if (trip.fleet && typeof trip.fleet === "object") {
    return trip.fleet.fleetName || trip.fleet.plateNumber || "Fleet";
  }
  return (trip.fleet as string) || "Fleet";
};

const tripFleetIot = (trip: FleetTripSummary): string => {
  if (trip.fleet && typeof trip.fleet === "object") {
    return trip.fleet.iot || trip.fleet.plateNumber || "—";
  }
  return "—";
};

const tripFleetImage = (trip: FleetTripSummary): string => {
  if (trip.fleet && typeof trip.fleet === "object") {
    return (
      trip.fleet.image ||
      (trip.fleet.images && trip.fleet.images[0]) ||
      "/images/truckcontainer.png"
    );
  }
  return "/images/truckcontainer.png";
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CA");
};

const tripToTransporterData = (trip: FleetTripSummary): TransporterData => {
  const id = (trip._id || trip.id || "") as string;
  const buyer = trip.buyers?.[0];
  return {
    id,
    IOT: tripFleetIot(trip),
    image: tripFleetImage(trip),
    title: tripFleetName(trip),
    description: (trip.fromLocation || "") + " → " + (trip.toLocation || ""),
    buyerName: buyer?.name || "—",
    transporterName: tripFleetName(trip),
    amount: "—",
    date: formatDate(trip.createdAt),
    checked: false,
  };
};

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
export default function TrackTransporterPage() {
  // State to track the currently active tab (Picked, OnTransit, Delivered)
  const [activeTab, setActiveTab] = useState<SlideType>("Picked");

  // Fetch real fleet trips for the active tab's status
  const { data: tripsRaw, isLoading } = useFleetTrips({
    status: TAB_TO_STATUS[activeTab],
  });

  // State to manage order data with checkbox status
  const [transporterData, setTransporterData] = useState<TransporterData[]>([]);

  // Sync API data into local state (so checkbox toggles work)
  useEffect(() => {
    const list: FleetTripSummary[] = Array.isArray(tripsRaw) ? tripsRaw : [];
    setTransporterData(list.map(tripToTransporterData));
  }, [tripsRaw]);

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

  // Count for the current tab (the others are unknown until that tab is opened)
  const counts = useMemo(
    () => ({
      Picked: activeTab === "Picked" ? transporterData.length : 0,
      OnTransit: activeTab === "OnTransit" ? transporterData.length : 0,
      Delivered: activeTab === "Delivered" ? transporterData.length : 0,
    }),
    [activeTab, transporterData]
  );

  // Define tab configuration
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "picked",
        label: "Picked",
        displayLabel: "Picked",
        count: counts.Picked,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "on-transit",
        label: "OnTransit",
        displayLabel: "On Transit",
        count: counts.OnTransit,
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
    setTransporterData(
      transporterData.map((transport) =>
        transport.id === id
          ? { ...transport, checked: !transport.checked }
          : transport
      )
    );
  };

  // Handle select all checkboxes for the active tab
  const handleSelectAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    setTransporterData(
      transporterData.map((transport) => ({
        ...transport,
        checked: newAllChecked,
      }))
    );
  };

  // Handle buyer info click
  const handleTBuyerInfo = (id: string) => {
    console.log(`Viewing buyer info for order ID: ${id}`);
    // Add logic to display buyer info
  };

  // Handle seller info click
  const handleTrackOrder = (id: string) => {
    console.log(`Viewing track info for order ID: ${id}`);
    // Add logic to display track info
  };

  const handleTransporterInfo = (id: string) => {
    console.log(`Viewing transporter info for order ID: ${id}`);
    // Add logic to display transporter info
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
    if (isLoading) {
      return <TableSkeleton columns={6} rows={6} />;
    }
    const componentMap: Record<SlideType, React.ReactNode> = {
      Picked: (
        <TrackPicked
          transport={transporterData}
          handleTBuyerInfo={handleTBuyerInfo}
          handleTransporterInfo={handleTransporterInfo}
          handleTrackOrder={handleTrackOrder}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      OnTransit: (
        <TrackOnTransit
          transport={transporterData}
          handleTBuyerInfo={handleTBuyerInfo}
          handleTransporterInfo={handleTransporterInfo}
          handleTrackOrder={handleTrackOrder}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Delivered: (
        <TrackDelivered
          transport={transporterData}
          handleTBuyerInfo={handleTBuyerInfo}
          handleTransporterInfo={handleTransporterInfo}
          handleTrackOrder={handleTrackOrder}
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
