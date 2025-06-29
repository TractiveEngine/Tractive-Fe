"use client";
import React, { useState } from "react";
import { ProfilePicture } from "./_components/ProfilePicture";

const ProfileSetting = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    mobile: "",
    alternativeMobile: "",
    address: "",
    localMarket: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., save to localStorage or API)
    console.log("Form submitted:", formData);
    // Example: Save to localStorage
    localStorage.setItem("SaveProfile-setting", JSON.stringify(formData));
  };

  return (
    <div className="w-[100%] bg-[#fefefe] flex flex-col items-center shadow-md rounded-[4px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 py-6 w-[90%] max-w-[500px]"
      >
        <ProfilePicture />

        {/* Full Name */}
        <div className="w-full">
          <label
            htmlFor="fullName"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Business Name */}
        <div className="w-full">
          <label
            htmlFor="businessName"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter your business name"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Email */}
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Mobile and Alternative Mobile */}
        <div className="w-full flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="mobile"
              className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
            >
              Mobile
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
              required
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="alternativeMobile"
              className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
            >
              Alternative Mobile
            </label>
            <input
              type="tel"
              id="alternativeMobile"
              name="alternativeMobile"
              value={formData.alternativeMobile}
              onChange={handleChange}
              placeholder="Enter alternative mobile"
              className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            />
          </div>
        </div>

        {/* Address */}
        <div className="w-full">
          <label
            htmlFor="address"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Local Market */}
        <div className="w-full">
          <label
            htmlFor="localMarket"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Local Market
          </label>
          <input
            type="text"
            id="localMarket"
            name="localMarket"
            value={formData.localMarket}
            onChange={handleChange}
            placeholder="Enter your local market"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Done Button */}
        <button
          type="submit"
          className="bg-[#538E53] text-[#FEFEFE] p-2 rounded-[4px] w-full font-montserrat font-medium text-[13px] hover:bg-[#214821] transition"
        >
          Done
        </button>
      </form>
    </div>
  );
};

export default ProfileSetting;