"use client";
import React from "react";
import AccountMenu, { UserRole } from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
  currentRole?: UserRole;
}

export const ProfileDropDown = ({
  onLogout,
  currentRole,
}: ProfileDropDownProps) => (
  <AccountMenu onLogout={onLogout} currentRole={currentRole} />
);

// Role-specific wrappers kept for backward compatibility with existing imports.
export const Agent_ProfileDropDown = (props: ProfileDropDownProps) => (
  <ProfileDropDown {...props} currentRole="agent" />
);

export const Buyer_ProfileDropDown = (props: ProfileDropDownProps) => (
  <ProfileDropDown {...props} currentRole="buyer" />
);

export const Transporter_ProfileDropDown = (props: ProfileDropDownProps) => (
  <ProfileDropDown {...props} currentRole="transporter" />
);

export default ProfileDropDown;
