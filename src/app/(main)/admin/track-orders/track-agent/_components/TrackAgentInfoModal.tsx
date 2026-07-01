"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { XModalIcon } from "@/app/(main)/transporter/_components/Icons/TransporterIcons";
import { OrderPartyInfo } from "@/utils/TrackAgentData";

export type AgentInfoMode = "buyer" | "seller";

interface TrackAgentInfoModalProps {
  mode: AgentInfoMode;
  /** Buyer is a single party; seller can be several on a multi-producer order. */
  parties: OrderPartyInfo[];
  onClose: () => void;
}

const Field: React.FC<{ label: string; value?: string | null }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-montserrat text-[11px] text-[#808080]">{label}</span>
    <span className="font-montserrat text-[13px] text-[#2b2b2b] break-words">
      {value && value.trim() ? value : "—"}
    </span>
  </div>
);

const PartyCard: React.FC<{ party: OrderPartyInfo }> = ({ party }) => (
  <div className="flex flex-col gap-3 rounded-[10px] border border-[#e0e0e0] p-4">
    <div className="flex items-center gap-3">
      {party.image ? (
        <Image
          src={party.image}
          alt={party.name}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full object-cover"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center font-montserrat font-bold text-[#2b2b2b]">
          {(party.businessName || party.name || "?").charAt(0).toUpperCase()}
        </div>
      )}
      <span className="font-montserrat text-[14px] font-medium text-[#2b2b2b]">
        {party.businessName?.trim() || party.name || "—"}
      </span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="Name" value={party.name} />
      <Field label="Phone" value={party.phone} />
      <Field label="Email" value={party.email} />
      <Field label="State" value={party.state} />
      <Field label="Address" value={party.address} />
    </div>
  </div>
);

/**
 * Read-only buyer/seller details dialog for the admin track-agent page (A9).
 * Renders the party details already carried on the loaded list row — no extra
 * fetch — mirroring the transporter-side `TrackTransporterInfoModal`.
 */
export const TrackAgentInfoModal: React.FC<TrackAgentInfoModalProps> = ({
  mode,
  parties,
  onClose,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const title = mode === "buyer" ? "Buyer Information" : "Seller Information";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#2b2b2bbc] flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#fefefe] rounded-lg w-full max-w-[520px] max-h-[92vh] overflow-y-auto my-auto"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-[#fefefe] px-4 py-3 border-b border-[#e0e0e0] rounded-t-lg">
            <h2 className="font-montserrat font-medium text-[15px] sm:text-[16px] text-[#2b2b2b]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors"
              aria-label="Close"
            >
              <XModalIcon />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {parties.length === 0 ? (
              <p className="font-montserrat text-[13px] text-[#808080] py-6 text-center">
                No {mode} information on this order.
              </p>
            ) : (
              parties.map((party, i) => (
                <PartyCard key={party.id || i} party={party} />
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
