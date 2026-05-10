"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import {
  adminUserService,
  AdminProfession,
  AdminUser,
  AdminUserStatus,
} from "@/services/adminUserService";

interface UserDetailModalProps {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusBadge = (status?: string) => {
  const s = (status || "").toLowerCase();
  const styles =
    s === "active"
      ? "bg-green-50 text-green-600 border-green-100"
      : s === "suspended"
      ? "bg-yellow-50 text-yellow-700 border-yellow-100"
      : s === "removed"
      ? "bg-red-50 text-red-600 border-red-100"
      : "bg-gray-50 text-gray-600 border-gray-200";
  return { styles, label: s ? s.charAt(0).toUpperCase() + s.slice(1) : "—" };
};

const pickProfession = (u: AdminUser): AdminProfession | undefined => {
  const active = (u.activeRole as string) || "";
  const list = Array.isArray(u.profession) ? (u.profession as string[]) : [];
  const candidate = (active || list[0] || "").toLowerCase();
  if (
    candidate === "buyer" ||
    candidate === "agent" ||
    candidate === "transporter" ||
    candidate === "admin"
  ) {
    return candidate as AdminProfession;
  }
  return undefined;
};

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  userId,
  onClose,
  onUpdated,
}) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<
    "suspend" | "reactivate" | "remove" | null
  >(null);

  useEffect(() => {
    if (!isOpen || !userId) return;
    let cancelled = false;
    setIsLoading(true);
    setUser(null);
    adminUserService
      .getUserById(userId)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(
          err instanceof Error ? err.message : "Failed to load user",
        );
        onClose();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, userId, onClose]);

  const badge = statusBadge(user?.status as string | undefined);
  const professions = Array.isArray(user?.profession)
    ? (user!.profession as string[])
    : user?.profession
    ? [user.profession as string]
    : [];
  const currentStatus = ((user?.status as string) || "").toLowerCase();

  const patchStatus = async (
    action: "suspend" | "remove",
    status: AdminUserStatus,
  ) => {
    if (!user || !userId) return;
    const profession = pickProfession(user);
    if (!profession) {
      toast.error("Cannot determine user profession for this action");
      return;
    }
    setPendingAction(action);
    try {
      const updated = await adminUserService.updateUser(userId, {
        status,
        profession,
      });
      setUser(updated || { ...user, status });
      toast.success(
        action === "suspend" ? "User suspended" : "User removed",
      );
      onUpdated?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update user",
      );
    } finally {
      setPendingAction(null);
    }
  };

  const reactivate = async () => {
    if (!userId || !user) return;
    setPendingAction("reactivate");
    try {
      const updated = await adminUserService.reactivateUser(userId);
      setUser(updated || { ...user, status: "active" });
      toast.success("User reactivated");
      onUpdated?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reactivate user",
      );
    } finally {
      setPendingAction(null);
    }
  };

  const isBusy = pendingAction !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#2b2b2b94] flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isBusy) onClose();
          }}
        >
          <motion.div
            className="bg-white rounded-[12px] w-full max-w-[560px] shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-montserrat font-semibold text-base text-[#2b2b2b]">
                User Details
              </h3>
              <button
                onClick={onClose}
                disabled={isBusy}
                className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-grow px-5 py-5">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-7 w-7 border-4 border-[#538e53] border-t-transparent rounded-full" />
                </div>
              ) : user ? (
                <div className="space-y-5">
                  {/* Identity */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={
                          (user.avatar as string) ||
                          "/images/placeholder-avatar.png"
                        }
                        alt={(user.name as string) || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-montserrat font-semibold text-[15px] text-[#2b2b2b]">
                          {(user.name as string) || "Unknown"}
                        </h4>
                        <span
                          className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge.styles}`}
                        >
                          {badge.label}
                        </span>
                        {user.isVerified ? (
                          <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border bg-blue-50 text-blue-600 border-blue-100">
                            Verified
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-gray-500 font-montserrat mt-0.5 truncate">
                        {(user.email as string) || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailRow label="Phone" value={user.phone as string} />
                    <DetailRow
                      label="Active Role"
                      value={(user.activeRole as string) || "—"}
                    />
                    <DetailRow
                      label="Professions"
                      value={professions.length ? professions.join(", ") : "—"}
                    />
                    <DetailRow
                      label="Agent Approval"
                      value={(user.agentApprovalStatus as string) || "—"}
                    />
                    <DetailRow
                      label="Created"
                      value={formatDate(user.createdAt as string)}
                    />
                    <DetailRow
                      label="Updated"
                      value={formatDate(user.updatedAt as string)}
                    />
                    <DetailRow
                      label="User ID"
                      value={(user._id as string) || "—"}
                      className="sm:col-span-2"
                      mono
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer actions */}
            {!isLoading && user && (
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
                {currentStatus === "active" && (
                  <>
                    <ActionButton
                      label="Suspend"
                      tone="warning"
                      loading={pendingAction === "suspend"}
                      disabled={isBusy}
                      onClick={() => patchStatus("suspend", "suspended")}
                    />
                    <ActionButton
                      label="Remove"
                      tone="danger"
                      loading={pendingAction === "remove"}
                      disabled={isBusy}
                      onClick={() => patchStatus("remove", "removed")}
                    />
                  </>
                )}
                {currentStatus === "suspended" && (
                  <>
                    <ActionButton
                      label="Reactivate"
                      tone="success"
                      loading={pendingAction === "reactivate"}
                      disabled={isBusy}
                      onClick={reactivate}
                    />
                    <ActionButton
                      label="Remove"
                      tone="danger"
                      loading={pendingAction === "remove"}
                      disabled={isBusy}
                      onClick={() => patchStatus("remove", "removed")}
                    />
                  </>
                )}
                {currentStatus === "removed" && (
                  <ActionButton
                    label="Reactivate"
                    tone="success"
                    loading={pendingAction === "reactivate"}
                    disabled={isBusy}
                    onClick={reactivate}
                  />
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ActionButton: React.FC<{
  label: string;
  tone: "success" | "warning" | "danger";
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ label, tone, loading, disabled, onClick }) => {
  const colors =
    tone === "success"
      ? "bg-[#538e53] hover:bg-[#467a46]"
      : tone === "warning"
      ? "bg-[#d97706] hover:bg-[#b45309]"
      : "bg-[#D32F2F] hover:bg-[#b71c1c]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-montserrat font-medium text-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${colors}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Working...
        </>
      ) : (
        label
      )}
    </button>
  );
};

const DetailRow: React.FC<{
  label: string;
  value?: string | null;
  className?: string;
  mono?: boolean;
}> = ({ label, value, className, mono }) => (
  <div className={`bg-gray-50 rounded-lg px-3 py-2.5 ${className || ""}`}>
    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-montserrat mb-1">
      {label}
    </p>
    <p
      className={`text-sm text-[#2b2b2b] break-words ${
        mono ? "font-mono text-xs" : "font-montserrat"
      }`}
    >
      {value || "—"}
    </p>
  </div>
);
