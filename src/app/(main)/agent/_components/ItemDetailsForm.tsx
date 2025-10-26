"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./Icons/AgentIcons";
import { toast } from "sonner";
import axios from "axios";
import { getAuthToken } from "../../../../utils/loginAuth";
// import { getAuthToken } from "../utils/loginAuth";

interface ItemDetailsFormProps {
  onBack: () => void;
  onClose: () => void;
  selectedCategory: string | null;
  productName: string;
  selectedProfiles: number[];
  imageFiles: File[];
  videoFile: File | null;
}

export const ItemDetailsForm: React.FC<ItemDetailsFormProps> = ({
  onBack,
  onClose,
  selectedCategory,
  productName,
  selectedProfiles,
  imageFiles,
  videoFile,
}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Convert multiple files to base64
  const filesToBase64 = async (files: File[]): Promise<string[]> => {
    const base64Promises = files.map((file) => fileToBase64(file));
    return await Promise.all(base64Promises);
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(10);

    try {
      console.log("🚀 Step 1: Starting product upload...");

      // Check authentication
      const token = getAuthToken();
      if (!token) {
        console.log("❌ No auth token found");
        toast.error("Session expired. Please login again.", {
          duration: 3000,
          position: "top-center",
        });
        router.push("/login");
        return;
      }

      // Validate required fields
      if (!productName.trim()) {
        toast.error("Product name is required");
        return;
      }
      if (!selectedCategory) {
        toast.error("Category is required");
        return;
      }
      if (!description.trim()) {
        toast.error("Description is required");
        return;
      }
      if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
        toast.error("Valid price is required");
        return;
      }
      if (
        !quantity.trim() ||
        isNaN(Number(quantity)) ||
        Number(quantity) <= 0
      ) {
        toast.error("Valid quantity is required");
        return;
      }

      console.log("✅ Step 2: All fields validated");

      // Convert files to base64
      let imageBase64: string[] = [];
      let videoBase64: string[] = [];

      if (imageFiles.length > 0) {
        setUploadProgress(30);
        console.log(
          `🔄 Step 3: Converting ${imageFiles.length} images to base64...`
        );
        imageBase64 = await filesToBase64(imageFiles);
        setUploadProgress(50);
        console.log("✅ Images converted");
      }

      if (videoFile) {
        setUploadProgress(60);
        console.log("🔄 Step 4: Converting video to base64...");
        const videoBase64String = await fileToBase64(videoFile);
        videoBase64 = [videoBase64String];
        setUploadProgress(70);
        console.log("✅ Video converted");
      }

      // Prepare API payload
      const apiPayload = {
        name: productName.trim(),
        description: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        images: imageBase64,
        videos: videoBase64,
        categories: [selectedCategory],
      };

      console.log("✅ Step 5: Payload prepared");
      console.log(
        `Payload contains: ${imageBase64.length} images, ${videoBase64.length} videos`
      );
      setUploadProgress(80);

      // Make API call with proper error handling
      console.log("🚀 Step 6: Sending request to /api/products...");

      const response = await axios.post(`${API_URL}/api/products`, apiPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      console.log("✅ Step 7: Product created successfully:", response.data);
      setUploadProgress(100);

      toast.success("Product uploaded successfully!", {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("❌ Error creating product:", error);

      // Handle different error types
      if (error instanceof Error && error.message.includes("FileReader")) {
        toast.error(
          "Failed to process files. Please try again with smaller files.",
          {
            duration: 5000,
            position: "top-center",
          }
        );
        return;
      }

      if (axios.isAxiosError(error)) {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          console.log("❌ Authentication failed (401)");
          localStorage.removeItem("authToken");
          localStorage.removeItem("session");
          toast.error("Session expired. Please login again.", {
            duration: 3000,
            position: "top-center",
          });
          router.push("/login");
          return;
        }

        // Handle timeout
        if (error.code === "ECONNABORTED") {
          toast.error(
            "Request timeout. Files might be too large. Try again with smaller files.",
            {
              duration: 5000,
              position: "top-center",
            }
          );
          return;
        }

        // Handle other API errors
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          `HTTP error! status: ${error.response?.status}`;

        console.log("❌ API Error:", errorMessage);
        toast.error(errorMessage, {
          duration: 5000,
          position: "top-center",
        });
      } else {
        toast.error("Failed to create product. Please try again.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Calculate total file size
  const getTotalFileSize = (): number => {
    let totalSize = 0;
    imageFiles.forEach((file) => (totalSize += file.size));
    if (videoFile) totalSize += videoFile.size;
    return totalSize;
  };

  const totalFileSizeMB = (getTotalFileSize() / 1024 / 1024).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="py-4 px-4 sm:px-12"
    >
      <div className="flex items-center mb-4">
        <div
          onClick={onBack}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              onBack();
            }
          }}
          className="flex items-center justify-center rounded-[100px] py-[4px] px-[8px] w-[35px] h-[35px] bg-[#f1f1f1] cursor-pointer hover:bg-[#e1e1e1]"
          role="button"
          tabIndex={0}
        >
          <ArrowLeftIcon />
        </div>
      </div>

      <h2 className="text-[15px] font-normal text-center text-[#808080] font-montserrat mb-4">
        Item Details
      </h2>

      {/* Display selected product info */}
      <div className="mb-4 p-3 bg-[#f9f9f9] rounded">
        <p className="text-sm text-[#2b2b2b] font-montserrat">
          <strong>Product:</strong> {productName}
        </p>
        <p className="text-sm text-[#2b2b2b] font-montserrat">
          <strong>Category:</strong> {selectedCategory}
        </p>
        {imageFiles.length > 0 && (
          <p className="text-sm text-[#2b2b2b] font-montserrat">
            <strong>Images:</strong> {imageFiles.length} file(s) selected
          </p>
        )}
        {videoFile && (
          <p className="text-sm text-[#2b2b2b] font-montserrat">
            <strong>Video:</strong> {videoFile.name}
          </p>
        )}
        {(imageFiles.length > 0 || videoFile) && (
          <p className="text-sm text-[#666] font-montserrat mt-2">
            <strong>Total file size:</strong> {totalFileSizeMB} MB
            {parseFloat(totalFileSizeMB) > 10 && (
              <span className="text-[#ff6b6b] ml-2">
                (Large files may take longer to upload)
              </span>
            )}
          </p>
        )}
      </div>

      {/* Upload Progress */}
      {isLoading && (
        <div className="mb-4 p-3 bg-[#f0f8f0] rounded">
          <p className="text-sm text-[#538e53] font-montserrat mb-2">
            {uploadProgress < 30
              ? "Preparing upload..."
              : uploadProgress < 60
              ? "Converting files to base64..."
              : uploadProgress < 80
              ? "Finalizing..."
              : uploadProgress < 100
              ? "Sending to server..."
              : "Upload complete!"}
          </p>
          <div className="w-full bg-[#e0e0e0] rounded-full h-2">
            <div
              className="bg-[#538e53] h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-[694px] mx-auto"
      >
        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="quantity"
            className="text-[14px] font-normal text-[#2b2b2b] font-montserrat"
          >
            Available Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuantity(e.target.value)
            }
            className="w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 text-[14px] font-normal text-[#2b2b2b] font-montserrat focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
            placeholder="Enter quantity available"
            min="1"
            required
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-[14px] font-normal text-[#2b2b2b] font-montserrat"
          >
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            className="w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 text-[14px] font-normal text-[#2b2b2b] font-montserrat h-[100px] resize-none focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
            placeholder="Enter product description"
            required
            disabled={isLoading}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="price"
            className="text-[14px] font-normal text-[#2b2b2b] font-montserrat"
          >
            Price (₦) *
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
            className="w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 text-[14px] font-normal text-[#2b2b2b] font-montserrat focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
            placeholder="Enter price in Naira"
            min="0.01"
            step="0.01"
            required
            disabled={isLoading}
          />
        </div>

        {/* File Upload Summary */}
        {(imageFiles.length > 0 || videoFile) && (
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-normal text-[#2b2b2b] font-montserrat">
              Files to Upload (will be sent as base64)
            </label>
            <div className="border border-[#e0e0e0] rounded-[4px] p-3 bg-[#f9f9f9]">
              {imageFiles.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-[#2b2b2b] font-montserrat font-semibold">
                    Images ({imageFiles.length}):
                  </p>
                  <ul className="text-xs text-[#666] font-montserrat ml-4">
                    {imageFiles.map((file, index) => (
                      <li key={index}>
                        • {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {videoFile && (
                <div>
                  <p className="text-sm text-[#2b2b2b] font-montserrat font-semibold">
                    Video:
                  </p>
                  <p className="text-xs text-[#666] font-montserrat ml-4">
                    • {videoFile.name} (
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mx-auto flex justify-center bg-[#538e53] text-[#fefefe] font-montserrat font-normal text-[16px] rounded-[4px] py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#467a46] transition-colors"
        >
          {isLoading
            ? uploadProgress > 0
              ? `Uploading... ${Math.round(uploadProgress)}%`
              : "Processing..."
            : "Upload Product"}
        </button>

        {/* Warning for large files */}
        {parseFloat(totalFileSizeMB) > 20 && !isLoading && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800 font-montserrat">   
              ⚠️ <strong>Large files detected:</strong> The total file size is{" "}
              {totalFileSizeMB} MB. This may take longer to upload and could
              timeout if the files are too large. Consider reducing file sizes
              for better performance.
            </p>
          </div>
        )}
      </form>
    </motion.div>
  );
};
