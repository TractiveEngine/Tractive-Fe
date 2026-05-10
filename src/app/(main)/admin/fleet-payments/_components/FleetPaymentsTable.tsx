"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { SearchIcon } from "@/icons/Icons";
import AdminTable, {
  ColumnConfig,
} from "../../_components/table/AdminTableList";
import { FleetPaymentActionMenu } from "./FleetPaymentActionMenu";

export interface FleetPaymentRow {
  id: string;
  checked?: boolean;
  status: string;
  payerName: string;
  payerEmail: string;
  payerAvatar: string;
  fleetName: string;
  fleetImage?: string;
  plateNumber?: string;
  amount?: number;
  paymentMethod?: string;
  reason?: string;
  createdAt?: string;
}

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount?: number) =>
  typeof amount === "number" ? `₦${amount.toLocaleString()}` : "—";

const statusPill = (item: FleetPaymentRow) => {
  const s = (item.status || "").toLowerCase();
  const styles =
    s === "approved"
      ? "bg-green-50 text-green-600 border-green-100"
      : s === "pending"
        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
        : s === "rejected"
          ? "bg-red-50 text-red-600 border-red-100"
          : "bg-gray-50 text-gray-600 border-gray-200";
  const label = s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
  return (
    <span
      className={`inline-block text-[10px] font-medium font-montserrat px-2 py-0.5 rounded-full border ${styles}`}
    >
      {label}
    </span>
  );
};

const fleetCell = (item: FleetPaymentRow) => (
  <div className="flex items-center gap-2.5 min-w-0">
    <div className="relative flex-shrink-0 w-10 h-7 rounded-md overflow-hidden bg-gray-100">
      {item.fleetImage ? (
        <Image
          src={item.fleetImage}
          alt={item.fleetName}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-[8px] text-gray-400 font-montserrat">
          N/A
        </div>
      )}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[11px] md:text-[12px] font-montserrat font-medium text-[#2b2b2b] capitalize truncate">
        {item.fleetName}
      </span>
      {item.plateNumber ? (
        <span className="text-[9px] md:text-[10px] font-montserrat text-[#808080]">
          {item.plateNumber}
        </span>
      ) : null}
    </div>
  </div>
);

const columns: ColumnConfig<FleetPaymentRow>[] = [
  {
    key: "fleetName",
    header: "Fleet",
    render: fleetCell,
    minWidth: "min-w-[180px]",
  },
  {
    key: "payerName",
    header: "Payer",
    render: (item) => (
      <div className="flex flex-col">
        <span className="text-[10px] sm:text-[11px] md:text-[12px] font-montserrat font-normal text-[#2b2b2b]">
          {item.payerName}
        </span>
        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-montserrat font-normal text-[#808080]">
          {item.payerEmail}
        </span>
      </div>
    ),
    minWidth: "min-w-[180px]",
  },
  {
    key: "paymentMethod",
    header: "Method",
    minWidth: "min-w-[120px]",
    render: (item) => (
      <span className="capitalize">
        {(item.paymentMethod || "—").replace(/_/g, " ")}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    minWidth: "min-w-[100px]",
    render: (item) => <span>{formatCurrency(item.amount)}</span>,
  },
  {
    key: "status",
    header: "Status",
    minWidth: "min-w-[100px]",
    render: statusPill,
  },
  {
    key: "createdAt",
    header: "Date",
    minWidth: "min-w-[100px]",
    render: (item) => <span>{formatDate(item.createdAt)}</span>,
  },
];

interface FleetPaymentsTableProps {
  rows: FleetPaymentRow[];
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  handleRefund: (id: string) => void;
  handleCheckboxChange: (id: string) => void;
  handleSelectAll: () => void;
  allChecked: boolean;
  onRowClick?: (id: string) => void;
}

export const FleetPaymentsTable: React.FC<FleetPaymentsTableProps> = ({
  rows,
  handleApprove,
  handleReject,
  handleRefund,
  handleCheckboxChange,
  handleSelectAll,
  allChecked,
  onRowClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter(
      (r) =>
        r.payerName.toLowerCase().includes(q) ||
        r.payerEmail.toLowerCase().includes(q) ||
        r.fleetName.toLowerCase().includes(q) ||
        (r.plateNumber || "").toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q),
    );
  }, [rows, searchTerm]);

  return (
    <div className="w-full mx-auto">
      <div className="w-full bg-[#FAF7F7] mt-4 py-4 px-6">
        <div className="relative w-full sm:max-w-[320px]">
          <input
            type="text"
            placeholder="Search payer, fleet, plate"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 py-2 border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:ring-[#538e53] placeholder:text-[#808080] placeholder:font-montserrat"
            aria-label="Search fleet payments"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SearchIcon stroke="#808080" className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        {filtered.length === 0 ? (
          <div className="py-10 text-center font-montserrat text-sm text-[#808080]">
            No fleet payments to show.
          </div>
        ) : (
          <AdminTable<FleetPaymentRow>
            dataType="TransactionalData"
            columns={columns}
            initialData={filtered}
            ActionMenuComponent={FleetPaymentActionMenu}
            handleApprove={handleApprove}
            handleDecline={handleReject}
            handleRefund={handleRefund}
            handleCheckboxChange={handleCheckboxChange}
            handleSelectAll={handleSelectAll}
            allChecked={allChecked}
            onRowClick={onRowClick}
          />
        )}
      </div>
    </div>
  );
};
