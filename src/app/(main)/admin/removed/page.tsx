"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SuspendedTable } from "./_components/ASRTable/SuspendedTable";
import { RemovedTable } from "./_components/ASRTable/RemovedTable";
import { ActiveTable } from "./_components/ASRTable/ActiveTable";
import { AdminControl } from "@/utils/AdminControl";
import {
  adminUserService,
  AdminUser,
} from "@/services/adminUserService";
import { TableSkeleton } from "../_components/TableSkeleton";

type SlideType = "Active" | "Suspended" | "Removed";

interface IndicatorStyle {
  left: number;
  width: number;
}

interface TabConfig {
  id: string;
  label: SlideType;
  displayLabel: string;
  count: number;
  textColor: string;
  colorClass: string;
  colorClassFaded: string;
}

const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const mapToAdminControl = (u: AdminUser): AdminControl => {
  const id = (u._id as string) || "";
  const status = titleCase((u.status as string) || "") as
    | "Active"
    | "Suspended"
    | "Removed";
  return {
    id,
    fullName: (u.name as string) || "Unknown",
    email: (u.email as string) || "",
    image: (u.avatar as string) || "/images/placeholder-avatar.png",
    location: (u.state as string) || (u.address as string) || "—",
    mobile: (u.phone as string) || "",
    status,
    date: u.createdAt
      ? new Date(u.createdAt as string).toLocaleDateString()
      : "",
    checked: false,
  };
};

export default function ActivePage() {
  const [activeTab, setActiveTab] = useState<SlideType>("Removed");
  const [data, setData] = useState<AdminControl[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [counts, setCounts] = useState<Record<SlideType, number>>({
    Active: 0,
    Suspended: 0,
    Removed: 0,
  });

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });

  const fetchForTab = useCallback(async (tab: SlideType) => {
    setIsLoading(true);
    try {
      if (tab === "Removed") {
        const res = await adminUserService.getRemovedUsers({ limit: 100 });
        setData(res.data.map(mapToAdminControl));
        setCounts((c) => ({ ...c, Removed: res.pagination?.total ?? res.data.length }));
      } else {
        const status = tab === "Active" ? "active" : "suspended";
        const res = await adminUserService.getUsers({ status, limit: 100 });
        setData(res.data.map(mapToAdminControl));
        setCounts((c) => ({ ...c, [tab]: res.pagination?.total ?? res.data.length }));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load users");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForTab(activeTab);
  }, [activeTab, fetchForTab]);

  // Fetch counts for the inactive tabs too (so badges are accurate) — fire-and-forget
  useEffect(() => {
    (async () => {
      try {
        const [active, suspended, removed] = await Promise.all([
          adminUserService.getUsers({ status: "active", limit: 1 }),
          adminUserService.getUsers({ status: "suspended", limit: 1 }),
          adminUserService.getRemovedUsers({ limit: 1 }),
        ]);
        setCounts({
          Active: active.pagination?.total ?? 0,
          Suspended: suspended.pagination?.total ?? 0,
          Removed: removed.pagination?.total ?? 0,
        });
      } catch {
        // non-fatal
      }
    })();
  }, []);

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
    [counts],
  );

  const handleSwitchTab = (tab: SlideType) => {
    setActiveTab(tab);
    setAllChecked(false);
  };

  const handleCheckboxChange = (id: string) => {
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)),
    );
  };

  const handleSelectAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    setData((prev) => prev.map((c) => ({ ...c, checked: next })));
  };

  const patchStatus = async (
    id: string,
    status: "suspended" | "removed" | "active",
  ) => {
    try {
      await adminUserService.updateUserStatus(id, status);
      toast.success(`User ${status}`);
      fetchForTab(activeTab);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleAdminSuspended = (id: string) => patchStatus(id, "suspended");
  const handleAdminRemoved = (id: string) => patchStatus(id, "removed");

  const handleReactivate = async (id: string) => {
    try {
      await adminUserService.reactivateUser(id);
      toast.success("User reactivated");
      fetchForTab(activeTab);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reactivate user",
      );
    }
  };

  const handleAdminOnboarding = async (id: string) => {
    // Onboarding = reactivate (brings removed user back to active)
    await handleReactivate(id);
  };

  useEffect(() => {
    const updateIndicator = () => {
      const activeTabIndex = tabs.findIndex((tab) => tab.label === activeTab);
      const activeContainer = tabRefs.current[activeTabIndex];
      const container = containerRef.current;
      if (activeContainer && container) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeContainer.getBoundingClientRect();
        setIndicatorStyle({
          left: tabRect.left - containerRect.left,
          width: tabRect.width,
        });
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab, tabs]);

  const renderContent = () => {
    if (isLoading) {
      return <TableSkeleton columns={5} rows={6} />;
    }
    if (data.length === 0) {
      return (
        <div className="text-center py-10 text-gray-400 text-sm font-montserrat">
          No {activeTab.toLowerCase()} users found.
        </div>
      );
    }
    const componentMap: Record<SlideType, React.ReactNode> = {
      Active: (
        <ActiveTable
          data={data}
          handleAdminSuspended={handleAdminSuspended}
          handleAdminRemoved={handleAdminRemoved}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Suspended: (
        <SuspendedTable
          data={data}
          handleReactivate={handleReactivate}
          handleAdminRemoved={handleAdminRemoved}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
      Removed: (
        <RemovedTable
          data={data}
          handleAdminOnboarding={handleAdminOnboarding}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      ),
    };
    return componentMap[activeTab];
  };

  return (
    <div className="w-[95%] mx-auto mb-5 rounded-[10px] bg-[#fefefe] shadow-md">
      <h1 className="mb-4 px-6 pt-6 text-base font-normal font-montserrat sm:text-lg">
        Approvals
      </h1>
      <div className="flex flex-col overflow-x-auto flex-nowrap">
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
