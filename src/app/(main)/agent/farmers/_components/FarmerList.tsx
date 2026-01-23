"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { AddToStoreIcon, CalenderIcon } from "@/icons/DashboardIcons";
import { TableList } from "../../_components/table/TableList";
import { FarmerActionMenu } from "./FarmerActionMenu";
import { Farmer } from "@/services/FarmerService";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
}

const farmerColumns: ColumnConfig<Farmer>[] = [
  {
    header: "Name",
    key: "name",
    minWidth: "min-w-[150px]",
    render: (farmer) => (
      <div className="flex items-center gap-2">
        <Image
          src={farmer.image}
          alt={farmer.name}
          width={25}
          height={25}
          className="rounded-full w-[25px] h-[25px] sm:w-[35px] sm:h-[35px] object-cover"
        />
        <span className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-normal font-montserrat text-[#2b2b2b]">
          {farmer.name}
        </span>
      </div>
    ),
  },
  {
    header: "State",
    key: "state",
    minWidth: "min-w-[100px]",
  },
  {
    header: "Revenue",
    key: "revenue",
    minWidth: "min-w-[100px]",
  },
  {
    header: "Orders",
    key: "orders",
    minWidth: "min-w-[100px]",
  },
  {
    header: "Mobile",
    key: "mobile",
    minWidth: "min-w-[120px]",
  },
  {
    header: "Date",
    key: "date",
    minWidth: "min-w-[100px]",
  },
];

interface FarmerListProps {
  farmers: Farmer[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onAdd: () => void;
  onView: (id: string) => void;
}

export const FarmerList: React.FC<FarmerListProps> = ({
  farmers,
  isLoading,
  onEdit,
  onAdd,
  onView,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);

  const years = Array.from({ length: 2025 - 2024 + 1 }, (_, i) => 2024 + i);
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

  // Client-side filtering
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      !searchQuery ||
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (farmer.state ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.mobile.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      !selectedYear || farmer.date.includes(selectedYear.toString());

    const matchesMonth =
      !selectedMonth ||
      farmer.date.includes(
        (months.indexOf(selectedMonth) + 1).toString().padStart(2, "0"),
      );

    return matchesSearch && matchesYear && matchesMonth;
  });

  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  return (
    <>
      <div className="w-full bg-[#FAF7F7] mt-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-[100%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
            {/* Search */}
            <div className="relative w-[100%] sm:w-[70%] flex-grow">
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 py-2 border-[1px] border-gray-300 rounded-[4px] text-sm sm:text-base focus:outline-none focus:ring-[#538e53] placeholder:text-[#808080] placeholder:text-sm sm:placeholder:text-base placeholder:font-montserrat placeholder:font-medium"
                aria-label="Search farmers"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <SearchIcon
                  stroke="#808080"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </div>
            </div>

            {/* Year and Month filters */}
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative flex-1">
                <button
                  onClick={() => setIsYearOpen(!isYearOpen)}
                  className="px-3 pl-8 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tl-[4px] rounded-bl-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
                >
                  {selectedYear || "Year"}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isYearOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <CalenderIcon />
                  </div>
                </button>
                <AnimatePresence>
                  {isYearOpen && (
                    <motion.div
                      className="absolute z-[100] mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <div
                        onClick={() => {
                          setSelectedYear("");
                          setIsYearOpen(false);
                        }}
                        className={`px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                          selectedYear === "" ? "bg-gray-200" : ""
                        }`}
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
                          className={`px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                            selectedYear === year.toString()
                              ? "bg-gray-200"
                              : ""
                          }`}
                        >
                          {year}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1">
                <button
                  onClick={() => setIsMonthOpen(!isMonthOpen)}
                  className="px-3 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tr-[4px] rounded-br-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
                >
                  {selectedMonth || "Month"}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isMonthOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                </button>
                <AnimatePresence>
                  {isMonthOpen && (
                    <motion.div
                      className="absolute z-[100] mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <div
                        onClick={() => {
                          setSelectedMonth("");
                          setIsMonthOpen(false);
                        }}
                        className={`px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                          selectedMonth === "" ? "bg-gray-200" : ""
                        }`}
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
                          className={`px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                            selectedMonth === month ? "bg-gray-200" : ""
                          }`}
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

          {/* Onboard Button */}
          <div className="flex items-center gap-4 justify-end">
            <button
              onClick={onAdd}
              className="cursor-pointer flex items-center gap-[7px] px-4 sm:px-6 py-2 opacity-[0.92] bg-[#538e53] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors hover:bg-[#467a46] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Onboard farmer"
            >
              <AddToStoreIcon stroke="#fefefe" />
              Onboard
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="my-6">
        {filteredFarmers.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Image
              src="/images/noData.png"
              alt="No Data"
              width={106}
              height={60}
            />
            <p className="text-[13px] font-montserrat mb-2">No farmers found</p>
            <p className="text-[11px] font-montserrat">
              {searchQuery || selectedYear || selectedMonth
                ? "Try adjusting your filters"
                : "Start by onboarding your first farmer"}
            </p>
          </div>
        ) : (
          <TableList<Farmer>
            dataType="farmers"
            columns={farmerColumns}
            initialData={filteredFarmers}
            ActionMenuComponent={FarmerActionMenu}
            handleEdit={onEdit}
            handleView={onView}
          />
        )}
      </div>
    </>
  );
};
