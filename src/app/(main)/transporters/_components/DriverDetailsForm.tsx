"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons"; // Adjust import path
import {
  ArrowLeftIcon,
  XModalIcon,
} from "./Icons/TransporterIcons";
import Image from "next/image";

// Props for ItemDetailsForm
interface DriverDetailsFormProps {
  onBack: () => void;
  onClose: () => void;
  formData: {
    name: string;
    phoneNumber: string;
    price: string;
    size: string;
    isNegotiable: boolean;
    description: string;
    fromState: string;
    toState: string;
    deliveryDays: string;
    driverImage: File | null;
    driverName: string;
    driverPhone: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phoneNumber: string;
      price: string;
      size: string;
      isNegotiable: boolean;
      description: string;
      fromState: string;
      toState: string;
      deliveryDays: string;
      driverImage: File | null;
      driverName: string;
      driverPhone: string;
    }>
  >;
}

// Nigerian states
const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

// Delivery days options (starting from 2 days)
const deliveryDaysOptions = Array.from(
  { length: 29 },
  (_, i) => `${i + 2} Days`
);

export const DriverDetailsForm: React.FC<DriverDetailsFormProps> = ({
  onBack,
  onClose,
  formData,
  setFormData,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);
  const deliveryDaysDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [isDeliveryDaysOpen, setIsDeliveryDaysOpen] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle dropdown selections
  const handleFromSelect = (state: string) => {
    // setFormData probably be a ref to the file input to trigger it programmatically
    setFormData((prev) => ({ ...prev, fromState: state }));
    setIsFromOpen(false);
  };

  const handleToSelect = (state: string) => {
    setFormData((prev) => ({ ...prev, toState: state }));
    setIsToOpen(false);
  };

  const handleDeliveryDaysSelect = (days: string) => {
    setFormData((prev) => ({ ...prev, deliveryDays: days }));
    setIsDeliveryDaysOpen(false);
  };

  // Handle driver image upload
  const handleDriverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, driverImage: e.target.files![0] }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Implement upload logic here (e.g., API call)
    onClose();
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFromOpen(false);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node)
      ) {
        setIsToOpen(false);
      }
      if (
        deliveryDaysDropdownRef.current &&
        !deliveryDaysDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDeliveryDaysOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFromOpen(false);
        setIsFromOpen(false);
        setIsToOpen(false);
        setIsDeliveryDaysOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="p-4"
    >
      <div className="flex items-center justify-between mb-[1rem]">
        <div
          onClick={onBack}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              onBack();
            }
          }}
          className="flex items-center justify-center rounded-[100px] py-[4px] px-[8px] w-[35px] h-[35px] bg-[#f1f1f1] cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <ArrowLeftIcon />
        </div>
        <h2 className="text-[15px] font-normal text-center text-[#808080] font-montserrat">
          Item Upload
        </h2>

        <div onClick={onClose} className="cursor-pointer">
          <XModalIcon />
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-[580px] mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[370px] mx-auto">
          {/* From and To State Route */}
          <div className="flex flex-col md:flex-row gap-[10px] md:gap-[15px] w-full max-w-[260px] mx-auto">
            <div className="relative w-full md:w-1/2" ref={fromDropdownRef}>
              <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                From
              </label>
              <div className="flex gap-[1px] w-full max-w-[240px] md:max-w-[142px] items-center">
                <Image
                  src="/images/locationPointer.png"
                  alt="Driver preview"
                  width={22}
                  height={22}
                  className="object-contain"
                />
                <div
                  onClick={() => setIsFromOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full max-w-[240px] md:max-w-[142px] border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  <span className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                    {formData.fromState || "Location"}
                  </span>
                  {isFromOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div>
              </div>
              {isFromOpen && (
                <div className="absolute z-10 w-full bg-[#fefefe] border-[1px] border-[#2b2b2b] rounded-[4px] mt-1 max-h-[200px] overflow-y-auto">
                  {nigerianStates.map((state) => (
                    <div
                      key={state}
                      onClick={() => handleFromSelect(state)}
                      className="px-3 py-2 text-[12px] font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
                      role="option"
                      tabIndex={0}
                      aria-selected={formData.fromState === state}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-full md:w-1/2" ref={toDropdownRef}>
              <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                To
              </label>
              <div
                onClick={() => setIsToOpen((prev) => !prev)}
                className="flex items-center justify-between w-full max-w-[240px] md:max-w-[142px] border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <span className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                  {formData.toState || "Location"}
                </span>
                {isToOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </div>
              {isToOpen && (
                <div className="absolute z-10 w-full bg-[#fefefe] border-[1px] border-[#2b2b2b] rounded-[4px] mt-1 max-h-[200px] overflow-y-auto">
                  {nigerianStates.map((state) => (
                    <div
                      key={state}
                      onClick={() => handleToSelect(state)}
                      className="px-3 py-2 text-[12px] font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
                      role="option"
                      tabIndex={0}
                      aria-selected={formData.toState === state}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Delivery Days */}
          <div className="w-[100%] md:w-[30%]">
            <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
              Delivery
            </label>
            <div className="relative" ref={deliveryDaysDropdownRef}>
              <div
                onClick={() => setIsDeliveryDaysOpen((prev) => !prev)}
                className="flex items-center justify-between w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <span className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                  {formData.deliveryDays || "2 Days"}
                </span>
                {isDeliveryDaysOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </div>
              {isDeliveryDaysOpen && (
                <div className="absolute z-10 w-full bg-[#fefefe] border-[1px] border-[#2b2b2b] rounded-[4px] mt-1 max-h-[200px] overflow-y-auto">
                  {deliveryDaysOptions.map((days) => (
                    <div
                      key={days}
                      onClick={() => handleDeliveryDaysSelect(days)}
                      className="px-3 py-2 text-[12px] font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
                      role="option"
                      aria-selected={formData.deliveryDays === days}
                      tabIndex={0}
                    >
                      {days}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative border-1 border-[#808080]  w-full max-w-[330px] mx-auto rounded-[8px] p-4">
          <label className="absolute text-[19px] font-normal text-[#808080] font-montserrat">
            Driver
          </label>
          {/* Driver Image */}
          <div className="w-full mx-auto">
            <div className="flex items-center justify-center rounded-[100px] relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleDriverImageChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center justify-center w-[90px] h-[90px] cursor-pointer"
              >
                {formData.driverImage ? (
                  <Image
                    src={URL.createObjectURL(formData.driverImage)}
                    alt="Driver preview"
                    width={100}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                ) : (
                  <Image
                    src="/images/driverImage.png"
                    alt="Driver preview"
                    width={100}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Driver Name and Phone */}
          <div className="flex flex-col w-full max-w-[480px] mx-auto">
            <div className="w-full">
              <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                Full Name
              </label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleInputChange}
                className="w-full border-[1px] border-[#808080] rounded-[4px] px-3 py-2 text-[12px] font-montserrat"
                placeholder="Enter driver name"
              />
            </div>
            <div className="w-full">
              <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                Mobile
              </label>
              <input
                type="tel"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleInputChange}
                className="w-full border-[1px] border-[#808080] rounded-[4px] px-3 py-2 text-[12px] font-montserrat"
                placeholder="Enter driver phone number"
              />
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          className="flex items-center justify-center bg-[#538e53] text-[#fefefe] mx-auto w-[100%] font-montserrat font-normal text-[16px] rounded-[4px] p-[0.7rem]"
        >
          Upload
        </button>
      </form>
    </motion.div>
  );
};

export default DriverDetailsForm;
