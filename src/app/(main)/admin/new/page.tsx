"use client";

// Import necessary React hooks and libraries
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ApprovalsAgents } from "./_components/ApprovalsAgents";
import { ApprovalFarmers } from "./_components/ApprovalFarmers";
import { AgentsData, AgentsProps, FarmersData, FarmersProps } from "@/utils/Approvals";

// Define types for slide switching
type SlideType = "Agents" | "Farmers";

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

// Main ApprovalPage component
export default function ApprovalPage() {
  // State to track the currently active tab (Agents or Farmers)
  const [activeTab, setActiveTab] = useState<SlideType>("Agents");

  // State to manage agents data with checkbox status
  const [agents, setAgents] = useState<AgentsProps[]>(
    AgentsData.map((agent) => ({ ...agent, checked: false }))
  );

  // State to manage farmers data with checkbox status
  const [farmers, setFarmers] = useState<FarmersProps[]>(
    FarmersData.map((farmer) => ({ ...farmer, checked: false }))
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

  // Calculate counts for Agents and Farmers tabs
  const counts = useMemo(
    () => ({
      Agents: agents.length,
      Farmers: farmers.length,
    }),
    [agents, farmers]
  );

  // Define tab configuration for Agents and Farmers
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "agents-tab",
        label: "Agents",
        displayLabel: "Agents",
        count: counts.Agents,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "farmers-tab",
        label: "Farmers",
        displayLabel: "Farmers",
        count: counts.Farmers,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
    ],
    [counts]
  );

  // Handle tab switching between Agents and Farmers
  const handleSwitchTab = (tab: SlideType) => {
    setActiveTab(tab);
    setAllChecked(false); // Reset select all when switching tabs
  };

  // Handle checkbox change for individual items
  const handleCheckboxChange = (id: string) => {
    if (activeTab === "Agents") {
      setAgents(
        agents.map((agent) =>
          agent.id === id ? { ...agent, checked: !agent.checked } : agent
        )
      );
    } else {
      setFarmers(
        farmers.map((farmer) =>
          farmer.id === id ? { ...farmer, checked: !farmer.checked } : farmer
        )
      );
    }
  };

  // Handle select all checkboxes for the active tab
  const handleSelectAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    if (activeTab === "Agents") {
      setAgents(agents.map((agent) => ({ ...agent, checked: newAllChecked })));
    } else {
      setFarmers(
        farmers.map((farmer) => ({ ...farmer, checked: newAllChecked }))
      );
    }
  };

  // Handle approval action (placeholder for actual logic)
  const handleAgentApprove = (id: string) => {
    console.log(`Approved item with ID: ${id}`);
    // Add actual approval logic here (e.g., API call)
  };

  // Handle decline action (placeholder for actual logic)
  const handleAgentDecline = (id: string) => {
    console.log(`Declined item with ID: ${id}`);
    // Add actual decline logic here (e.g., API call)
    };
    
  // Handle approval action (placeholder for actual logic)
  const handleFarmerApprove = (id: string) => {
    console.log(`Approved item with ID: ${id}`);
    // Add actual approval logic here (e.g., API call)
  };

  // Handle decline action (placeholder for actual logic)
  const handleFarmerDecline = (id: string) => {
    console.log(`Declined item with ID: ${id}`);
    // Add actual decline logic here (e.g., API call)
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
      Agents: (
        <ApprovalsAgents
          data={agents}
          handleAgentApprove={handleAgentApprove}
          handleAgentDecline={handleAgentDecline}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Farmers: (
        <ApprovalFarmers
          data={farmers}
          handleFarmerApprove={handleFarmerApprove}
          handleFarmerDecline={handleFarmerDecline}
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
