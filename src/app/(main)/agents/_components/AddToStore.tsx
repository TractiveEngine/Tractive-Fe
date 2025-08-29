"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GalleryAddIcon,
  ProfileIcon,
  XModalIcon,
} from "./Icons/AgentIcons";
import { ItemDetailsForm } from "./ItemDetailsForm";

interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  interface Profile {
    id: number;
    name: string;
  }

  const profiles: Profile[] = [
    { id: 1, name: "Item One" },
    { id: 2, name: "Item Two" },
    { id: 3, name: "Item Three" },
    { id: 4, name: "Item Four" },
  ];

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

  const handleProfileClick = (index: number): void => {
    setSelectedProfiles((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
    setSelectedProduce(null);
    setIsCategoryOpen(false);
  };

  const handleProduceSelect = (produce: string): void => {
    setSelectedProduce(produce);
    setIsProduceOpen(false);
  };

  const handleNext = (): void => {
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
                
                {/* Profile section */}
                <div className="relative w-full">
                  <button
                    title="scroll left"
                    onClick={() => {
                      const container = document.getElementById('profile-container');
                      if (container) container.scrollLeft -= 150;
                    }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                  </button>
                  
                  <div
                    id="profile-container"
                    className="flex overflow-x-auto scroll-smooth gap-4 px-10 py-2 w-full hide-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {profiles.map((profile, index) => (
                      <div
                        key={profile.id}
                        onClick={() => handleProfileClick(index)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleProfileClick(index);
                          }
                        }}
                        className={`flex-shrink-0 w-[110px] h-[80px] md:w-[135px] md:h-[90px] flex flex-col items-center justify-center gap-1 rounded-lg cursor-pointer ${
                          selectedProfiles.includes(index)
                            ? "border-[#538e53] border-2"
                            : "border-[#2b2b2b] border"
                        }`}
                        role="button"
                        tabIndex={0}
                      >
                        <div
                          className={`w-10 h-10 md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full ${
                            selectedProfiles.includes(index)
                              ? "bg-[#538e53]"
                              : "bg-transparent"
                          }`}
                        >
                          <ProfileIcon
                            className="w-5 h-5 md:w-6 md:h-6"
                            stroke={
                              selectedProfiles.includes(index)
                                ? "#fefefe"
                                : "#2b2b2b"
                            }
                          />
                        </div>
                        <span
                          className={`text-xs md:text-sm font-normal font-montserrat ${
                            selectedProfiles.includes(index)
                              ? "text-[#538e53]"
                              : "text-[#2b2b2b]"
                          }`}
                        >
                          {profile.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                  title="scroll right"
                    onClick={() => {
                      const container = document.getElementById('profile-container');
                      if (container) container.scrollLeft += 150;
                    }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Product section */}
                <div className="flex flex-col sm:flex-row w-[88%] mx-auto items-center justify-center gap-4">
                  {/* Category Dropdown */}
                  <div
                    ref={categoryDropdownRef}
                    className="relative w-full md:w-1/2"
                  >
                    <div
                      onClick={() => setIsCategoryOpen((prev) => !prev)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setIsCategoryOpen((prev) => !prev);
                        }
                      }}
                      className="flex items-center justify-between w-full border border-[#2b2b2b] rounded px-3 py-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    >
                      <span className="text-sm font-normal text-[#2b2b2b] font-montserrat">
                        {selectedCategory || "Select Category"}
                      </span>
                      {isCategoryOpen ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                    </div>
                    {isCategoryOpen && (
                      <div className="absolute z-10 w-full bg-[#fefefe] border border-[#2b2b2b] rounded mt-1 max-h-[200px] overflow-y-auto">
                        {categories.map((category) => (
                          <div
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleCategorySelect(category);
                              }
                            }}
                            className="px-3 py-2 text-sm font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
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
                      onKeyDown={(e) => {
                        if (
                          selectedCategory &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          setIsProduceOpen((prev) => !prev);
                        }
                      }}
                      className={`flex items-center justify-between w-full border border-[#2b2b2b] rounded px-3 py-2 cursor-pointer ${
                        !selectedCategory
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="text-sm font-normal text-[#2b2b2b] font-montserrat">
                        {selectedProduce || "Select Produce"}
                      </span>
                      {isProduceOpen && selectedCategory ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                    {isProduceOpen && selectedCategory && (
                      <div className="absolute z-10 w-full bg-[#fefefe] border border-[#2b2b2b] rounded mt-1 max-h-[200px] overflow-y-auto">
                        {produceMap[selectedCategory].map((produce) => (
                          <div
                            key={produce}
                            onClick={() => handleProduceSelect(produce)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleProduceSelect(produce);
                              }
                            }}
                            className="px-3 py-2 text-sm font-normal text-[#2b2b2b] font-montserrat hover:bg-[#f1f1f1] cursor-pointer"
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
                <div className="w-full">
                  <div className="relative flex items-center">
                    <button
                      title="scroll left"
                      onClick={() => {
                        const container = document.getElementById('image-container');
                        if (container) container.scrollLeft -= 150;
                      }}
                      className="absolute left-0 top-[60%] transform -translate-y-1/2 z-10 flex md:hidden items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                       <div className="flex flex-col justify-center mx-auto gap-[4px] w-[88%]">
                        <span className="text-[14px] font-normal text-[#2b2b2b] font-montserrat">
                          Add Image
                        </span>
                    <div
                      id="image-container"
                      className="flex overflow-x-auto scroll-smooth gap-4 py-2 w-full hide-scrollbar"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="flex-shrink-0 w-[156px] h-[80px] md:w-[180px] lg:w-[187px] md:h-[90px] flex items-center justify-center bg-[#f1f1f1] rounded"
                        >
                          <GalleryAddIcon className="w-6 h-6" />
                        </div>
                      ))}
                    </div>
                    </div>
                    
                    <button
                    title="scroll right"
                      onClick={() => {
                        const container = document.getElementById('image-container');
                        if (container) container.scrollLeft += 150;
                      }}
                      className="absolute right-0 top-[60%] transform -translate-y-1/2 z-10 flex items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="w-[88%] mx-auto">
                  <p className="text-[12px] sm:text-sm font-normal text-[#2b2b2b] font-montserrat">
                    30 seconds Farmers testimonial video (optional)
                  </p>
                  <div className="w-full h-[100px] md:h-[120px] bg-[#f1f1f1] rounded mt-1 flex items-center justify-center">
                    <Image
                      src="/images/VideoUpload.png"
                      alt="Upload video"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
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