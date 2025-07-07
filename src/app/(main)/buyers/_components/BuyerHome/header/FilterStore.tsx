"use client";

import React, { useState } from "react";

export const FilterStore: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // List of states in Nigeria, including the FCT
  const locations = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Abuja (FCT)",
  ];

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="location-select"
        className="text-[#2B2B2B] text-[0.65rem] sm:text-[0.79] font-normal mb-2 block"
      >
        Select Location
      </label>
      <div className="relative w-[90%]">
        <select
          id="location-select"
          className="w-full p-2 pr-8 border border-[#808080] rounded-[4px] text-[0.65rem] sm:text-[0.79] font-normal text-[#2B2B2B] bg-[#fefefe] focus:outline-none focus:ring-[0.1px] focus:ring-[#538E53] transition appearance-none"
          value={selectedLocation || ""}
          onChange={(e) => handleLocationSelect(e.target.value)}
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-2 top-[1.2rem] transform -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2B2B2B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
