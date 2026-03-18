"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons";
import {
  XModalIcon,
} from "./Icons/AgentIcons";
import { ItemDetailsForm } from "./ItemDetailsForm";
import { MediaUpload } from "./MediaUpload";
import { useFarmers } from "@/hooks/queries/useFarmerQueries";
import { toast } from "sonner";

interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToStore: React.FC<AddToStoreProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const farmerDropdownRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch farmers using the query hook
  const { data: farmersData, isLoading: isLoadingFarmers } = useFarmers();
  const farmers = farmersData?.farmers || [];

  const [farmerSearchQuery, setFarmerSearchQuery] = useState<string>("");
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isFarmerOpen, setIsFarmerOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  // Filter farmers
  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(farmerSearchQuery.toLowerCase()),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const categories: string[] = [
    "Grains",
    "Fish",
    "Tubers",
    "Legumes",
    "LiveStocks",
    "Vegetables",
  ];

  const handleFarmerSelect = (farmerId: string): void => {
    const farmer = farmers.find((f) => f.id === farmerId);
    if (farmer) {
      setFarmerSearchQuery(farmer.name);
    }
    setSelectedFarmerId(farmerId);
    setIsFarmerOpen(false);
  };

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleImagesSelect = (files: File[]): void => {
    if (files.length > 0) {
      const newFiles: File[] = [];
      const newPreviews: string[] = [];

      files.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Image ${file.name} is too large (>5MB)`);
          return;
        }
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      });

      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleVideoSelect = (file: File): void => {
    if (file) {
      if (videoFiles.length >= 1) {
        toast.error("Only one video is allowed.");
        return;
      }

      const validTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/avi",
      ];
      if (!file.type.startsWith("video/") && !validTypes.includes(file.type)) {
        toast.error("Please select a valid video file (mp4, mov, avi)");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video size should be less than 50MB");
        return;
      }

      setVideoFiles([file]); // Replace or set
      setVideoPreviews([URL.createObjectURL(file)]);
    }
  };

  const removeImage = (indexToRemove: number): void => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      // Revoke object URL for the removed image to avoid memory leak
      if (prev[indexToRemove]) URL.revokeObjectURL(prev[indexToRemove]);
      return newPreviews;
    });
  };

  const removeVideo = (indexToRemove: number): void => {
    setVideoFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setVideoPreviews((prev) => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      // Revoke object URL for the removed video to avoid memory leak
      if (prev[indexToRemove]) URL.revokeObjectURL(prev[indexToRemove]);
      return newPreviews;
    });
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
                    {/* Search Input Trigger */}
                    <div className="relative">
                      <input
                        type="text"
                        value={farmerSearchQuery}
                        onChange={(e) => {
                          setFarmerSearchQuery(e.target.value);
                          setIsFarmerOpen(true);
                          setSelectedFarmerId(null); // Clear selection on type? Or keep? clearing is safer for strict select
                        }}
                        onClick={() => setIsFarmerOpen(true)}
                        placeholder="Search farmer by name..."
                        className="w-full border border-[#2b2b2b] rounded px-3 py-2 text-sm font-normal text-[#2b2b2b] font-montserrat bg-white focus:outline-none focus:border-[#538e53] pr-8"
                      />
                      <div
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsFarmerOpen(!isFarmerOpen)}
                      >
                        {isFarmerOpen ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {isFarmerOpen && (
                      <div className="absolute z-10 w-full bg-[#fefefe] border border-[#2b2b2b] rounded mt-1 max-h-[200px] overflow-y-auto shadow-lg">
                        {isLoadingFarmers ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Loading farmers...
                          </div>
                        ) : filteredFarmers.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No farmers found matching &quot;{farmerSearchQuery}&quot;
                          </div>
                        ) : (
                          filteredFarmers.map((farmer) => (
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

                {/* Media Upload Section */}
                <div className="w-[88%] mx-auto">
                  <MediaUpload
                    imagePreviews={imagePreviews}
                    videoPreviews={videoPreviews}
                    onImagesSelect={handleImagesSelect}
                    onVideoSelect={handleVideoSelect}
                    onRemoveImage={removeImage}
                    onRemoveVideo={removeVideo}
                  />
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
                videoFiles={videoFiles}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToStore;
