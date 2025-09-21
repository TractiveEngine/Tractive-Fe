"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { CalenderIcon } from "@/icons/DashboardIcons";
import { NegotiationProps, negotiations } from "@/utils/Negotiation";
import { TableList } from "../_components/table/TableList";
import { NegotiationActionMenu } from "./_components/NegotiationActionMenu";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
}

const negotiationColumns: ColumnConfig<NegotiationProps>[] = [
  {
    header: "Fleet",
    key: "name",
    minWidth: "min-w-[150px]",
    render: (negotiation) => (
      <div className="flex items-center gap-2">
        <div className="bg-[#f1f1f1] flex items-center justify-center w-[63px] h-[37px] rounded-[4px]">
          <Image
            src={negotiation.image}
            alt={negotiation.name}
            width={40}
            height={24}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-normal font-montserrat text-[#2b2b2b]">
            {negotiation.name}
          </span>
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-normal font-montserrat text-[#2b2b2b]">
            {negotiation.description}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Amount",
    key: "amount",
    minWidth: "min-w-[100px]",
    render: (negotiation) => `₦${negotiation.amount.toLocaleString()}`,
  },
  {
    header: "Negotiator",
    key: "negotiator",
    minWidth: "min-w-[120px]",
  },
  {
    header: "Weight (KG)",
    key: "KG",
    minWidth: "min-w-[100px]",
  },
  {
    header: "Location",
    key: "location",
    minWidth: "min-w-[120px]",
  },
  {
    header: "Date",
    key: "date",
    minWidth: "min-w-[100px]",
  },
];

const NegotiationListPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);
  const [negotiated, setNegotiated] = useState<NegotiationProps[]>(
    negotiations.map((item) => ({ ...item, checked: false }))
  );
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i);
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

  const handleReject = () => {
    const selectedIds = negotiated.filter((p) => p.checked).map((p) => p.id);
    if (selectedIds.length > 0) {
      console.log(`Reject negotiations with IDs: ${selectedIds.join(", ")}`);
      alert(`Reject negotiations with IDs: ${selectedIds.join(", ")}`);
      // Optionally update state to uncheck or remove rejected items
      setNegotiated(
        negotiated.map((p) => (p.checked ? { ...p, checked: false } : p))
      );
    }
  };

  const handleAccept = () => {
    const selectedIds = negotiated.filter((p) => p.checked).map((p) => p.id);
    if (selectedIds.length > 0) {
      console.log(`Accept negotiations with IDs: ${selectedIds.join(", ")}`);
      alert(`Accept negotiations with IDs: ${selectedIds.join(", ")}`);
      // Optionally update state to uncheck or remove accepted items
      setNegotiated(
        negotiated.map((p) => (p.checked ? { ...p, checked: false } : p))
      );
    }
  };

  const handleCheckboxChange = (id: string) => {
    console.log(`Checkbox toggled for ID: ${id}`);
    setNegotiated(
      negotiated.map((p: NegotiationProps) =>
        p.id === id ? { ...p, checked: !p.checked } : p
      )
    );
  };

  const handleSelectAll = () => {
    const allChecked = negotiated.every((p) => p.checked === true);
    setNegotiated(
      negotiated.map((p: NegotiationProps) => ({
        ...p,
        checked: !allChecked,
      }))
    );
  };

  const hasSelectedItems = negotiated.some((p) => p.checked);

  return (
    <div className="w-full">
      <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
        <h2 className="text-[17px] font-montserrat text-[#2b2b2b] px-6 pt-6 mb-4">
          Negotiations
        </h2>

        <div className="w-full h-[1px] bg-[#e2e2e2]"></div>
        <div className="w-full bg-[#FAF7F7] mt-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-[100%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
              <div className="relative w-[100%] sm:w-[70%] flex-grow">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-8 py-2 border-[1px] border-gray-300 rounded-[4px] text-sm sm:text-base focus:outline-none focus:ring-[#538e53] placeholder:text-[#808080] placeholder:text-sm sm:placeholder:text-base placeholder:font-montserrat placeholder:font-medium"
                  aria-label="Search negotiations"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <SearchIcon
                    stroke="#808080"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </div>
              </div>
              <div className="flex items-center w-full sm:w-auto">
                <div className="relative flex-1" ref={yearDropdownRef}>
                  <button
                    onClick={() => setIsYearOpen(!isYearOpen)}
                    className="px-3 pl-8 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tl-[4px] rounded-bl-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
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
                        variants={{
                          open: { opacity: 1, y: 0 },
                          closed: { opacity: 0, y: -10 },
                        }}
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
                          className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
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
                            className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
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
                <div className="relative flex-1" ref={monthDropdownRef}>
                  <button
                    onClick={() => setIsMonthOpen(!isMonthOpen)}
                    className="px-3 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tr-[4px] rounded-br-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
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
                        variants={{
                          open: { opacity: 1, y: 0 },
                          closed: { opacity: 0, y: -10 },
                        }}
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
                          className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
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
                            className={`px-3 py-1 text-sm sm:text-base cursor-pointer hover:bg-gray-100 ${
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

            {/* Buttons */}
            {hasSelectedItems && (
              <div className="flex items-center gap-4 justify-start md:justify-end">
                <button
                  onClick={handleReject}
                  className="cursor-pointer px-4 sm:px-6 py-2 opacity-[0.9] border-[1px] border-[#8B4513] text-[#B28362] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors hover:bg-[#9f6f50] hover:text-[#fefefe]"
                  aria-label="Reject selected negotiations"
                >
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="cursor-pointer px-4 sm:px-6 py-2 opacity-[0.9] bg-[#538e53] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors hover:bg-[#467a46]"
                  aria-label="Accept selected negotiations"
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="my-6">
          <TableList<NegotiationProps>
            dataType="negotiations"
            columns={negotiationColumns}
            initialData={negotiated}
            ActionMenuComponent={NegotiationActionMenu}
            handleReject={handleReject}
            handleAccept={handleAccept}
            handleCheckboxChange={handleCheckboxChange}
            handleSelectAll={handleSelectAll}
            allChecked={negotiated.every((p) => p.checked === true)}
          />
        </div>
      </div>
    </div>
  );
};

export default NegotiationListPage;
