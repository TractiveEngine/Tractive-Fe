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
import { getAuthToken } from "@/utils/loginAuth";
import axios from "axios";

interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToStore: React.FC<AddToStoreProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

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
    "Grains",
    "Fish",
    "Tubers",
    "Legumes",
    "LiveStocks",
    "Vegetables",
  ];

  // Check authentication on component mount or when modal opens
  useEffect(() => {
    const checkAuth = async () => {
      if (!isOpen) {
        setIsAuthChecked(false);
        return;
      }

      try {
        console.log("🔍 Step 1: Checking authentication for AddToStore...");

        const token = getAuthToken();

        if (!token) {
          console.log("❌ No auth token found, redirecting to login");
          toast.error("Please login first to add products", {
            duration: 3000,
            position: "top-center",
          });
          router.push("/login");
          onClose();
          return;
        }

        console.log("✅ Step 2: Auth token verified");

        // Verify token is still valid by calling profile
        try {
          const profileResponse = await axios.get(
            "https://tractive-be.vercel.app/api/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );

          console.log("✅ Step 3: Profile verified, user authenticated", profileResponse);
          setIsAuthChecked(true);
        } catch (profileError: any) {
          if (profileError.response?.status === 401) {
            console.log("❌ Token expired or invalid");
            localStorage.removeItem("authToken");
            localStorage.removeItem("session");
            toast.error("Session expired. Please login again.", {
              duration: 3000,
              position: "top-center",
            });
            router.push("/login");
            onClose();
          } else {
            throw profileError;
          }
        }
      } catch (error) {
        console.error("❌ Auth check error:", error);
        toast.error("Failed to verify authentication", {
          duration: 3000,
          position: "top-center",
        });
        onClose();
      }
    };

    checkAuth();
  }, [isOpen, router, onClose]);

  const handleProfileClick = (index: number): void => {
    setSelectedProfiles((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
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

  const handleVideoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert("Video size should be less than 50MB");
        return;
      }

      setVideoFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string);
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

  const removeVideo = (): void => {
    setVideoFile(null);
    setVideoPreview("");
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
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
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Don't render until auth is checked
  if (isOpen && !isAuthChecked) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2b2b2bbc] flex items-center justify-center z-50"
          >
            <div className="bg-[#fefefe] rounded-lg p-8">
              <p className="text-[#2b2b2b] font-montserrat">
                Verifying authentication...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

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
                      const container =
                        document.getElementById("profile-container");
                      if (container) container.scrollLeft -= 150;
                    }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                  </button>

                  <div
                    id="profile-container"
                    className="flex overflow-x-auto scroll-smooth gap-4 px-10 py-2 w-full hide-scrollbar"
                    style={{ scrollBehavior: "smooth" }}
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
                      const container =
                        document.getElementById("profile-container");
                      if (container) container.scrollLeft += 150;
                    }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center rounded-full w-8 h-8 bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
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
                      {isCategoryOpen ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
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

                {/* Video Upload */}
                <div className="w-[88%] mx-auto">
                  <p className="text-[12px] sm:text-sm font-normal text-[#2b2b2b] font-montserrat mb-2">
                    30 seconds Farmers testimonial video (optional)
                  </p>
                  {videoPreview ? (
                    <div className="relative w-full h-[100px] md:h-[120px]">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        onClick={removeVideo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-[100px] md:h-[120px] bg-[#f1f1f1] rounded flex items-center justify-center cursor-pointer hover:bg-[#e1e1e1] border-2 border-dashed border-[#ccc]">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2 bg-[#666] rounded flex items-center justify-center">
                          <span className="text-white text-lg">▶</span>
                        </div>
                        <span className="text-sm text-[#666]">
                          Click to upload video
                        </span>
                      </div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
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
                selectedProfiles={selectedProfiles}
                imageFiles={imageFiles}
                videoFile={videoFile}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToStore;
