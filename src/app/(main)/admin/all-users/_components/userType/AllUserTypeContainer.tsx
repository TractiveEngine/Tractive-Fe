"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { AllUserType } from "./AllUserType";
import { AgentType } from "./AgentType";
import { TransporterTypes } from "./TransporterTypes";
import { FarmerType } from "./FarmerType";
import { initialUsers } from "@/utils/userTypes";
import { BuyerType } from "./BuyerType";

// Define types for slide switching
type SlideType = "All" | "Agents" | "Transporter" | "Farmer" | "Buyer";

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

export default function AllUserTypeContainer() {
  const [activeTab, setActiveTab] = useState<SlideType>("All");
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });

  // Calculate counts dynamically from initialUsers
  const counts = useMemo(
    () => ({
      All: initialUsers.length,
      Agents: initialUsers.filter((user) => user.profession === "Agents").length,
      Transporter: initialUsers.filter((user) => user.profession === "Transporter")
        .length,
      Farmer: initialUsers.filter((user) => user.profession === "Farmer").length,
      Buyer: initialUsers.filter((user) => user.profession === "Buyer").length,
    }),
    []
  );

  // Tab configuration with explicit type annotation
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "all-tab",
        label: "All",
        displayLabel: "All",
        count: counts.All,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
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
        id: "transporter-tab",
        label: "Transporter",
        displayLabel: "Transporter",
        count: counts.Transporter,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "farmer-tab",
        label: "Farmer",
        displayLabel: "Farmer",
        count: counts.Farmer,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "buyer-tab",
        label: "Buyer",
        displayLabel: "Buyer",
        count: counts.Buyer,
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
  };

  // Update indicator position and width when activeTab changes
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

  // Map activeTab to corresponding component
  const renderContent = () => {
    const componentMap: Record<SlideType, React.ReactNode> = {
      All: <AllUserType />,
      Agents: <AgentType />,
      Transporter: <TransporterTypes />,
      Farmer: <FarmerType />,
      Buyer: <BuyerType />,
    };
    return componentMap[activeTab] || <AllUserType />;
  };

  return (
    <div className="w-full mb-5 rounded-[10px] bg-[#fefefe] shadow-md">
      <h1 className="mb-4 px-6 pt-6 text-base font-normal font-montserrat sm:text-lg">
        User
      </h1>
      <div className="flex flex-col overflow-x-auto flex-nowrap hide-scrollbar">
        <div
          className="relative mb-2 flex items-center gap-3 px-6 flex-nowrap"
          ref={containerRef}
          role="tablist"
          aria-label="User management tabs"
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
          <motion.div
            className={`absolute -bottom-2 h-[3.7px] rounded-t-[10px] ${
              tabs.find((tab) => tab.label === activeTab)?.colorClass ||
              "bg-green-600"
            }`}
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        <div className="h-[1px] w-[100%] bg-gray-200" />
      </div>

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
