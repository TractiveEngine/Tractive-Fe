"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GalleryAddIcon,
  ProfileIcon,
  XModalIcon,
} from "./Icons/AgentIcons";
import { toast } from "sonner";
import { ItemDetailsForm } from "./ItemDetailsForm";
import { useFarmers } from "@/hooks/queries/useFarmerQueries";

interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToStore: React.FC<AddToStoreProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const farmerDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch farmers using the query hook
  const { data: farmersData, isLoading: isLoadingFarmers } = useFarmers();
  const farmers = farmersData?.farmers || [];

  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isFarmerOpen, setIsFarmerOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const categories: string[] = [
    "Grains",
    "Fish",
    "Tubers",
    "Legumes",
    "LiveStocks",
    "Vegetables",
  ];

  const handleFarmerSelect = (farmerId: string): void => {
    setSelectedFarmerId(farmerId);
    setIsFarmerOpen(false);
  };

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = e.target?.result as string;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number): void => {
    setImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const handleNext = (): void => {
    if (!productName.trim()) {
      alert("Please enter a product name");
      return;
    }
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }
    if (!selectedFarmerId) {
      alert("Please select a farmer");
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = (): void => {
    setCurrentStep(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        farmerDropdownRef.current &&
        !farmerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFarmerOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
        setIsCategoryOpen(false);
        setIsFarmerOpen(false);
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
          className="fixed inset-0 bg-[#2b2b2bbc] flex items-center justify-center z-50 p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-[#fefefe] rounded-lg w-full max-w-[600px] md:max-w-[721px] overflow-y-auto max-h-[90vh] hide-scrollbar"
          >
            <div
              onClick={onClose}
              className="absolute top-4 right-4 cursor-pointer"
            >
              <XModalIcon className="w-5 h-5" />
            </div>

            {currentStep === 1 && (
              <div className="p-4 md:p-6 space-y-4">
                <h2 className="text-sm md:text-[15px] pt-2 font-normal text-center text-[#808080] font-montserrat">
                  Item upload
                </h2>

                {/* Farmer Selection (Replaces Profile Section) */}
                <div className="w-[88%] mx-auto">
                  <label className="text-[14px] font-normal text-[#2b2b2b] font-montserrat mb-1 block">
                    Select Farmer
                  </label>
                  <div ref={farmerDropdownRef} className="relative w-full">
                    <div
                      onClick={() => setIsFarmerOpen((prev) => !prev)}
                      className="flex items-center justify-between w-full border border-[#2b2b2b] rounded px-3 py-2 cursor-pointer bg-white"
                    >
                      <span className="text-sm font-normal text-[#2b2b2b] font-montserrat truncate">
                        {selectedFarmerId
                          ? farmers.find((f) => f.id === selectedFarmerId)
                              ?.name || "Select Farmer"
                          : "Select Farmer"}
                      </span>
                      {isFarmerOpen ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                    {isFarmerOpen && (
                      <div className="absolute z-10 w-full bg-[#fefefe] border border-[#2b2b2b] rounded mt-1 max-h-[200px] overflow-y-auto shadow-lg">
                        {isLoadingFarmers ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Loading farmers...
                          </div>
                        ) : farmers.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No farmers found
                          </div>
                        ) : (
                          farmers.map((farmer) => (
                            <div
                              key={farmer.id}
                              onClick={() => handleFarmerSelect(farmer.id)}
                              className={`px-3 py-2 text-sm font-normal font-montserrat hover:bg-[#f1f1f1] cursor-pointer ${selectedFarmerId === farmer.id ? "bg-[#f1f1f1]" : ""}`}
                            >
                              {farmer.name} ({farmer.mobile})
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product section */}
                <div className="flex flex-col sm:flex-row w-[88%] mx-auto items-center justify-center gap-4">
                  <div className="w-full md:w-1/2">
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full border border-[#2b2b2b] rounded px-3 py-2 text-sm font-normal text-[#2b2b2b] font-montserrat"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div
                    ref={categoryDropdownRef}
                    className="relative w-full md:w-1/2"
                  >
                    <div
                      onClick={() => setIsCategoryOpen((prev) => !prev)}
                      className="flex items-center justify-between w-full border border-[#2b2b2b] rounded px-3 py-2 cursor-pointer bg-white"
                    >
                      <span className="text-sm font-normal text-[#2b2b2b] font-montserrat">
                        {selectedCategory || "Select Category"}
                      </span>
                      {isCategoryOpen ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                    {isCategoryOpen && (
                      <div className="absolute z-10 w-full bg-[#fefefe] border border-[#2b2b2b] rounded mt-1 max-h-[200px] overflow-y-auto shadow-lg">
                        {categories.map((category) => (
                          <div
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className="px-3 py-2 text-sm font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Image Section */}
                <div className="w-full">
                  <div className="relative flex items-center">
                    <button
                      title="scroll left"
                      onClick={() => {
                        const container =
                          document.getElementById("image-container");
                        if (container) container.scrollLeft -= 150;
                      }}
                      className="absolute left-0 top-[60%] transform -translate-y-1/2 z-10 flex md:hidden items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col justify-center mx-auto gap-[4px] w-[88%]">
                      <span className="text-[14px] font-normal text-[#2b2b2b] font-montserrat">
                        Upload Images (Max 3)
                      </span>
                      <div
                        id="image-container"
                        className="flex overflow-x-auto scroll-smooth gap-4 py-2 w-full hide-scrollbar"
                        style={{ scrollBehavior: "smooth" }}
                      >
                        {[0, 1, 2].map((index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-[156px] h-[80px] md:w-[180px] lg:w-[187px] md:h-[90px] relative"
                          >
                            {imagePreviews[index] ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={imagePreviews[index]}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover rounded"
                                />
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <label className="w-full h-full flex items-center justify-center bg-[#f1f1f1] rounded cursor-pointer hover:bg-[#e1e1e1] border-2 border-dashed border-[#ccc]">
                                <div className="text-center">
                                  <GalleryAddIcon className="w-6 h-6 mx-auto mb-1 text-[#666]" />
                                  <span className="text-xs text-[#666]">
                                    Click to upload
                                  </span>
                                </div>
                                <input
                                  ref={(el) => {
                                    fileInputRefs.current[index] = el;
                                  }}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(index, e)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      title="scroll right"
                      onClick={() => {
                        const container =
                          document.getElementById("image-container");
                        if (container) container.scrollLeft += 150;
                      }}
                      className="absolute right-0 top-[60%] transform -translate-y-1/2 z-10 flex items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-[88%] mx-auto flex justify-center bg-[#538e53] text-[#fefefe] font-montserrat font-normal text-sm md:text-base rounded py-3"
                >
                  Next
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <ItemDetailsForm
                onBack={handleBack}
                onClose={onClose}
                selectedCategory={selectedCategory}
                productName={productName}
                selectedFarmerId={selectedFarmerId}
                imageFiles={imageFiles}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToStore;
