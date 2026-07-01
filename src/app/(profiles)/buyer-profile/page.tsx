"use client";
import React, { useState, useEffect } from "react";
import { ProfilePicture } from "./_components/ProfilePicture";
import { useSession } from "next-auth/react";
import { useProfile, useUpdateProfile } from "@/hooks/queries/useUserQueries";

const ProfileSetting = () => {
  const { data: session, update } = useSession();

  const { data: profile, isLoading: fetchingProfile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
  });

  // Populate the form once profile data arrives
  useEffect(() => {
    if (!profile) return;
    setFormData({
      name: profile.name || session?.user?.name || "",
      email: profile.email || session?.user?.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
      country: profile.country || "",
      state: profile.state || "",
    });
  }, [profile, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // email is read-only and excluded from the payload
    await updateProfile.mutateAsync(
      {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        country: formData.country,
        state: formData.state,
      },
      {
        onSuccess: async () => {
          if (session?.user && formData.name !== session.user.name) {
            await update({
              ...session,
              user: { ...session.user, name: formData.name },
            });
          }
        },
      },
    );
  };

  if (fetchingProfile) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full" />
          <span className="text-[#538e53] font-montserrat text-[14px]">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]";

  return (
    <div className="w-[100%] bg-[#fefefe] flex flex-col items-center shadow-md rounded-[4px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 py-6 w-[90%] max-w-[500px]"
      >
        {/* Image upload — not included in payload */}
        <ProfilePicture />

        {/* Full Name */}
        <div className="w-full">
          <label
            htmlFor="name"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={inputClass}
            required
          />
        </div>

        {/* Email — read-only */}
        <div className="w-full">
          <label
            htmlFor="email"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            readOnly
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] bg-[#f5f5f5] text-[13px] font-montserrat text-[#808080] cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div className="w-full">
          <label
            htmlFor="phone"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +2348011223344"
            className={inputClass}
            required
          />
        </div>

        {/* Address */}
        <div className="w-full">
          <label
            htmlFor="address"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className={inputClass}
            required
          />
        </div>

        {/* Country & State */}
        <div className="w-full flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="country"
              className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. Nigeria"
              className={inputClass}
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="state"
              className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Lagos"
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className={`p-2 rounded-[4px] w-full font-montserrat font-medium text-[13px] transition-colors cursor-pointer ${
            updateProfile.isPending
              ? "bg-[#a0dfa0] text-[#fefefe] cursor-not-allowed"
              : "bg-[#538E53] text-[#FEFEFE] hover:bg-[#214821]"
          }`}
        >
          {updateProfile.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#fefefe] border-t-transparent rounded-full" />
              <span>Updating...</span>
            </div>
          ) : (
            "Done"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetting;
