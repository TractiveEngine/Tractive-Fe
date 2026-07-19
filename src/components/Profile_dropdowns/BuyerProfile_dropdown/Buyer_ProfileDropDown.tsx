"use client";
import React from "react";
import AccountMenu from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Buyer_ProfileDropDown = ({ onLogout }: ProfileDropDownProps) => (
  <AccountMenu onLogout={onLogout} currentRole="buyer" />
);

export default Buyer_ProfileDropDown;
