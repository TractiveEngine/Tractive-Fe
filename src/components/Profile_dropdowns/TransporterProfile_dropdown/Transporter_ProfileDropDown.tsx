"use client";
import React from "react";
import AccountMenu from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Transporter_ProfileDropDown = ({
  onLogout,
}: ProfileDropDownProps) => (
  <AccountMenu onLogout={onLogout} currentRole="transporter" />
);

export default Transporter_ProfileDropDown;
