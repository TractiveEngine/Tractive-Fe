"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Transaction, TransactionalData } from "@/utils/TransactionDataTypes";
import { Approved } from "./_components/transactionType/Approved";
import { Pending } from "./_components/transactionType/Pending";
import { Refunded } from "./_components/transactionType/Refunded";
import { Failed } from "./_components/transactionType/Failed";

// Define types for slide switching
type SlideType = "Pending" | "Approved" | "Failed" | "Refunded";

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

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState<SlideType>("Pending");
  const [transactions, setTransactions] = useState<Transaction[]>(
    TransactionalData.map((transaction) => ({ ...transaction, checked: false }))
  );
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });

  // Calculate counts dynamically from transactions
  const counts = useMemo(
    () => ({
      Pending: transactions.filter(
        (transaction) => transaction.status === "Pending"
      ).length,
      Approved: transactions.filter(
        (transaction) => transaction.status === "Approved"
      ).length,
      Failed: transactions.filter(
        (transaction) => transaction.status === "Failed"
      ).length,
      Refunded: transactions.filter(
        (transaction) => transaction.status === "Refunded"
      ).length,
    }),
    [transactions]
  );

  // Tab configuration with explicit type annotation
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "pending-tab",
        label: "Pending",
        displayLabel: "Pending",
        count: counts.Pending,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "approved-tab",
        label: "Approved",
        displayLabel: "Approved",
        count: counts.Approved,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "failed-tab",
        label: "Failed",
        displayLabel: "Failed",
        count: counts.Failed,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "refunded-tab",
        label: "Refunded",
        displayLabel: "Refunded",
        count: counts.Refunded,
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

  // Handle approve action
  const handleApprove = (id: string) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: "Approved" as const }
          : transaction
      )
    );
  };

  // Handle decline action
  const handleDecline = (id: string) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: "Failed" as const }
          : transaction
      )
    );
  };

  // Handle refund action
  const handleRefund = (id: string) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: "Refunded" as const }
          : transaction
      )
    );
  };

  // Handle view profile action
  const handleViewProfile = (id: string) => {
    console.log(`View profile for transaction ID: ${id}`);
    // Add your profile view logic here, e.g., redirect to profile page
  };

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, checked: !transaction.checked }
          : transaction
      )
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    setTransactions(
      transactions.map((transaction) => ({
        ...transaction,
        checked: newAllChecked,
      }))
    );
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
      Pending: (
        <Pending
          transactions={transactions}
          handleApprove={handleApprove}
          handleDecline={handleDecline}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Approved: (
        <Approved
          transactions={transactions}
          handleRefund={handleRefund}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Failed: (
        <Failed
          transactions={transactions}
          handleApprove={handleApprove}
          handleDecline={handleDecline}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Refunded: (
        <Refunded
          transactions={transactions}
          handleViewProfile={handleViewProfile}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
    };
    return (
      componentMap[activeTab] || (
        <Pending
          transactions={transactions}
          handleApprove={handleApprove}
          handleDecline={handleDecline}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      )
    );
  };

  return (
    <div className="w-[95%] mx-auto mb-5 rounded-[10px] bg-[#fefefe] shadow-md">
      <h1 className="mb-4 px-6 pt-6 text-base font-normal font-montserrat sm:text-lg">
        Transactions
      </h1>
      <div className="flex flex-col overflow-x-auto flex-nowrap">
        <div
          className="relative mb-2 flex items-center gap-3 px-6 flex-nowrap"
          ref={containerRef}
          role="tablist"
          aria-label="Transaction management tabs"
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
