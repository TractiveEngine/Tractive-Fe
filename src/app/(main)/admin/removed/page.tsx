"use client";

// Import necessary React hooks and libraries
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { SuspendedTable } from "./_components/ASRTable/SuspendedTable";
import { RemovedTable } from "./_components/ASRTable/RemovedTable";
import { ActiveTable } from "./_components/ASRTable/ActiveTable";
import { AdminControl, ASRDataControl } from "@/utils/AdminControl";

// Define types for slide switching
type SlideType = "Active" | "Suspended" | "Removed";

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

// Main ActivePage component
export default function ActivePage() {
  // State to track the currently active tab (Active, Suspended, or Removed)
  const [activeTab, setActiveTab] = useState<SlideType>("Removed");

  // State to manage data with checkbox status
  const [ASRTab, setASRTab] = useState<AdminControl[]>(
    ASRDataControl.map((control) => ({ ...control, checked: false }))
  );

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
      Active: ASRTab.filter((control) => control.status === "Active").length,
      Suspended: ASRTab.filter((control) => control.status === "Suspended")
        .length,
      Removed: ASRTab.filter((control) => control.status === "Removed").length,
    }),
    [ASRTab]
  );

  // Define tab configuration
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "active-tab",
        label: "Active",
        displayLabel: "Active",
        count: counts.Active,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "suspended-tab",
        label: "Suspended",
        displayLabel: "Suspended",
        count: counts.Suspended,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "removed-tab",
        label: "Removed",
        displayLabel: "Removed",
        count: counts.Removed,
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
    setASRTab(
      ASRTab.map((control) =>
        control.id === id ? { ...control, checked: !control.checked } : control
      )
    );
  };

  // Handle select all checkboxes for the active tab
  const handleSelectAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    setASRTab(
      ASRTab.map((control) =>
        control.status === activeTab
          ? { ...control, checked: newAllChecked }
          : control
      )
    );
  };

  // Handle admin suspension
  const handleAdminSuspended = (id: string) => {
    console.log(`Suspended admin with ID: ${id}`);
    setASRTab(
      ASRTab.map((control) =>
        control.id === id ? { ...control, status: "Suspended" } : control
      )
    );
  };

  // Handle admin removal
  const handleAdminRemoved = (id: string) => {
    console.log(`Removed admin with ID: ${id}`);
    setASRTab(
      ASRTab.map((control) =>
        control.id === id ? { ...control, status: "Removed" } : control
      )
    );
  };

  // Handle admin reactivation
  const handleReactivate = (id: string) => {
    console.log(`Reactivated admin with ID: ${id}`);
    setASRTab(
      ASRTab.map((control) =>
        control.id === id ? { ...control, status: "Active" } : control
      )
    );
  };

  // Handle admin onboarding
  const handleAdminOnboarding = (id: string) => {
    console.log(`Onboarded admin with ID: ${id}`);
    // Add onboarding logic here (e.g., API call or state update)
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
    const filteredData = ASRTab.filter(
      (control) => control.status === activeTab
    );
    const componentMap: Record<SlideType, React.ReactNode> = {
      Active: (
        <ActiveTable
          data={filteredData}
          handleAdminSuspended={handleAdminSuspended}
          handleAdminRemoved={handleAdminRemoved}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Suspended: (
        <SuspendedTable
          data={filteredData}
          handleReactivate={handleReactivate}
          handleAdminRemoved={handleAdminRemoved}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Removed: (
        <RemovedTable
          data={filteredData}
          handleAdminOnboarding={handleAdminOnboarding}
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
        Approvals
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
                className={`cursor-pointer px-2 text-sm font-medium sm:text-base ${
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
