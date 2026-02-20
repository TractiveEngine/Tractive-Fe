"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./Icons/AgentIcons";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCreateProduct } from "@/hooks/queries/useProductQueries";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

interface ItemDetailsFormProps {
  onBack: () => void;
  onClose: () => void;
  selectedCategory: string | null;
  productName: string;
  selectedFarmerId: string | null;
  imageFiles: File[];
  videoFiles?: File[]; // Optional array of videos
}

export const ItemDetailsForm: React.FC<ItemDetailsFormProps> = ({
  onBack,
  onClose,
  selectedCategory,
  productName,
  selectedFarmerId,
  imageFiles,
  videoFiles = [], // Default to empty array
}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { uploadToCloudinary } = useCloudinaryUpload();

  // Handle form submission
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(10);

    try {
      console.log("🚀 Step 1: Starting product upload...");

      // Validate required fields
      if (!selectedFarmerId) {
        toast.error("Farmer is required");
        setIsLoading(false);
        return;
      }
      if (!productName.trim()) {
        toast.error("Product name is required");
        setIsLoading(false);
        return;
      }
      if (!selectedCategory) {
        toast.error("Category is required");
        setIsLoading(false);
        return;
      }
      if (!description.trim()) {
        toast.error("Description is required");
        setIsLoading(false);
        return;
      }
      if (!unit.trim()) {
        toast.error("Unit is required");
        setIsLoading(false);
        return;
      }
      if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
        toast.error("Valid price is required");
        setIsLoading(false);
        return;
      }
      if (
        !quantity.trim() ||
        isNaN(Number(quantity)) ||
        Number(quantity) <= 0
      ) {
        toast.error("Valid quantity is required");
        setIsLoading(false);
        return;
      }

      console.log("✅ Step 2: All fields validated");

      // Upload images to Cloudinary
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      if (imageFiles.length > 0) {
        setUploadProgress(20);
        console.log(
          `🔄 Step 3a: Uploading ${imageFiles.length} images to Cloudinary...`,
        );

        const uploadPromises = imageFiles.map((file) =>
          uploadToCloudinary(file),
        );
        imageUrls = await Promise.all(uploadPromises);

        console.log("✅ Images uploaded:", imageUrls);
      }

      // Upload videos to Cloudinary
      if (videoFiles.length > 0) {
        setUploadProgress(40);
        console.log(
          `🔄 Step 3b: Uploading ${videoFiles.length} videos to Cloudinary...`,
        );

        const uploadPromises = videoFiles.map((file) =>
          uploadToCloudinary(file),
        );
        videoUrls = await Promise.all(uploadPromises);

        console.log("✅ Videos uploaded:", videoUrls);
      }

      setUploadProgress(70);

      // Prepare API payload matching the spec
      const apiPayload = {
        name: productName.trim(),
        description: description.trim(),
        price: parseInt(price, 10),
        quantity: Number(quantity),
        unit: unit.trim(),
        images: imageUrls,
        videos: videoUrls, // Include videos
        categories: [selectedCategory],
        farmer: selectedFarmerId,
      };

      console.log("✅ Step 5: Payload prepared", apiPayload);
      setUploadProgress(80);

      // Make API call using the hook
      console.log("🚀 Step 6: sending mutation...");

      await createProduct(apiPayload);

      setUploadProgress(100);

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("❌ Error creating product:", error);
      if (error instanceof Error && error.message.includes("FileReader")) {
        toast.error(
          "Failed to process files. Please try again with smaller files.",
          {
            duration: 5000,
            position: "top-center",
          },
        );
        return;
      }

      toast.error("Failed to create product. Please try again.", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Calculate total file size
  const getTotalFileSize = (): number => {
    let totalSize = 0;
    imageFiles.forEach((file) => (totalSize += file.size));
    if (videoFiles) {
      videoFiles.forEach((file) => (totalSize += file.size));
    }
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

        {/* Unit */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="unit"
            className="text-[14px] font-normal text-[#2b2b2b] font-montserrat"
          >
            Unit (e.g., kg, pieces, bags) *
          </label>
          <input
            type="text"
            id="unit"
            value={unit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUnit(e.target.value)
            }
            className="w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 text-[14px] font-normal text-[#2b2b2b] font-montserrat focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
            placeholder="Enter unit"
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
            type="text"
            inputMode="numeric"
            id="price"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // Only allow digits
              const val = e.target.value.replace(/[^0-9]/g, "");
              setPrice(val);
            }}
            className="w-full border-[1px] border-[#2b2b2b] rounded-[4px] px-3 py-2 text-[14px] font-normal text-[#2b2b2b] font-montserrat focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
            placeholder="Enter price in Naira"
            required
            disabled={isLoading}
          />
        </div>

        {/* File Upload Summary */}
        {(imageFiles.length > 0 || videoFiles.length > 0) && (
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-normal text-[#2b2b2b] font-montserrat">
              Files to Upload
            </label>
            <div className="border border-[#e0e0e0] rounded-[4px] p-3 bg-[#f9f9f9]">
              {imageFiles.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-[#2b2b2b] font-montserrat font-semibold">
                    Images ({imageFiles.length}):
                  </p>
                  <ul className="text-xs text-[#666] font-montserrat ml-4">
                    {imageFiles.map((file, index) => (
                      <li key={`img-${index}`}>
                        • {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {videoFiles.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-[#2b2b2b] font-montserrat font-semibold">
                    Videos ({videoFiles.length}):
                  </p>
                  <ul className="text-xs text-[#666] font-montserrat ml-4">
                    {videoFiles.map((file, index) => (
                      <li key={`vid-${index}`}>
                        • {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </li>
                    ))}
                  </ul>
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
