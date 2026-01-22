"use client";
import React from "react";
import Image from "next/image";

interface FarmerFormFieldsProps {
  formData: {
    name: string;
    state: string;
    address: string;
    localMarket: string;
    mobile: string;
    businessName: string;
    country: string;
    lga: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FarmerFormFields: React.FC<FarmerFormFieldsProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <>
      <div>
        <label
          htmlFor="name"
          className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
        >
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
          aria-required="true"
        />
        {errors.name && (
          <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="businessName"
          className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
        >
          Business Name *
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
          aria-required="true"
        />
        {errors.businessName && (
          <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
            {errors.businessName}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="mobile"
          className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
        >
          Phone Number *
        </label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={onChange}
          placeholder="+234..."
          className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
          aria-required="true"
        />
        {errors.mobile && (
          <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
            {errors.mobile}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
        >
          Address *
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
          aria-required="true"
        />
        {errors.address && (
          <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
            {errors.address}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="country"
          className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
        >
          Country *
        </label>
        <input
          id="country"
          name="country"
          type="text"
          value={formData.country}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
          aria-required="true"
        />
        {errors.country && (
          <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
            {errors.country}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="state"
            className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
          >
            State *
          </label>
          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
            aria-required="true"
          />
          {errors.state && (
            <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
              {errors.state}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lga"
            className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
          >
            LGA *
          </label>
          <input
            id="lga"
            name="lga"
            type="text"
            value={formData.lga}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
            aria-required="true"
          />
          {errors.lga && (
            <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
              {errors.lga}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="localMarket"
          className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
        >
          Village or Local Market *
        </label>
        <input
          id="localMarket"
          name="localMarket"
          type="text"
          value={formData.localMarket}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
          aria-required="true"
        />
        {errors.localMarket && (
          <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
            {errors.localMarket}
          </p>
        )}
      </div>
    </>
  );
};
