"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AdminUserHistoryItem,
  HISTORY_RESOURCE_LABELS,
  HISTORY_RESOURCES_BY_ROLE,
  HistoryResource,
  HistoryRole,
} from "@/services/adminUserService";
import { useAdminUserHistory } from "@/hooks/queries/useAdminUserQueries";
import { UserHistoryTable } from "./UserHistoryTable";
import { getHistoryColumns } from "./historyColumns";
import { TableSkeleton } from "../../../_components/TableSkeleton";

const ROLE_LABELS: Record<HistoryRole, string> = {
  buyer: "Buyer",
  agent: "Agent",
  transporter: "Transporter",
};

interface UserHistoryPanelProps {
  userId: string;
  availableRoles: HistoryRole[];
  onItemClick: (
    role: HistoryRole,
    resource: HistoryResource,
    item: AdminUserHistoryItem,
  ) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const UserHistoryPanel: React.FC<UserHistoryPanelProps> = ({
  userId,
  availableRoles,
  onItemClick,
}) => {
  const [activeRole, setActiveRole] = useState<HistoryRole | null>(
    availableRoles[0] ?? null,
  );
  const [activeResource, setActiveResource] = useState<HistoryResource | null>(
    availableRoles[0] ? HISTORY_RESOURCES_BY_ROLE[availableRoles[0]][0] : null,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Reflect changes to the list of roles (e.g. after a status mutation refetch)
  useEffect(() => {
    if (!activeRole && availableRoles[0]) {
      setActiveRole(availableRoles[0]);
      setActiveResource(HISTORY_RESOURCES_BY_ROLE[availableRoles[0]][0]);
    }
  }, [availableRoles, activeRole]);

  // Reset page when role / resource changes
  useEffect(() => {
    setPage(1);
  }, [activeRole, activeResource]);

  // Role tab underline indicator
  const roleTabsRef = useRef<HTMLDivElement>(null);
  const roleTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!activeRole) return;
    const index = availableRoles.indexOf(activeRole);
    const container = roleTabsRef.current;
    const tab = roleTabRefs.current[index];
    if (!container || !tab) return;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    setIndicator({ left: tabRect.left - containerRect.left, width: tabRect.width });
  }, [activeRole, availableRoles]);

  const resourcesForRole = useMemo<HistoryResource[]>(
    () => (activeRole ? HISTORY_RESOURCES_BY_ROLE[activeRole] : []),
    [activeRole],
  );

  const historyParams = useMemo(
    () =>
      activeRole && activeResource
        ? { role: activeRole, resource: activeResource, page, limit }
        : null,
    [activeRole, activeResource, page, limit],
  );

  const { data, isLoading, isFetching, isError, error } = useAdminUserHistory(
    historyParams ? userId : undefined,
    historyParams ?? { role: "buyer", resource: "orders", page: 1, limit: 10 },
  );

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load history",
      );
    }
  }, [isError, error]);

  if (availableRoles.length === 0 || !activeRole || !activeResource) {
    return (
      <div className="bg-[#fefefe] rounded-[10px] shadow-md p-8 text-center">
        <p className="text-sm font-montserrat text-gray-500">
          This user has no buyer, agent, or transporter activity.
        </p>
      </div>
    );
  }

  const items = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const columns = getHistoryColumns(activeRole, activeResource);

  return (
    <div className="bg-[#fefefe] rounded-[10px] shadow-md">
      {/* Role tabs */}
      <div className="px-6 pt-5">
        <h2 className="font-montserrat text-base font-normal sm:text-lg mb-4">
          Activity history
        </h2>
        <div
          className="relative flex items-center gap-3 flex-nowrap overflow-x-auto hide-scrollbar"
          ref={roleTabsRef}
          role="tablist"
          aria-label="Role"
        >
          {availableRoles.map((role, index) => (
            <button
              key={role}
              ref={(el) => {
                roleTabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={activeRole === role}
              onClick={() => {
                setActiveRole(role);
                setActiveResource(HISTORY_RESOURCES_BY_ROLE[role][0]);
              }}
              className={`cursor-pointer px-2 pb-2 text-sm sm:text-base font-medium font-montserrat transition-colors duration-200 ${
                activeRole === role ? "text-[#538e53]" : "text-[#2b2b2b]"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
          <motion.div
            className="absolute -bottom-[1px] h-[3px] rounded-t-[10px] bg-[#538e53]"
            animate={{ left: indicator.left, width: indicator.width }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        <div className="h-[1px] w-full bg-gray-200" />
      </div>

      {/* Resource sub-tabs */}
      <div className="px-6 pt-4 flex flex-wrap gap-2">
        {resourcesForRole.map((resource) => {
          const selected = activeResource === resource;
          return (
            <button
              key={resource}
              type="button"
              onClick={() => setActiveResource(resource)}
              className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-montserrat font-medium border transition-colors ${
                selected
                  ? "bg-[#538e53] text-white border-[#538e53]"
                  : "bg-white text-[#2b2b2b] border-gray-200 hover:border-[#538e53] hover:text-[#538e53]"
              }`}
            >
              {HISTORY_RESOURCE_LABELS[resource]}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton
            columns={columns.length}
            rows={limit > 6 ? 6 : limit}
            showCheckbox={false}
            showAvatar={false}
            showActionMenu={false}
          />
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm font-montserrat">
            No {HISTORY_RESOURCE_LABELS[activeResource].toLowerCase()} yet.
          </div>
        ) : (
          <div
            className={`${
              isFetching ? "opacity-60 transition-opacity" : ""
            }`}
          >
            <UserHistoryTable
              columns={columns}
              data={items}
              onRowClick={(item) => onItemClick(activeRole, activeResource, item)}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-[10px]">
          <div className="flex items-center gap-2 text-xs font-montserrat text-gray-600">
            <span>Rows per page</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-xs font-montserrat bg-white focus:outline-none focus:border-[#538e53] cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-3 text-gray-500">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, total)} of {total}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-montserrat text-gray-600 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-montserrat text-gray-600 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-montserrat text-gray-600 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
