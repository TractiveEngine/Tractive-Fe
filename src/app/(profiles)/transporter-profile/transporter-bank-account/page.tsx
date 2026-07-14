"use client";
import React from "react";
import BankAccountForm from "@/components/profile/BankAccountForm";

const BankAccount: React.FC = () => (
  <BankAccountForm
    className="h-screen"
    accountNumberPlaceholder="Account number"
    accountNamePlaceholder="Account name"
  />
);

export default BankAccount;
