"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BannerSettings } from "./_components/BannerSettings";

type SettingsTab = "banners";

interface TabConfig {
  id: SettingsTab;
  label: string;
}

// One entry for now; add sections here as more admin settings land.
const TABS: TabConfig[] = [{ id: "banners", label: "Banners" }];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("banners");

  return (
    <div className="w-[95%] mx-auto mb-5 rounded-[10px] bg-[#fefefe] shadow-md">
      <h1 className="mb-4 px-6 pt-6 text-base font-normal font-montserrat sm:text-lg">
        Settings
      </h1>

      <div className="flex flex-col overflow-x-auto flex-nowrap">
        <div
          className="relative mb-2 flex items-center gap-3 px-6 flex-nowrap"
          role="tablist"
          aria-label="Admin settings sections"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`${tab.id}-tab`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              className={`cursor-pointer relative px-2 pb-1 text-sm font-medium sm:text-base transition-colors duration-200 ${
                activeTab === tab.id ? "text-[#538e53]" : "text-[#2b2b2b]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="settings-tab-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-[3.7px] rounded-t-[10px] bg-[#538e53]"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="h-[1px] w-full bg-gray-200" />
      </div>

      <div
        className="px-3 sm:px-6 py-5"
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
      >
        {activeTab === "banners" && <BannerSettings />}
      </div>
    </div>
  );
}
