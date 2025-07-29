"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryAddIcon, XModalIcon } from "./Icons/TransporterIcons";
import { DriverDetailsForm } from "./DriverDetailsForm";

// Props for AddFleet
interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFleet: React.FC<AddToStoreProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    price: "",
    size: "",
    isNegotiable: false,
    description: "",
    fromState: "",
    toState: "",
    deliveryDays: "",
    driverImage: null as File | null,
    driverName: "",
    driverPhone: "",
  });

  

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle negotiation toggle
  const handleNegotiableToggle = (value: boolean) => {
    setFormData((prev) => ({ ...prev, isNegotiable: value }));
  };


  // Handle next button
  const handleNext = () => {
    setCurrentStep(2);
  };

  // Handle back button
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#2b2b2bbc] flex items-center justify-center z-50"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-[#fefefe] rounded-lg w-[95%] overflow-y-auto max-h-[500px] max-w-[500px] p-4"
          >
            {currentStep === 1 && (
              <>
            <div
              onClick={onClose}
              className="absolute top-[1.6rem] right-[0.8rem] cursor-pointer"
            >
              <XModalIcon />
            </div>
                <h2 className="text-[15px] pt-[1.6rem] font-normal text-center text-[#808080] font-montserrat mb-2">
                  Upload Fleet
                </h2>
                <form className="space-y-1 sm:px-4 pb-6">
                  {/* Name and Phone Number */}
                  <div className="flex flex-col md:flex-row gap-[15px] w-full max-w-[480px] mx-auto">
                    <div className="w-full md:w-1/2">
                      <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border-[1px] border-[#2b2b2b] outline-none rounded-[4px] px-3 py-2 text-[13px] placeholder:font-montserrat placeholder:text-[13px] font-montserrat"
                        placeholder="Enter fleet name"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full border-[1px] border-[#2b2b2b] outline-none rounded-[4px] px-3 py-2 text-[13px] placeholder:font-montserrat placeholder:text-[13px] font-montserrat"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Price and Size */}
                  <div className="flex flex-col md:flex-row gap-[20px] w-full max-w-[480px] mx-auto">
                    <div className="w-full md:w-1/2">
                      <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full border-[1px] border-[#2b2b2b] outline-none rounded-[4px] px-3 py-2 text-[13px] placeholder:font-montserrat placeholder:text-[13px] font-montserrat"
                        placeholder="Enter price"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                        Size
                      </label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full border-[1px] border-[#2b2b2b] outline-none rounded-[4px] px-3 py-2 text-[13px] placeholder:font-montserrat placeholder:text-[13px] font-montserrat"
                        placeholder="Enter size"
                      />
                    </div>
                  </div>

                  {/* Negotiation Toggle */}
                  <div className="flex items-center gap-[4px] w-full max-w-[480px] mx-auto">
                    <span className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                      Is this price negotiable?
                    </span>
                    <div className="flex gap-[10px]">
                      <button
                        type="button"
                        onClick={() => handleNegotiableToggle(true)}
                        className={`cursor-pointer flex-1 border-[1px] border-[#538e53] rounded-[4px] px-[0.3rem] text-[10px] font-montserrat font-normal text-[#2b2b2b] ${
                          formData.isNegotiable
                            ? "bg-[#538e53] text-[#fefefe]"
                            : ""
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNegotiableToggle(false)}
                        className={`cursor-pointer flex-1 border-[1px] border-[#538e53] rounded-[4px] px-[0.3rem] text-[10px] font-montserrat font-normal text-[#2b2b2b] ${
                          !formData.isNegotiable
                            ? "bg-[#538e53] text-[#fefefe]"
                            : ""
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Add Image Section */}
                  <div className="flex gap-[4px] flex-col w-full max-w-[480px] mx-auto justify-center">
                    <div className="flex gap-[20px] items-center justify-between w-full">
                      <div className="flex flex-col justify-center gap-[4px] w-[100%]">
                        <span className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                          Add Image
                        </span>
                        <div className="flex gap-[15px] items-center justify-center">
                          <div className="flex items-center justify-center bg-[#f1f1f1] rounded-[4px] w-[182px] h-[60px] sm:h-[70px]">
                            <GalleryAddIcon />
                          </div>
                          <div className="flex items-center justify-center bg-[#f1f1f1] rounded-[4px] w-[182px] h-[60px] sm:h-[70px]">
                            <GalleryAddIcon />
                          </div>
                          <div className="flex items-center justify-center bg-[#f1f1f1] rounded-[4px] w-[182px] h-[60px] sm:h-[70px]">
                            <GalleryAddIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fleet Description */}
                  <div className="w-full max-w-[480px] mx-auto">
                    <label className="text-[12px] font-normal text-[#2b2b2b] font-montserrat">
                      Fleet Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border-[1px] border-[#2b2b2b] outline-none rounded-[4px] px-3 py-2 text-[12px] font-montserrat resize-none h-[120px]"
                      placeholder="Enter fleet description"
                    />
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="cursor-pointer flex items-center justify-center bg-[#538e53] text-[#fefefe] mx-auto w-[100%] font-montserrat font-normal text-[16px] rounded-[4px] p-[0.7rem]"
                  >
                    Next
                  </button>
                </form>
              </>
            )}
            {currentStep === 2 && (
              <DriverDetailsForm
                onBack={handleBack}
                onClose={onClose}
                formData={formData} // Pass formData to ItemDetailsForm
                setFormData={setFormData} // Pass setFormData as required by ItemDetailsFormProps
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddFleet;
