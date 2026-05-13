"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AdminUserHistoryItem,
  AdminUserSummary,
  HistoryResource,
  HistoryRole,
} from "@/services/adminUserService";
import {
  useAdminUserSummary,
  useInvalidateAdminUser,
} from "@/hooks/queries/useAdminUserQueries";
import { UserProfileBar } from "./UserProfileBar";
import { UserProfileDrawer } from "./UserProfileDrawer";
import { UserOverviewStrip } from "./UserOverviewStrip";
import { UserRecentActivityModal } from "./UserRecentActivityModal";
import { UserHistoryPanel } from "./UserHistoryPanel";
import { HistoryItemModal } from "./HistoryItemModal";

const SUPPORTED_ROLES: HistoryRole[] = ["buyer", "agent", "transporter"];

const deriveRoles = (user: AdminUserSummary | undefined): HistoryRole[] => {
  if (!user) return [];
  const collected = new Set<string>();
  if (Array.isArray(user.roles)) {
    user.roles.forEach((r) => collected.add(String(r).toLowerCase()));
  }
  if (Array.isArray(user.profession)) {
    (user.profession as string[]).forEach((r) =>
      collected.add(String(r).toLowerCase()),
    );
  } else if (typeof user.profession === "string") {
    collected.add(user.profession.toLowerCase());
  }
  if (typeof user.activeRole === "string") {
    collected.add(user.activeRole.toLowerCase());
  }
  return SUPPORTED_ROLES.filter((r) => collected.has(r));
};

interface UserDetailContainerProps {
  userId: string;
}

interface SelectedItem {
  role: HistoryRole;
  resource: HistoryResource;
  item: AdminUserHistoryItem;
}

export const UserDetailContainer: React.FC<UserDetailContainerProps> = ({
  userId,
}) => {
  const router = useRouter();
  const invalidate = useInvalidateAdminUser();
  const { data: user, isLoading, isError, error } = useAdminUserSummary(userId);

  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

  const openItem = useCallback(
    (role: HistoryRole, resource: HistoryResource, item: AdminUserHistoryItem) =>
      setSelected({ role, resource, item }),
    [],
  );
  const closeItem = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load user",
      );
    }
  }, [isError, error]);

  const availableRoles = useMemo(() => deriveRoles(user), [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonCard heightClass="h-36" />
        <SkeletonCard heightClass="h-24" />
        <SkeletonCard heightClass="h-96" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#fefefe] rounded-[10px] shadow-md p-8 text-center">
        <p className="text-sm font-montserrat text-gray-600 mb-3">
          User not found.
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/all-users")}
          className="inline-flex items-center gap-1.5 text-xs font-montserrat text-[#538e53] hover:underline cursor-pointer"
        >
          ← Back to users
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <UserProfileBar
        user={user}
        onUpdated={() => invalidate(userId)}
        onOpenProfile={() => setProfileOpen(true)}
      />
      <UserOverviewStrip
        user={user}
        availableRoles={availableRoles}
        onShowRecentActivity={() => setRecentOpen(true)}
      />
      <UserHistoryPanel
        userId={userId}
        availableRoles={availableRoles}
        onItemClick={openItem}
      />

      <UserProfileDrawer
        isOpen={profileOpen}
        user={user}
        onClose={() => setProfileOpen(false)}
      />
      <UserRecentActivityModal
        isOpen={recentOpen}
        user={user}
        availableRoles={availableRoles}
        onClose={() => setRecentOpen(false)}
        onItemClick={(role, resource, item) => {
          setRecentOpen(false);
          openItem(role, resource, item);
        }}
      />
      <HistoryItemModal
        isOpen={selected !== null}
        role={selected?.role ?? null}
        resource={selected?.resource ?? null}
        item={selected?.item ?? null}
        onClose={closeItem}
      />
    </div>
  );
};

const SkeletonCard: React.FC<{ heightClass: string }> = ({ heightClass }) => (
  <div
    className={`bg-[#fefefe] rounded-[10px] shadow-md ${heightClass} animate-pulse`}
  />
);
