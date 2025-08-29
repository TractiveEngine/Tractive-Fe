"use client";
import React, { useState, useRef, useEffect } from "react";
import { LiaAngleDownSolid } from "react-icons/lia";

interface FilterTransporterProps {
  setFromState: React.Dispatch<React.SetStateAction<string>>;
  setToState: React.Dispatch<React.SetStateAction<string>>;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  fromState: string;
  toState: string;
  sortOption: string;
}

interface CustomDropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  widthClass?: string;
  noBorder?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selected,
  onSelect,
  placeholder,
  ariaLabel,
  widthClass = "w-[45%] md:w-[97px]",
  noBorder = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, value?: string) => {
    if (e.key === "Enter" || e.key === " ") {
      if (value) handleSelect(value);
      else handleToggle();
    }
    if (e.key === "Escape") setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative ${widthClass} ${
        noBorder ? "flex items-center" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`flex items-center justify-between gap-2 h-8 px-3 text-[#2b2b2b] text-[12px] font-montserrat font-normal rounded-md transition-colors duration-200 ${
          noBorder
            ? "border-none bg-transparent cursor-pointer"
            : "border border-[#808080] w-full hover:border-[#538e53] cursor-pointer  focus:outline-none focus:ring-1 focus:ring-[#538e53] bg-[#fefefe]"
        }`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <span className="truncate">{selected || placeholder || "Select"}</span>
        <LiaAngleDownSolid
          className={`text-[#808080] text-base transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <ul
          className={`absolute z-10 w-full mt-1 bg-[#fefefe] rounded-md shadow-lg max-h-48 overflow-y-auto border border-[#e0e0e0] ${
            noBorder ? "top-8 md:w-[120px] left-0" : ""
          }`}
        >
          {options.map((option) => (
            <li
              key={option}
              className="px-3 py-2 text-[12px] font-montserrat font-normal text-[#2b2b2b] cursor-pointer hover:bg-[#538e53] hover:text-[#fefefe] transition-colors duration-150"
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              tabIndex={0}
              role="option"
              aria-selected={selected === option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const FilterTransporter = ({
  setFromState,
  setToState,
  setSortOption,
  fromState,
  toState,
  sortOption,
}: FilterTransporterProps) => {
  const nigerianStates = [
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
    "FCT",
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
  ];

  const sortOptions = ["All", "Empty", "Almost Full"];

  return (
    <div className="w-full bg-[#fefefe]">
      <div className="w-[90%] mx-auto py-4 flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="w-full flex flex-col md:flex-row justify-center lg:justify-start items-center gap-4 md:gap-8">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-[270px] h-10 px-4 border border-[#808080] rounded-full text-[#2b2b2b] placeholder-[#808080] focus:outline-none focus:ring-1 focus:ring-[#538e53] focus:border-transparent text-sm md:text-base transition-all duration-200"
          />

          {/* Route Filter */}
          <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
            <label className="text-sm font-montserrat font-normal text-[#808080] whitespace-nowrap">
              Route:
            </label>
            <div className="flex items-center w-full md:w-auto gap-2">
              <CustomDropdown
                options={nigerianStates}
                selected={fromState}
                onSelect={setFromState}
                placeholder="State"
                ariaLabel="State"
                widthClass="w-[45%] md:w-[120px]"
              />
              <span className="text-sm font-montserrat font-normal bg-[#cce5ccb2] px-3 py-1 rounded-md text-[#808080]">
                To
              </span>
              <CustomDropdown
                options={nigerianStates}
                selected={toState}
                onSelect={setToState}
                placeholder="State"
                ariaLabel="State"
                widthClass="w-[45%] md:w-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Sort by Dropdown */}
        <div className="flex items-center justify-center lg:justify-end gap-2 w-full md:w-auto">
          <span className="text-[12px] font-montserrat font-normal text-[#808080] whitespace-nowrap">
            Sort by:
          </span>
          <CustomDropdown
            options={sortOptions}
            selected={sortOption}
            onSelect={setSortOption}
            placeholder="Sort Option"
            ariaLabel="Sort Option"
            widthClass=""
            noBorder={true}
          />
        </div>
      </div>
    </div>
  );
};
