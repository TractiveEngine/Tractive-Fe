"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { TableList } from "../_components/table/TableList";
import { BidActionMenu } from "./_components/BidActionMenu";
import { BiddersModal } from "./_components/BiddersModal";
import { bidService, BidListing } from "@/services/bidService";
import { toast } from "sonner";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
}

const bidsColumns: ColumnConfig<BidListing>[] = [
  {
    header: "Item",
    key: "productName",
    minWidth: "min-w-[200px]",
    render: (bid) => (
      <div className="flex items-center gap-3">
        <Image
          src={bid?.productImage || "/images/placeholder.png"}
          alt={bid?.productName}
          width={60}
          height={40}
          className="object-cover rounded-[5px] w-[60px] h-[40px]"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium font-montserrat text-[#2b2b2b]">
            {bid?.productName}
          </span>
          <span className="text-[11px] font-normal font-montserrat text-[#808080]">
            {bid?.productDescription && bid?.productDescription.length > 20
              ? bid?.productDescription.substring(0, 20) + "..."
              : bid?.productDescription || "No desc"}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    key: "productPrice",
    minWidth: "min-w-[100px]",
    render: (bid) => (
      <span className="text-[13px] font-normal font-montserrat text-[#2b2b2b]">
        ₦{bid?.productPrice?.toLocaleString() || "0"}
      </span>
    ),
  },
  {
    header: "Bidder",
    key: "buyer",
    minWidth: "min-w-[120px]",
    render: (bid) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative bg-gray-200">
          <Image
            src={bid?.buyer?.avatar || "/images/placeholder-avatar.png"}
            alt={bid?.buyer?.name}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-[12px] font-normal font-montserrat text-[#2b2b2b]">
          {bid?.buyer?.name || "Unknown"}
        </span>
      </div>
    ),
  },
  {
    header: "Leading",
    key: "proposedPrice",
    minWidth: "min-w-[120px]",
    render: (bid) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 border border-white overflow-hidden relative">
          <Image
            src={bid?.buyer?.avatar || "/images/placeholder-avatar.png"}
            alt="Leading"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-[13px] font-normal font-montserrat text-[#2b2b2b]">
          ₦{bid?.proposedPrice?.toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    header: "Farmer",
    key: "farmerId",
    minWidth: "min-w-[150px]",
    render: (bid) => (
      <span className="text-[13px] font-normal font-montserrat text-[#2b2b2b]">
        {bid?.farmerName || (bid?.farmerId
          ? `Farmer ${bid?.farmerId?.substring(0, 6)}...`
          : "Kelvin chikezie")}
      </span>
    ),
  },
  {
    header: "Date",
    key: "createdAt",
    minWidth: "min-w-[100px]",
    render: (bid) => (
      <span className="text-[13px] font-normal font-montserrat text-[#2b2b2b]">
        {new Date(bid?.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];

const BidsListPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);

  const [isBiddersModalOpen, setIsBiddersModalOpen] = useState<boolean>(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );

  const [bids, setBids] = useState<BidListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchBids = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await bidService.getBids();
      setBids(data);
    } catch (error) {
      console.error("Failed to fetch bids", error);
      toast.error("Failed to fetch bids");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

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

  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  const handleViewBidders = (id: string) => {
    setSelectedListingId(id);
    setIsBiddersModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
        <h2 className="text-[17px] font-montserrat text-[#2b2b2b] px-6 pt-6 mb-4">
          Bids Management
        </h2>

        <div className="w-full h-[1px] bg-[#e2e2e2]"></div>
        <div className="w-full bg-[#FAF7F7] mt-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-[100%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
              <div className="relative w-[100%] sm:w-[70%] flex-grow">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-8 py-2 border-[1px] border-gray-300 rounded-[4px] text-sm sm:text-base focus:outline-none focus:ring-[#538e53] placeholder:text-[#808080]"
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
                {/* Year Dropdown */}
                <div className="relative flex-1" ref={yearDropdownRef}>
                  <button
                    onClick={() => setIsYearOpen(!isYearOpen)}
                    className="px-3 pl-8 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tl-[4px] rounded-bl-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] bg-white"
                  >
                    {selectedYear || "Year"}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                      {isYearOpen ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isYearOpen && (
                      <motion.div
                        className="absolute z-10 mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        {/* Options */}
                        {years.map((y) => (
                          <div
                            key={y}
                            onClick={() => {
                              setSelectedYear(String(y));
                              setIsYearOpen(false);
                            }}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          >
                            {y}
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
                    className="px-3 pr-10 py-2 border-[1px] cursor-pointer border-[#808080] rounded-tr-[4px] rounded-br-[4px] text-sm sm:text-base text-left w-full sm:w-[100px] bg-white"
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
                        className="absolute z-10 mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        {months.map((m) => (
                          <div
                            key={m}
                            onClick={() => {
                              setSelectedMonth(m);
                              setIsMonthOpen(false);
                            }}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {m}
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
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#538e53] border-t-transparent rounded-full" />
            </div>
          ) : (
            <TableList<BidListing>
              dataType="bids"
              columns={bidsColumns}
              initialData={bids}
              ActionMenuComponent={BidActionMenu}
              handleViewBidders={handleViewBidders}
            />
          )}

          {!isLoading && bids.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No active bids found.
            </div>
          )}
        </div>

        {isBiddersModalOpen && selectedListingId && (
          <BiddersModal
            isOpen={isBiddersModalOpen}
            onClose={() => setIsBiddersModalOpen(false)}
            listingId={selectedListingId}
          />
        )}
      </div>
    </div>
  );
};

export default BidsListPage;
