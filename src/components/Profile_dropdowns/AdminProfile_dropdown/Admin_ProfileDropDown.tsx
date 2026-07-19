"use client";
import React from "react";
import AccountMenu from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Admin_ProfileDropDown = ({ onLogout }: ProfileDropDownProps) => (
  <AccountMenu onLogout={onLogout} />
);

export default Admin_ProfileDropDown;
