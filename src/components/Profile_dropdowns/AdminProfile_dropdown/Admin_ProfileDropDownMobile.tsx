"use client";
import React from "react";
import AccountMenu from "../AccountMenu";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Admin_ProfileDropDownMobile = ({
  onLogout,
}: ProfileDropDownProps) => <AccountMenu onLogout={onLogout} variant="mobile" />;

export default Admin_ProfileDropDownMobile;
