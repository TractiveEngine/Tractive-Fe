"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ApprovalsAgents } from "./_components/ApprovalsAgents";
import { ApprovalTransporters } from "./_components/ApprovalTransporters";
import { AgentsProps, TransportersProps } from "@/utils/Approvals";
import {
  approvalService,
  ApprovalDecision,
} from "@/services/approvalService";
import { ConfirmActionModal } from "../_components/ConfirmActionModal";
import { UserDetailsModal } from "../_components/UserDetailsModal";
import { BulkAction } from "../_components/BulkActionBar";

type SlideType = "Agents" | "Transporters";
type ApprovalKind = "agent" | "transporter";

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

interface PendingAction {
  kind: ApprovalKind;
  id: string;
  decision: ApprovalDecision;
}

interface PendingBulk {
  kind: ApprovalKind;
  ids: string[];
  decision: ApprovalDecision;
}

export default function ApprovalPage() {
  const [activeTab, setActiveTab] = useState<SlideType>("Agents");

  const [agents, setAgents] = useState<AgentsProps[]>([]);
  const [transporters, setTransporters] = useState<TransportersProps[]>([]);
  const [agentsLoading, setAgentsLoading] = useState<boolean>(true);
  const [transportersLoading, setTransportersLoading] = useState<boolean>(true);

  const [allChecked, setAllChecked] = useState<boolean>(false);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<
    AgentsProps | TransportersProps | null
  >(null);
  const [selectedKind, setSelectedKind] = useState<ApprovalKind>("agent");

  const [pendingBulk, setPendingBulk] = useState<PendingBulk | null>(null);

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });

  const fetchAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const { data } = await approvalService.getPendingAgents({ limit: 10 });
      setAgents(data.map((a) => ({ ...a, checked: false })));
    } catch {
      setAgents([]);
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  const fetchTransporters = useCallback(async () => {
    setTransportersLoading(true);
    try {
      const { data } = await approvalService.getPendingTransporters({
        limit: 10,
      });
      setTransporters(data.map((t) => ({ ...t, checked: false })));
    } catch {
      setTransporters([]);
    } finally {
      setTransportersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
    fetchTransporters();
  }, [fetchAgents, fetchTransporters]);

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
        colorClassFaded: "text-[#fefefe]",
      },
      {
        id: "transporters-tab",
        label: "Transporters",
        displayLabel: "Transporters",
        count: counts.Transporters,
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
    if (activeTab === "Agents") {
      setAgents(
        agents.map((agent) =>
          agent.id === id ? { ...agent, checked: !agent.checked } : agent,
        ),
      );
    } else {
      setTransporters(
        transporters.map((t) =>
          t.id === id ? { ...t, checked: !t.checked } : t,
        ),
      );
    }
  };

  const handleSelectAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    if (activeTab === "Agents") {
      setAgents(agents.map((agent) => ({ ...agent, checked: newAllChecked })));
    } else {
      setTransporters(
        transporters.map((t) => ({ ...t, checked: newAllChecked })),
      );
    }
  };

  const requestAction = (action: PendingAction) => setPendingAction(action);

  const handleAgentApprove = (id: string) =>
    requestAction({ kind: "agent", id, decision: "approved" });
  const handleAgentDecline = (id: string) =>
    requestAction({ kind: "agent", id, decision: "rejected" });
  const handleTransporterApprove = (id: string) =>
    requestAction({ kind: "transporter", id, decision: "approved" });
  const handleTransporterDecline = (id: string) =>
    requestAction({ kind: "transporter", id, decision: "rejected" });

  const handleAgentRowClick = (id: string) => {
    const found = agents.find((a) => a.id === id);
    if (!found) return;
    setSelectedKind("agent");
    setSelectedUser(found);
  };

  const handleTransporterRowClick = (id: string) => {
    const found = transporters.find((t) => t.id === id);
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
    requestAction({ kind: selectedKind, id, decision: "approved" });
  };

  const rejectFromDetails = (id: string) => {
    setSelectedUser(null);
    requestAction({ kind: selectedKind, id, decision: "rejected" });
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

  const requestBulk = (decision: ApprovalDecision) => {
    if (selectedIds.length === 0) return;
    setPendingBulk({
      kind: activeTab === "Agents" ? "agent" : "transporter",
      ids: selectedIds,
      decision,
    });
  };

  const cancelPendingBulk = () => {
    if (isSubmitting) return;
    setPendingBulk(null);
  };

  const confirmPendingBulk = async () => {
    if (!pendingBulk) return;
    const { kind, ids, decision } = pendingBulk;
    const reason =
      decision === "approved" ? "Bulk approval" : "Bulk rejection";

    setIsSubmitting(true);
    try {
      if (kind === "agent") {
        await approvalService.bulkUpdateAgentApproval({
          agentIds: ids,
          status: decision,
          reason,
        });
      } else {
        await approvalService.bulkUpdateTransporterApproval({
          transporterIds: ids,
          status: decision,
          reason,
        });
      }
      toast.success(
        decision === "approved"
          ? `${ids.length} ${kind}${ids.length > 1 ? "s" : ""} approved`
          : `${ids.length} ${kind}${ids.length > 1 ? "s" : ""} rejected`,
      );
      clearSelection();
      if (kind === "agent") {
        await fetchAgents();
      } else {
        await fetchTransporters();
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
            onClick: () => requestBulk("approved"),
          },
          {
            id: "decline",
            label: "Decline",
            tone: "danger",
            onClick: () => requestBulk("rejected"),
          },
        ];

  const bulkDisabled = isSubmitting;

  const cancelPendingAction = () => {
    if (isSubmitting) return;
    setPendingAction(null);
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    const { kind, id, decision } = pendingAction;
    const reason =
      decision === "approved" ? "Approved by admin" : "Rejected by admin";

    setIsSubmitting(true);
    try {
      if (kind === "agent") {
        await approvalService.updateAgentApproval(id, {
          status: decision,
          reason,
        });
        toast.success(
          decision === "approved" ? "Agent approved" : "Agent rejected",
        );
        await fetchAgents();
      } else {
        await approvalService.updateTransporterApproval(id, {
          status: decision,
          reason,
        });
        toast.success(
          decision === "approved"
            ? "Transporter approved"
            : "Transporter rejected",
        );
        await fetchTransporters();
      }
      setPendingAction(null);
    } catch {
      // Error toast is shown by the service layer.
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
        const left = tabRect.left - containerRect.left;
        const width = tabRect.width;
        setIndicatorStyle({ left, width });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab, tabs]);

  const renderContent = () => {
    const componentMap: Record<SlideType, React.ReactNode> = {
      Agents: (
        <ApprovalsAgents
          data={agents}
          isLoading={agentsLoading}
          handleAgentApprove={handleAgentApprove}
          handleAgentDecline={handleAgentDecline}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
          onRowClick={handleAgentRowClick}
          bulkActions={bulkActions}
          bulkDisabled={bulkDisabled}
        />
      ),
      Transporters: (
        <ApprovalTransporters
          data={transporters}
          isLoading={transportersLoading}
          handleTransporterApprove={handleTransporterApprove}
          handleTransporterDecline={handleTransporterDecline}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
          onRowClick={handleTransporterRowClick}
          bulkActions={bulkActions}
          bulkDisabled={bulkDisabled}
        />
      ),
    };
    return componentMap[activeTab];
  };

  const modalSubject =
    pendingAction?.kind === "agent" ? "agent" : "transporter";
  const modalIsApprove = pendingAction?.decision === "approved";

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

      <UserDetailsModal
        isOpen={!!selectedUser}
        kind={selectedKind}
        user={selectedUser}
        isSubmitting={isSubmitting}
        onClose={closeDetails}
        onApprove={approveFromDetails}
        onReject={rejectFromDetails}
      />

      <ConfirmActionModal
        isOpen={!!pendingAction}
        title={`${modalIsApprove ? "Approve" : "Reject"} ${modalSubject}?`}
        description={
          modalIsApprove
            ? `This will approve the ${modalSubject} and grant them access to the platform.`
            : `This will reject the ${modalSubject}'s application.`
        }
        confirmLabel={modalIsApprove ? "Approve" : "Reject"}
        tone={modalIsApprove ? "success" : "danger"}
        isSubmitting={isSubmitting}
        onCancel={cancelPendingAction}
        onConfirm={confirmPendingAction}
      />

      <ConfirmActionModal
        isOpen={!!pendingBulk}
        title={
          pendingBulk
            ? `${pendingBulk.decision === "approved" ? "Approve" : "Reject"} ${pendingBulk.ids.length} ${pendingBulk.kind}${pendingBulk.ids.length > 1 ? "s" : ""}?`
            : ""
        }
        description={
          pendingBulk
            ? pendingBulk.decision === "approved"
              ? `This will approve ${pendingBulk.ids.length} selected ${pendingBulk.kind}${pendingBulk.ids.length > 1 ? "s" : ""} and grant access to the platform.`
              : `This will reject ${pendingBulk.ids.length} selected ${pendingBulk.kind}${pendingBulk.ids.length > 1 ? "s' applications" : "'s application"}.`
            : ""
        }
        confirmLabel={
          pendingBulk?.decision === "approved" ? "Approve all" : "Reject all"
        }
        tone={pendingBulk?.decision === "approved" ? "success" : "danger"}
        isSubmitting={isSubmitting}
        onCancel={cancelPendingBulk}
        onConfirm={confirmPendingBulk}
      />
    </div>
  );
}
