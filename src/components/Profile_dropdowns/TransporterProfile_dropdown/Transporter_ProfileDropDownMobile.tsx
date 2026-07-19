"use client";
import React from "react";
import AccountMenu from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Transporter_ProfileDropDownMobile = ({
  onLogout,
}: ProfileDropDownProps) => (
  <AccountMenu onLogout={onLogout} currentRole="transporter" variant="mobile" />
);

export default Transporter_ProfileDropDownMobile;
