import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface UseCloudinaryUploadResult {
  uploadToCloudinary: (file: File) => Promise<string>;
  isUploading: boolean;
  error: string | null;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadResult => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      const msg =
        "Cloudinary environment variables are missing (CLOUD_NAME or UPLOAD_PRESET).";
      console.error(msg);
      setError(msg);
      setIsUploading(false);
      toast.error("System configuration error: Cloudinary keys missing.");
      throw new Error(msg);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Determine resource type based on file MIME type
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formData,
      );

      const url = response.data.secure_url;
      return url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(`Cloudinary ${resourceType} upload error:`, err);
      const errMsg =
        err.response?.data?.error?.message ||
        `Failed to upload ${resourceType}`;
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToCloudinary, isUploading, error };
};
