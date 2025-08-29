"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowDownIcon } from "@/icons/Icons";

// List of commercial banks in Nigeria (2025)
const nigerianBanks = [
  "Access Bank Plc",
  "Citibank Nigeria Limited",
  "Ecobank Nigeria Plc",
  "Fidelity Bank Plc",
  "First Bank of Nigeria Limited",
  "First City Monument Bank Plc",
  "Globus Bank Limited",
  "Guaranty Trust Bank Plc",
  "Heritage Banking Company Limited",
  "Keystone Bank Limited",
  "Kuda Bank",
  "Moniepoint Microfinance Bank",
  "Opay Digital Services Limited",
  "Polaris Bank Limited",
  "Premium Trust Bank",
  "Providus Bank Limited",
  "Signature Bank Limited",
  "Stanbic IBTC Bank Plc",
  "Standard Chartered Bank Nigeria Limited",
  "Sterling Bank Plc",
  "Suntrust Bank Nigeria Limited",
  "Titan Trust Bank Limited",
  "Union Bank of Nigeria Plc",
  "United Bank for Africa Plc",
  "Unity Bank Plc",
  "Wema Bank Plc",
  "Zenith Bank Plc",
] as const;

// Define the type for form data
interface FormData {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const BankAccount: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankSelect = (bank: string) => {
    setFormData((prev) => ({
      ...prev,
      bankName: bank,
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Bank account details submitted:", formData);
    localStorage.setItem("bank-account", JSON.stringify(formData));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[100%] bg-[#fefefe] flex flex-col items-center shadow-md rounded-[4px] pt-[4rem]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 py-6 w-[90%] max-w-[500px]"
      >
        {/* Bank Name */}
        <div className="w-full" ref={dropdownRef}>
          <label
            htmlFor="bankName"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Bank
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2 pr-8 rounded-[4px] border-[1px] border-[#e2e2e2] text-[13px] font-montserrat text-[#2b2b2b] text-left focus:outline-none focus:border-[#538E53]"
            >
              {formData.bankName || "Select a bank"}
            </button>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowDownIcon className="h-4 w-4 text-[#2b2b2b]" />
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-[#fefefe] border-[1px] border-[#e2e2e2] rounded-[4px] shadow-md max-h-[200px] overflow-y-auto">
                {nigerianBanks.map((bank) => (
                  <div
                    key={bank}
                    onClick={() => handleBankSelect(bank)}
                    className="p-2 text-[13px] font-montserrat text-[#2b2b2b] hover:bg-[#f0f0f0] cursor-pointer"
                  >
                    {bank}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Number */}
        <div className="w-full">
          <label
            htmlFor="accountNumber"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter your account number"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[13px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Account Name */}
        <div className="w-full">
          <label
            htmlFor="accountName"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Account Name
          </label>
          <input
            type="text"
            id="accountName"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            placeholder="Enter your account name"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[13px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Done Button */}
        <button
          type="submit"
          className="bg-[#538E53] text-[#FEFEFE] p-2 rounded-[4px] w-full font-montserrat font-medium text-[13px] hover:bg-[#214821] transition"
        >
          Done
        </button>
      </form>
    </div>
  );
};

export default BankAccount;
