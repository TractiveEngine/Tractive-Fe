"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { approvalService } from "@/services/approvalService";
import { AgentsProps, TransportersProps } from "@/utils/Approvals";
import AdminTable, {
  ColumnConfig,
} from "../_components/table/AdminTableList";
import { TableSkeleton } from "../_components/TableSkeleton";
import { RejectedActionMenu } from "./_components/RejectedActionMenu";
import { ConfirmActionModal } from "../_components/ConfirmActionModal";
import { UserDetailsModal } from "../_components/UserDetailsModal";
import { BulkAction } from "../_components/BulkActionBar";
import { BulkActionButtons } from "../_components/BulkActionButtons";

type SlideType = "Agents" | "Transporters";

interface IndicatorStyle {
  left: number;
  width: number;
}

interface TabConfig {
  id: string;
  label: SlideType;
  displayLabel: string;
  count: number;
  colorClass: string;
  textColor: string;
}

interface RejectedRow {
  id: string;
  fullname: string;
  email: string;
  image: string;
  location: string;
  mobile: string;
  date: string;
  checked: boolean;
}

const mapAgentToRow = (a: AgentsProps): RejectedRow => ({
  id: a.id,
  fullname: a.fullname,
  email: a.email,
  image: a.image,
  location: a.location,
  mobile: a.mobile,
  date: a.date,
  checked: false,
});

const mapTransporterToRow = (t: TransportersProps): RejectedRow => ({
  id: t.id,
  fullname: t.fullname,
  email: t.email,
  image: t.image,
  location: t.location,
  mobile: t.mobile,
  date: t.date,
  checked: false,
});

const buildColumns = (
  professionLabel: string,
): ColumnConfig<RejectedRow>[] => [
  {
    key: "fullname",
    header: "Full Name",
    render: (item) => (
      <div className="flex items-center gap-3">
        <Image
          src={item.image}
          alt={item.fullname}
          width={32}
          height={32}
          className="w-9 h-9 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-[12px] font-montserrat font-normal text-[#2b2b2b]">
            {item.fullname}
          </span>
          <span className="text-[11px] font-montserrat font-normal text-[#808080]">
            {item.email}
          </span>
        </div>
      </div>
    ),
    minWidth: "min-w-[200px]",
  },
  { key: "location", header: "Location", minWidth: "min-w-[120px]" },
  {
    key: "profession",
    header: "Profession",
    render: () => <span>{professionLabel}</span>,
    minWidth: "min-w-[100px]",
  },
  { key: "mobile", header: "Mobile", minWidth: "min-w-[100px]" },
  { key: "date", header: "Date", minWidth: "min-w-[100px]" },
];

