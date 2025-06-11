"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons"; // Adjust import path
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GalleryAddIcon,
  ProfileIcon,
  XModalIcon,
} from "./Icons/AgentIcons";
import { ItemDetailsForm } from "./ItemDetailsForm";

// Props for AddToStore
interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define produce map type
interface ProduceMap {
  [key: string]: string[];
}

export const AddToStore: React.FC<AddToStoreProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const produceDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduce, setSelectedProduce] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isProduceOpen, setIsProduceOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Profile type
  interface Profile {
    id: number;
    name: string;
  }

  // Sample profile data
  const profiles: Profile[] = [
    { id: 1, name: "Item One" },
    { id: 2, name: "Item Two" },
    { id: 3, name: "Item Three" },
    { id: 4, name: "Item Four" },
  ];

  // Category and produce data
  const categories: string[] = [
    "Grain",
    "Fish",
    "Tubers",
    "Legumes",
    "LiveStocks",
    "Vegetables",
  ];

  const produceMap: ProduceMap = {
    Grain: ["Rice", "Millet", "Maize", "Wheat", "Sorghum", "Barley"],
    Fish: ["Tilapia", "Catfish", "Mackerel", "Sardine", "Tuna", "Salmon"],
    Tubers: ["Yam", "Cassava", "Potato", "Sweet Potato", "Cocoyam", "Taro"],
    Legumes: [
      "Beans",
      "Lentils",
      "Peas",
      "Chickpeas",
      "Soybeans",
      "Groundnuts",
    ],
    LiveStocks: ["Chicken", "Goat", "Cow", "Pig", "Sheep", "Turkey"],
    Vegetables: ["Spinach", "Cabbage", "Carrot", "Tomato", "Pepper", "Onion"],
  };

  // Handle profile click
  const handleProfileClick = (index: number): void => {
    setSelectedProfiles((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Handle category selection
  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
    setSelectedProduce(null);
    setIsCategoryOpen(false);
  };

  // Handle produce selection
  const handleProduceSelect = (produce: string): void => {
    setSelectedProduce(produce);
    setIsProduceOpen(false);
  };

  // Handle next button
  const handleNext = (): void => {
    setCurrentStep(2);
  };

  // Handle back button
  const handleBack = (): void => {
    setCurrentStep(1);
  };

  // Close dropdowns when clicking outside
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
        produceDropdownRef.current &&
        !produceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProduceOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
        setIsCategoryOpen(false);
        setIsProduceOpen(false);
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
            className="relative bg-[#fefefe] rounded-lg w-[90%] max-w-[721px]"
          >
            <div
              onClick={onClose}
              className="absolute top-[1.6rem] right-[0.8rem] cursor-pointer"
            >
              <XModalIcon />
            </div>
            {currentStep === 1 && (
              <>
                <h2 className="text-[15px] pt-[1.6rem] font-normal text-center text-[#808080] font-montserrat mb-4">
                  Item upload
                </h2>
                <form className="space-y-4 px-4 pb-6">
                  {/* Profile section */}
                  <div className="flex items-center justify-center gap-[20px] w-full max-w-[694px] mx-auto">
                    <div className="flex items-center justify-center rounded-[100px] py-[4px] px-[8px] w-[35px] h-[35px] bg-[#f1f1f1]">
                      <ArrowLeftIcon />
                    </div>
                    {profiles.map((profile, index) => (
                      <div
                        key={profile.id}
                        onClick={() => handleProfileClick(index)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleProfileClick(index);
                          }
                        }}
                        className={`w-[131px] h-[90px] flex flex-col items-center justify-center gap-[4px] rounded-[8px] cursor-pointer ${
                          selectedProfiles.includes(index)
                            ? "border-[#538e53] border-[2px]"
                            : "border-[#2b2b2b] border-[1.5px]"
                        }`}
                        role="button"
                        tabIndex={0}
                      >
                        <div
                          className={`w-[50px] h-[50px] flex items-center justify-center rounded-[100px] ${
                            selectedProfiles.includes(index)
                              ? "bg-[#538e53]"
                              : "bg-transparent"
                          }`}
                        >
                          <ProfileIcon
                            stroke={
                              selectedProfiles.includes(index)
                                ? "#fefefe"
                                : "#2b2b2b"
                            }
                          />
                        </div>
                        <span
                          className={`text-[14px] font-normal font-montserrat ${
                            selectedProfiles.includes(index)
                              ? "text-[#538e53]"
                              : "text-[#2b2b2b]"
                          }`}
                        >
                          {profile.name}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-center rounded-[100px] py-[4px] px-[8px] w-[35px] h-[35px] bg-[#f1f1f1]">
                      <ArrowRightIcon />
                    </div>
                  </div>

                  {/* Product section */}
                  <div className="flex flex-col md:flex-row w-[84%] max-w-[694px] mx-auto items-center justify-center gap-[20px]">
                    {/* Category Dropdown */}
                    <div
                      ref={categoryDropdownRef}
                      className="relative w-full md:w-1/2"
                    >
                      <div
                        onClick={() => setIsCategoryOpen((prev) => !prev)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setIsCategoryOpen((prev) => !prev);
                          }
                        }}
                        className="flex items-center justify-between w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 cursor-pointer"
                        role="button"
                        tabIndex={0}
                      >
                        <span className="text-[14px] font-normal text-[#2b2b2b] font-montserrat">
                          {selectedCategory || "Select Category"}
                        </span>
                        {isCategoryOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                      </div>
                      {isCategoryOpen && (
                        <div className="absolute z-10 w-full bg-[#fefefe] border-[1px] border-[#2b2b2b] rounded-[4px] mt-1 max-h-[200px] overflow-y-auto">
                          {categories.map((category) => (
                            <div
                              key={category}
                              onClick={() => handleCategorySelect(category)}
                              onKeyDown={(
                                e: React.KeyboardEvent<HTMLDivElement>
                              ) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleCategorySelect(category);
                                }
                              }}
                              className="px-3 py-2 text-[14px] font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
                              role="option"
                              aria-selected
                              tabIndex={0}
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Produce Dropdown */}
                    <div
                      ref={produceDropdownRef}
                      className="relative w-full md:w-1/2"
                    >
                      <div
                        onClick={() =>
                          selectedCategory && setIsProduceOpen((prev) => !prev)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                          if (
                            selectedCategory &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            setIsProduceOpen((prev) => !prev);
                          }
                        }}
                        className={`flex items-center justify-between w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 cursor-pointer ${
                          !selectedCategory
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="text-[14px] font-normal text-[#2b2b2b] font-montserrat">
                          {selectedProduce || "Select Produce"}
                        </span>
                        {isProduceOpen && selectedCategory ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                      </div>
                      {isProduceOpen && selectedCategory && (
                        <div className="absolute z-10 w-full bg-[#fefefe] border-[1px] border-[#2b2b2b] rounded-[4px] mt-1 max-h-[200px] overflow-y-auto">
                          {produceMap[selectedCategory].map((produce) => (
                            <div
                              key={produce}
                              onClick={() => handleProduceSelect(produce)}
                              onKeyDown={(
                                e: React.KeyboardEvent<HTMLDivElement>
                              ) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleProduceSelect(produce);
                                }
                              }}
                              className="px-3 py-2 text-[14px] font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
                              role="option"
                              aria-selected
                              tabIndex={0}
                            >
                              {produce}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Image Section */}
                  <div className="flex gap-[4px] flex-col w-full max-w-[694px] mx-auto justify-center">
                    <div className="flex gap-[20px] items-center justify-between w-full">
                      <div className="hidden items-center justify-center rounded-[100px] py-[4px] px-[8px] w-[35px] h-[35px] bg-[#f1f1f1]">
                        <ArrowLeftIcon />
                      </div>
                      <div className="flex flex-col justify-center ml-auto gap-[4px] w-[84%]">
                        <span className="text-[14px] font-normal text-[#2b2b2b] font-montserrat">
                          Add Image
                        </span>
                        <div className="flex gap-[20px] items-center justify-center">
                          <div className="flex items-center justify-center bg-[#f1f1f1] rounded-[4px] w-[182px] h-[90px]">
                            <GalleryAddIcon />
                          </div>
                          <div className="flex items-center justify-center bg-[#f1f1f1] rounded-[4px] w-[182px] h-[90px]">
                            <GalleryAddIcon />
                          </div>
                          <div className="flex items-center justify-center bg-[#f1f1f1] rounded-[4px] w-[182px] h-[90px]">
                            <GalleryAddIcon />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center rounded-[100px] py-[4px] px-[8px] w-[35px] h-[35px] bg-[#f1f1f1]">
                        <ArrowRightIcon />
                      </div>
                    </div>
                  </div>

                  {/* Video Upload */}
                  <div className="w-full">
                    <div className="flex flex-col justify-center mx-auto w-[84%] gap-[4px]">
                      <p className="text-[14px] font-normal text-[#2b2b2b] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] font-montserrat">
                        30 seconds Farmers testimonial video (optional)
                      </p>
                      <div className="w-[100%] max-w-[584px] h-[120px] bg-[#f1f1f1] rounded-[4px] flex items-center justify-center">
                        <Image
                          src="/images/VideoUpload.png"
                          alt="Upload video"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center justify-center bg-[#538e53] text-[#fefefe] mx-auto w-[84%] font-montserrat font-normal text-[16px] rounded-[4px] p-[0.7rem]"
                  >
                    Next
                  </button>
                </form>
              </>
            )}
            {currentStep === 2 && (
              <ItemDetailsForm
                onBack={handleBack}
                onClose={onClose}
                selectedCategory={selectedCategory}
                selectedProduce={selectedProduce}
                selectedProfiles={selectedProfiles}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToStore;
