"use client";
import React from "react";
import AccountMenu from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Buyer_ProfileDropDownMobile = ({
  onLogout,
}: ProfileDropDownProps) => (
  <AccountMenu onLogout={onLogout} currentRole="buyer" variant="mobile" />
);

export default Buyer_ProfileDropDownMobile;
