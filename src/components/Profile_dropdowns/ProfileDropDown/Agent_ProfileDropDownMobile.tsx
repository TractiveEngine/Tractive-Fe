"use client";
import React from "react";
import AccountMenu from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Agent_ProfileDropDownMobile = ({
  onLogout,
}: ProfileDropDownProps) => (
  <AccountMenu onLogout={onLogout} currentRole="agent" variant="mobile" />
);

export default Agent_ProfileDropDownMobile;
