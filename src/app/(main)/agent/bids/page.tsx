"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { CalenderIcon } from "@/icons/DashboardIcons";
import { TableList } from "../_components/table/TableList";
import { Bids, bidsList, Bidder } from "@/utils/BidsData";
import { BidActionMenu } from "./_components/BidActionMenu";
import { BiddersModal } from "./_components/BiddersModal";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
}

const bidsColumns: ColumnConfig<Bids>[] = [
  {
    header: "Item",
    key: "name",
    minWidth: "min-w-[150px]",
    render: (bid) => (
      <div className="flex items-center gap-2">
        <Image
          src={bid.image}
          alt={bid.name}
          width={83}
          height={47}
          className="object-cover w-[53px] h-[30px]"
        />
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-normal font-montserrat text-[#2b2b2b]">
            {bid.name}
          </span>
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-normal font-montserrat text-[#2b2b2b]">
            {bid.description}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    key: "price",
    minWidth: "min-w-[100px]",
    render: (bid) => `$${bid.price.toFixed(2)}`,
  },
  {
    header: "Bidders",
    key: "bidders",
    minWidth: "min-w-[120px]",
    render: (bid) => (
      <div className="flex items-center gap-6 sm:gap-7">
        <div className="relative w-[30px] h-[30px]">
          <Image
            src="/images/bidder1.png"
            alt="Bidder 1"
            width={20}
            height={20}
            className="absolute left-0 z-10 sm:w-[25px] sm:h-[25px]"
          />
          <Image
            src="/images/bidder2.png"
            alt="Bidder 2"
            width={20}
            height={20}
            className="absolute left-[10px] sm:left-[12px] z-20 sm:w-[25px] sm:h-[25px]"
          />
          <Image
            src="/images/bidder3.png"
            alt="Bidder 3"
            width={20}
            height={20}
            className="absolute left-[20px] sm:left-[28px] z-30 sm:w-[25px] sm:h-[25px]"
          />
        </div>
        <p className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b]">
          {bid.bidders}
        </p>
      </div>
    ),
  },
  {
    header: "Leading",
    key: "leading",
    minWidth: "min-w-[120px]",
    render: (bid) => (
      <div className="flex items-center gap-2">
        <Image
          src="/images/leadingavatar.png"
          alt="Leading Bid"
          width={20}
          height={20}
          className="w-[20px] h-[20px]"
        />
        <span className="font-montserrat font-normal text-[10px] sm:text-[12px] text-[#2b2b2b]">
          ${bid.leading.toFixed(2)}
        </span>
      </div>
    ),
  },
  {
    header: "Farmer",
    key: "farmer",
    minWidth: "min-w-[100px]",
  },
  {
    header: "Date",
    key: "date",
    minWidth: "min-w-[100px]",
  },
];

const BidsListPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);
  const [isBiddersModalOpen, setIsBiddersModalOpen] = useState<boolean>(false);
  const [selectedBidders, setSelectedBidders] = useState<Bidder[]>([]);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
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
        setIsBiddersModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    console.log("Modal state:", {
      isBiddersModalOpen,
      selectedBidders,
      selectedItemName,
    });
  }, [isBiddersModalOpen, selectedBidders, selectedItemName]);

  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  const handleViewBidders = (id: string) => {
    console.log(`handleViewBidders called with id: ${id}`);
    const bid = bidsList.find((b) => b.id === id);
    if (bid) {
      console.log(`Bid found:`, bid);
      setSelectedBidders(bid.biddersList || []);
      setSelectedItemName(bid.name);
      setIsBiddersModalOpen(true);
    } else {
      console.log(`No bid found for id: ${id}`);
    }
  };

  return (
    <div className="w-full">
      <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
        <h2 className="text-[17px] font-montserrat text-[#2b2b2b] px-6 pt-6 mb-4">
          Bids
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
                  aria-label="Search bids"
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
                    aria-label={selectedYear ? "Selected year" : "Select year"}
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
                      selectedMonth ? "Selected month" : "Select month"
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
          </div>
        </div>
        <div className="my-6">
          <TableList<Bids>
            dataType="bids"
            columns={bidsColumns}
            initialData={bidsList}
            ActionMenuComponent={BidActionMenu}
            handleViewBidders={handleViewBidders}
          />
        </div>
        <BiddersModal
          isOpen={isBiddersModalOpen}
          onClose={() => setIsBiddersModalOpen(false)}
          bidders={selectedBidders}
          itemName={selectedItemName}
        />
      </div>
    </div>
  );
};

export default BidsListPage;