export default function RejectedPage() {
  const [activeTab, setActiveTab] = useState<SlideType>("Agents");

  const [agents, setAgents] = useState<RejectedRow[]>([]);
  const [transporters, setTransporters] = useState<RejectedRow[]>([]);
  const [agentsRaw, setAgentsRaw] = useState<AgentsProps[]>([]);
  const [transportersRaw, setTransportersRaw] = useState<TransportersProps[]>(
    [],
  );
  const [agentsLoading, setAgentsLoading] = useState<boolean>(true);
  const [transportersLoading, setTransportersLoading] = useState<boolean>(true);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingKind, setPendingKind] = useState<"agent" | "transporter">(
    "agent",
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<
    AgentsProps | TransportersProps | null
  >(null);
  const [selectedKind, setSelectedKind] = useState<"agent" | "transporter">(
    "agent",
  );

  const [pendingBulk, setPendingBulk] = useState<{
    kind: "agent" | "transporter";
    ids: string[];
  } | null>(null);

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });

  const fetchRejectedAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const { data } = await approvalService.getPendingAgents({
        status: "rejected",
        limit: 10,
      });
      setAgents(data.map(mapAgentToRow));
      setAgentsRaw(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load rejected agents",
      );
      setAgents([]);
      setAgentsRaw([]);
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  const fetchRejectedTransporters = useCallback(async () => {
    setTransportersLoading(true);
    try {
      const { data } = await approvalService.getPendingTransporters({
        status: "rejected",
        limit: 10,
      });
      setTransporters(data.map(mapTransporterToRow));
      setTransportersRaw(data);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to load rejected transporters",
      );
      setTransporters([]);
      setTransportersRaw([]);
    } finally {
      setTransportersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRejectedAgents();
    fetchRejectedTransporters();
  }, [fetchRejectedAgents, fetchRejectedTransporters]);

  const counts = useMemo(
    () => ({
      Agents: agents.length,
      Transporters: transporters.length,
    }),
    [agents, transporters],
  );

  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "agents-tab",
        label: "Agents",
        displayLabel: "Agents",
        count: counts.Agents,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
      },
      {
        id: "transporters-tab",
        label: "Transporters",
        displayLabel: "Transporters",
        count: counts.Transporters,
        colorClass: "bg-[#538e53]",
        textColor: "text-[#538e53]",
      },
    ],
    [counts],
  );

  const handleSwitchTab = (tab: SlideType) => {
    setActiveTab(tab);
    setAllChecked(false);
  };

  const handleCheckboxChange = (id: string) => {
    if (activeTab === "Agents") {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)),
      );
    } else {
      setTransporters((prev) =>
        prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)),
      );
    }
  };

  const handleSelectAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    if (activeTab === "Agents") {
      setAgents((prev) => prev.map((a) => ({ ...a, checked: next })));
    } else {
      setTransporters((prev) => prev.map((t) => ({ ...t, checked: next })));
    }
  };

  const requestApprove = (kind: "agent" | "transporter", id: string) => {
    setPendingKind(kind);
    setPendingId(id);
  };

  const handleAgentApprove = (id: string) => requestApprove("agent", id);
  const handleTransporterApprove = (id: string) =>
    requestApprove("transporter", id);

  const handleAgentRowClick = (id: string) => {
    const found = agentsRaw.find((a) => a.id === id);
    if (!found) return;
    setSelectedKind("agent");
    setSelectedUser(found);
  };

  const handleTransporterRowClick = (id: string) => {
    const found = transportersRaw.find((t) => t.id === id);
    if (!found) return;
    setSelectedKind("transporter");
    setSelectedUser(found);
  };

  const closeDetails = () => {
    if (isSubmitting) return;
    setSelectedUser(null);
  };

  const approveFromDetails = (id: string) => {
    setSelectedUser(null);
    requestApprove(selectedKind, id);
  };

  const selectedAgentIds = useMemo(
    () => agents.filter((a) => a.checked).map((a) => a.id),
    [agents],
  );
  const selectedTransporterIds = useMemo(
    () => transporters.filter((t) => t.checked).map((t) => t.id),
    [transporters],
  );

  const selectedIds =
    activeTab === "Agents" ? selectedAgentIds : selectedTransporterIds;

  const clearSelection = () => {
    setAllChecked(false);
    if (activeTab === "Agents") {
      setAgents((prev) => prev.map((a) => ({ ...a, checked: false })));
    } else {
      setTransporters((prev) => prev.map((t) => ({ ...t, checked: false })));
    }
  };

  const requestBulkApprove = () => {
    if (selectedIds.length === 0) return;
    setPendingBulk({
      kind: activeTab === "Agents" ? "agent" : "transporter",
      ids: selectedIds,
    });
  };

  const cancelPendingBulk = () => {
    if (isSubmitting) return;
    setPendingBulk(null);
  };

  const confirmPendingBulk = async () => {
    if (!pendingBulk) return;
    const { kind, ids } = pendingBulk;
    setIsSubmitting(true);
    try {
      if (kind === "agent") {
        await approvalService.bulkUpdateAgentApproval({
          agentIds: ids,
          status: "approved",
          reason: "Bulk approval",
        });
      } else {
        await approvalService.bulkUpdateTransporterApproval({
          transporterIds: ids,
          status: "approved",
          reason: "Bulk approval",
        });
      }
      toast.success(
        `${ids.length} ${kind}${ids.length > 1 ? "s" : ""} approved`,
      );
      clearSelection();
      if (kind === "agent") {
        await fetchRejectedAgents();
      } else {
        await fetchRejectedTransporters();
      }
      setPendingBulk(null);
    } catch {
      // service layer toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  const bulkActions: BulkAction[] =
    selectedIds.length === 0
      ? []
      : [
          {
            id: "approve",
            label: "Approve",
            tone: "success",
            onClick: requestBulkApprove,
          },
        ];

  const bulkDisabled = isSubmitting;

  const cancelPending = () => {
    if (isSubmitting) return;
    setPendingId(null);
  };

  const confirmApprove = async () => {
    if (!pendingId) return;
    setIsSubmitting(true);
    try {
      if (pendingKind === "agent") {
        await approvalService.updateAgentApproval(pendingId, {
          status: "approved",
          reason: "Approved by admin",
        });
        toast.success("Agent approved");
        await fetchRejectedAgents();
      } else {
        await approvalService.updateTransporterApproval(pendingId, {
          status: "approved",
          reason: "Approved by admin",
        });
        toast.success("Transporter approved");
        await fetchRejectedTransporters();
      }
      setPendingId(null);
    } catch {
      // service layer already toasts
    } finally {
      setIsSubmitting(false);
    }
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
    if (activeTab === "Agents") {
      if (agentsLoading) return <TableSkeleton columns={5} rows={6} />;
      return (
        <>
          <AdminTable<RejectedRow>
            dataType="AgentsData"
            columns={buildColumns("Agent")}
            initialData={agents}
            ActionMenuComponent={RejectedActionMenu}
            handleAgentApprove={handleAgentApprove}
            handleCheckboxChange={handleCheckboxChange}
            handleSelectAll={handleSelectAll}
            allChecked={allChecked}
            onRowClick={handleAgentRowClick}
          />
          {agents.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm font-montserrat">
              No rejected agents.
            </div>
          )}
        </>
      );
    }
    if (transportersLoading) return <TableSkeleton columns={5} rows={6} />;
    return (
      <>
        <AdminTable<RejectedRow>
          dataType="TransportersData"
          columns={buildColumns("Transporter")}
          initialData={transporters}
          ActionMenuComponent={RejectedActionMenu}
          handleTransporterApprove={handleTransporterApprove}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
          onRowClick={handleTransporterRowClick}
        />
        {transporters.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm font-montserrat">
            No rejected transporters.
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-[95%] mx-auto mb-5 rounded-[10px] bg-[#fefefe] shadow-md">
      <h1 className="mb-4 px-6 pt-6 text-base font-normal font-montserrat sm:text-lg">
        Rejected
      </h1>
      <div className="flex flex-col overflow-x-auto flex-nowrap">
        <div
          className="relative mb-2 flex items-center gap-3 px-6 flex-nowrap"
          ref={containerRef}
          role="tablist"
          aria-label="Rejected user tabs"
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className="cursor-pointer relative flex items-center gap-1 shrink-0"
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
        <div className="h-px w-full bg-gray-200" />
      </div>

      <div className="flex justify-end px-6 mt-3">
        <BulkActionButtons actions={bulkActions} disabled={bulkDisabled} />
      </div>

      <div
        className="mb-4"
        role="tabpanel"
        id={`${activeTab.toLowerCase()}-panel`}
        aria-labelledby={tabs.find((tab) => tab.label === activeTab)?.id}
      >
        {renderContent()}
      </div>

      <UserDetailsModal
        isOpen={!!selectedUser}
        kind={selectedKind}
        user={selectedUser}
        canReject={false}
        isSubmitting={isSubmitting}
        onClose={closeDetails}
        onApprove={approveFromDetails}
      />

      <ConfirmActionModal
        isOpen={!!pendingId}
        title={`Approve ${pendingKind}?`}
        description={`This will approve the ${pendingKind} and grant them access to the platform.`}
        confirmLabel="Approve"
        tone="success"
        isSubmitting={isSubmitting}
        onCancel={cancelPending}
        onConfirm={confirmApprove}
      />

      <ConfirmActionModal
        isOpen={!!pendingBulk}
        title={
          pendingBulk
            ? `Approve ${pendingBulk.ids.length} ${pendingBulk.kind}${pendingBulk.ids.length > 1 ? "s" : ""}?`
            : ""
        }
        description={
          pendingBulk
            ? `This will approve ${pendingBulk.ids.length} selected ${pendingBulk.kind}${pendingBulk.ids.length > 1 ? "s" : ""} and grant access to the platform.`
            : ""
        }
        confirmLabel="Approve all"
        tone="success"
        isSubmitting={isSubmitting}
        onCancel={cancelPendingBulk}
        onConfirm={confirmPendingBulk}
      />
    </div>
  );
}
