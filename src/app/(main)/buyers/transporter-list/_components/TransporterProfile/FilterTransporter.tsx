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
        noBorder ? "flex justify-end items-center" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`flex items-center justify-center gap-[1rem] w-full h-[1.7rem] p-1 text-[#2b2b2b] text-[12px] font-montserrat font-normal focus:outline-none focus:ring-[0.5px] focus:ring-[#538e53] cursor-pointer bg-[#fefefe] ${
          noBorder
            ? "border-none focus:ring-0 focus:ring-transparent bg-transparent justify-end"
            : "border-[1px] border-[#808080]"
        } rounded-[5px]`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <span className="truncate">{selected || placeholder || "Select"}</span>
        <LiaAngleDownSolid className="text-[#808080] text-[12px]" />
      </button>
      {isOpen && (
        <ul
          className={`absolute z-10 w-full mt-1 bg-[#fefefe] rounded-[5px] shadow-[0px_4px_10px_rgba(0,0,0,0.1)] max-h-[200px] overflow-y-auto ${
            noBorder
              ? "shadow-[0px_4px_10px_rgba(0,0,0,0.1)] top-6 -left-[0rem] md:w-[100px]"
              : "border-[1px] border-[#808080]"
          }`}
        >
          {options.map((option) => (
            <li
              key={option}
              className="px-2 py-1 text-[12px] font-montserrat font-normal text-[#2b2b2b] cursor-pointer hover:bg-[#538e53] hover:text-[#fefefe]"
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
      <div className="w-[90%] mx-auto py-3 flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center gap-8">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="w-[70%] md:w-[270px] h-[2.4rem] p-2 border border-[#808080] rounded-[100px] text-[#2b2b2b] placeholder-[#808080] focus:outline-none focus:ring-[0.5px] focus:ring-[#538e53] focus:border-transparent text-[12px] sm:text-[14px]"
          />

          {/* Route Filter */}
          <div className="w-[100%] md:w-auto flex flex-col md:flex-row md:items-center gap-2 p-2">
            <label className="text-[12px] font-montserrat font-normal text-[#808080]">
              Route:
            </label>
            <div className="flex items-center w-[100%] flex-wrap gap-2">
              <CustomDropdown
                options={nigerianStates}
                selected={fromState}
                onSelect={setFromState}
                placeholder="State"
                ariaLabel="From State"
              />
              <span className="text-[12px] flex flex-col items-center justify-center rounded-[4px] font-montserrat font-normal bg-[#cce5ccb2] px-[11px] py-1 h-[21.5px] text-[#808080]">
                To
              </span>
              <CustomDropdown
                options={nigerianStates}
                selected={toState}
                onSelect={setToState}
                placeholder="State"
                ariaLabel="To State"
              />
            </div>
          </div>
        </div>

        {/* Sort by Dropdown */}
        <div className="relative flex items-center justify-end w-[100%] md:w-auto p-2">
          <span className="text-[12px] flex justify-end w-[100%] font-montserrat font-normal text-[#808080]">
            Sort by:
          </span>
          <CustomDropdown
            options={sortOptions}
            selected={sortOption}
            onSelect={setSortOption}
            placeholder="Sort Option"
            ariaLabel="Sort Option"
            widthClass="w-[100%] md:w-[97px]"
            noBorder={true}
          />
        </div>
      </div>
    </div>
  );
};
