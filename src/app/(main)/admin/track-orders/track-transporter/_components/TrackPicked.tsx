"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { CalenderIcon } from "@/icons/DashboardIcons";
import { ATTrackSwitch } from "../../_components/ATTrackSwitch";
import AdminTable, {
  ColumnConfig,
} from "../../../_components/table/AdminTableList";
import {
  TransporterData,
  transporterDataProps,
} from "@/utils/TrackTransporterData";
import Image from "next/image";
import { TrackTransporterActionMenu } from "./TrackTransporterActionMenu";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const columns: ColumnConfig<TransporterData>[] = [
  {
    key: "title",
    header: "Produce",
    render: (item: TransporterData) => (
      <div className="flex items-center gap-3">
        <div className="bg-[#f1f1f1] flex items-center justify-center w-[63px] h-[37px] rounded-[4px]">
          <Image
            src={item.image}
            alt={item.title}
            width={40}
            height={24}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-montserrat font-normal text-[#2b2b2b]">
            {item.title}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-montserrat font-normal text-[#808080]">
            {item.description}
          </span>
        </div>
      </div>
    ),
    minWidth: "min-w-[200px]",
  },
  { key: "IOT", header: "IOT", minWidth: "min-w-[120px]" },
  { key: "buyerName", header: "Buyer", minWidth: "min-w-[100px]" },
  { key: "transporterName", header: "Transporter", minWidth: "min-w-[100px]" },
  { key: "amount", header: "Amount", minWidth: "min-w-[100px]" },
  { key: "date", header: "Date", minWidth: "min-w-[100px]" },
];

export const TrackPicked: React.FC<transporterDataProps> = ({
  transport,
  handleTransporterInfo,
  handleTrackOrder,
  handleTBuyerInfo,
  handleCheckboxChange,
  handleSelectAll,
  allChecked,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Generate years from 2019 to 2025
  const years = Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i);

  // Filter data based on year, month, state, and search term
  const filteredTrackedData = useMemo(() => {
    return transport.filter((transport) => {
      const matchesYear = selectedYear
        ? transport.date.includes(selectedYear)
        : true;
      const matchesMonth = selectedMonth
        ? transport.date.startsWith(
            `${months.indexOf(selectedMonth) + 1 < 10 ? "0" : ""}${
              months.indexOf(selectedMonth) + 1
            }`
          )
        : true;
      const matchesSearch = searchTerm
        ? transport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transport.buyerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transport.transporterName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      return matchesYear && matchesMonth && matchesSearch;
    });
  }, [transport, selectedYear, selectedMonth, searchTerm]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearOpen(false);
      }
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMonthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsYearOpen(false);
        setIsMonthOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dropdown animation variants
  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full bg-[#FAF7F7] mt-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-6">
          {/* Search and Dropdowns */}
          <div className="flex flex-col sm:flex-row items-center gap-8 w-[100%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[75%] 2xl:[60%]">
            {/* Search Input */}
            <div className="relative w-[100%] sm:w-[70%] flex-grow">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 py-2 border-[1px] border-gray-300 rounded-[4px] text-sm sm:text-base focus:outline-none focus:ring-[#538e53] placeholder:text-[#808080] placeholder:text-sm sm:placeholder:text-base placeholder:font-montserrat placeholder:font-medium"
                aria-label="Search all transactions"
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">
                Search for transactions by name or email
              </span>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <SearchIcon
                  stroke="#808080"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </div>
            </div>
            {/* Agent and Transporter navigation */}
            <ATTrackSwitch />

            <div className="flex items-center w-full sm:w-auto">
              {/* Year Dropdown */}
              <div className="relative flex-1" ref={yearDropdownRef}>
                <button
                  onClick={() => setIsYearOpen(!isYearOpen)}
                  className="px-3 pl-8 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tl-[4px] rounded-bl-[4px] text-[12px] font-montserrat text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
                  role="combobox"
                  aria-expanded={isYearOpen}
                  aria-controls="year-dropdown"
                  aria-label={
                    selectedYear
                      ? `Selected year: ${selectedYear}`
                      : "Select year"
                  }
                >
                  {selectedYear || "Year"}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                    {isYearOpen ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                    <CalenderIcon />
                  </div>
                </button>
                <AnimatePresence>
                  {isYearOpen && (
                    <motion.div
                      id="year-dropdown"
                      className="absolute z-10 mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                      role="listbox"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div
                        onClick={() => {
                          setSelectedYear("");
                          setIsYearOpen(false);
                        }}
                        className={`px-3 py-1 text-[12px] cursor-pointer font-montserrat hover:bg-gray-100 ${
                          selectedYear === "" ? "bg-gray-200" : ""
                        }`}
                        role="option"
                        aria-selected={selectedYear === ""}
                      >
                        Year
                      </div>
                      {years.map((year) => (
                        <div
                          key={year}
                          onClick={() => {
                            setSelectedYear(year.toString());
                            setIsYearOpen(false);
                          }}
                          className={`px-3 py-1 text-[12px] cursor-pointer font-montserrat hover:bg-gray-100 ${
                            selectedYear === year.toString()
                              ? "bg-gray-200"
                              : ""
                          }`}
                          role="option"
                          aria-selected={selectedYear === year.toString()}
                        >
                          {year}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Month Dropdown */}
              <div className="relative flex-1" ref={monthDropdownRef}>
                <button
                  onClick={() => setIsMonthOpen(!isMonthOpen)}
                  className="px-3 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] text-[12px] font-montserrat text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
                  role="combobox"
                  aria-expanded={isMonthOpen}
                  aria-controls="month-dropdown"
                  aria-label={
                    selectedMonth
                      ? `Selected month: ${selectedMonth}`
                      : "Select month"
                  }
                >
                  {selectedMonth || "Month"}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                    {isMonthOpen ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {isMonthOpen && (
                    <motion.div
                      id="month-dropdown"
                      className="absolute z-10 mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                      role="listbox"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div
                        onClick={() => {
                          setSelectedMonth("");
                          setIsMonthOpen(false);
                        }}
                        className={`px-3 py-1 text-[12px] cursor-pointer font-montserrat hover:bg-gray-100 ${
                          selectedMonth === "" ? "bg-gray-200" : ""
                        }`}
                        role="option"
                        aria-selected={selectedMonth === ""}
                      >
                        Month
                      </div>
                      {months.map((month) => (
                        <div
                          key={month}
                          onClick={() => {
                            setSelectedMonth(month);
                            setIsMonthOpen(false);
                          }}
                          className={`px-3 py-1 text-[12px] cursor-pointer font-montserrat hover:bg-gray-100 ${
                            selectedMonth === month ? "bg-gray-200" : ""
                          }`}
                          role="option"
                          aria-selected={selectedMonth === month}
                        >
                          {month}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 w-full">
        <AdminTable<TransporterData>
          dataType="TrackTransporterData"
          columns={columns}
          initialData={filteredTrackedData}
          ActionMenuComponent={TrackTransporterActionMenu}
          handleTBuyerInfo={handleTBuyerInfo}
          handleTransporterInfo={handleTransporterInfo}
          handleTrackOrder={handleTrackOrder}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      </div>
    </div>
  );
};
