"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { XModalIcon } from "../../_components/Icons/TransporterIcons";
import { Driver } from "@/utils/DriverData";

interface AddDriverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    driver: Omit<Driver, "id" | "route" | "fleet" | "iot" | "date">
  ) => void;
  editDriver?: Driver | null;
}

export const OnboardingDriver: React.FC<AddDriverProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editDriver,
}) => {
  const [formData, setFormData] = useState({
    name: editDriver?.name || "",
    mobile: editDriver?.mobile || "",
    image: editDriver?.image || "/images/bidder1.png",
  });
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      mobile: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10,11}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10-11 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      setFormData({
        name: "",
        mobile: "",
        image: "/images/bidder1.png",
      });
    }
  };

  const formVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#2b2b2b94] flex items-center justify-center z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-labelledby="onboard-driver-title"
    >
      <motion.div
        className="bg-[#fefefe] p-8 rounded-[8px] w-full max-w-[500px] relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button
          onClick={() => {
            onClose();
            setFormData({
              name: "",
              mobile: "",
              image: "/images/bidder1.png",
            });
          }}
          className="absolute top-4 right-4 text-[#2b2b2b] hover:text-[#538e53]"
          aria-label="Close modal"
          title="Close"
        >
          <XModalIcon />
        </button>
        <h2
          id="onboard-driver-title"
          className="text-lg font-montserrat text-[#2b2b2b] mb-4"
        >
          {editDriver ? "Edit Driver" : "Onboard Driver"}
        </h2>
        <div className="flex justify-center mb-2">
          <div className="relative w-[5rem] h-[5rem] group">
            <Image
              src={formData.image}
              alt="Driver profile"
              width={86}
              height={86}
              className="w-[5rem] h-[5rem] rounded-[100px] object-cover border-2 border-gray-300"
            />
            <div className="absolute inset-0 bg-[#2b2b2b] bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-[#fefefe] text-[9px] text-center font-montserrat">
                Change Image
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload profile image"
            />
          </div>
        </div>
        <AnimatePresence>
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-montserrat text-[#2b2b2b]"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                aria-required="true"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-montserrat text-[#2b2b2b]"
              >
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                aria-required="true"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <button
                type="submit"
                className="px-6 py-2 w-[100%] bg-[#538e53] text-[#f9f9f9] rounded-[4px] hover:bg-[#467a46]"
              >
                Submit
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
