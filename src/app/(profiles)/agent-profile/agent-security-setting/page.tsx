"use client";
import { changePassword, ChangePasswordData } from "@/utils/changePasswordApi";
import React, { useState } from "react";
import { toast } from "sonner";
const SecuritySetting = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic password match validation
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    // Basic password strength validation (optional)
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);

    try {
      // Get token from localStorage or your preferred auth storage
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        "";

      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const changePasswordData: ChangePasswordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const response = await changePassword(changePasswordData, token);

      if (response.success || response.message) {
        toast.success(response.message || "Password changed successfully!");
        // Reset form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error(
          response.error || "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        (error as Error).message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[100%] bg-[#fefefe] flex flex-col items-center shadow-md rounded-[4px] pt-[4rem]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-4 py-6 w-[90%] max-w-[500px]"
      >
        {/* Current Password */}
        <div className="w-full">
          <label
            htmlFor="currentPassword"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[13px] font-montserrat text-[#2b2b2b]"
            required
            disabled={isLoading}
          />
        </div>
        <span className="w-[100%] h-[1px] bg-[#e2e2e2]"></span>

        <span className="font-montserrat font-normal text-[15px] flex items-center justify-start text-[#2b2b2b] text-left">
          Create New Password
        </span>

        {/* New Password */}
        <div className="w-full">
          <label
            htmlFor="newPassword"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[13px] font-montserrat text-[#2b2b2b]"
            required
            disabled={isLoading}
          />
        </div>

        {/* Confirm New Password */}
        <div className="w-full">
          <label
            htmlFor="confirmNewPassword"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[13px] font-montserrat text-[#2b2b2b]"
            required
            disabled={isLoading}
          />
        </div>

        {/* Done Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#538E53] text-[#FEFEFE] p-2 rounded-[4px] w-full font-montserrat font-medium text-[14px] hover:bg-[#214821] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Changing Password..." : "Done"}
        </button>
      </form>
    </div>
  );
};

export default SecuritySetting;
