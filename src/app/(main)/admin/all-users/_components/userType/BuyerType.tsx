"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { CalenderIcon } from "@/icons/DashboardIcons";
import { initialUsers, User } from "@/utils/userTypes";
import { UserActionMenu } from "../UserActionMenu";
import AdminTable, {
  ColumnConfig,
} from "../../../_components/table/AdminTableList";
import Image from "next/image";

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

// List of Nigeria's 36 states plus FCT
const nigeriaStates = [
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

type statusTypes = "All" | "Active" | "Suspended";
const statusTypes: statusTypes[] = ["All", "Active", "Suspended"];

type ProfessionTypes = "All" | "Agents" | "Transporter" | "Farmer" | "Buyer";
const ProfessionTypes: ProfessionTypes[] = [
  "All",
  "Agents",
  "Transporter",
  "Farmer",
  "Buyer",
];

// Define table columns with improved responsive min-widths
const columns: ColumnConfig<User>[] = [
  {
    key: "fullname",
    header: "Full Name",
    render: (item: User) => (
      <div className="flex items-center gap-2 sm:gap-3">
        <Image
          src={item.image}
          alt={item.fullname}
          width={32}
          height={32}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex-shrink-0"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-montserrat font-normal text-[#2b2b2b] truncate">
            {item.fullname}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-montserrat font-normal text-[#808080] truncate">
            {item.email}
          </span>
        </div>
      </div>
    ),
    minWidth: "min-w-[160px] sm:min-w-[180px] md:min-w-[200px]",
  },
  {
    key: "location",
    header: "Location",
    minWidth: "min-w-[90px] sm:min-w-[110px] md:min-w-[120px]",
  },
  {
    key: "profession",
    header: "Profession",
    minWidth: "min-w-[85px] sm:min-w-[95px] md:min-w-[100px]",
  },
  {
    key: "mobile",
    header: "Mobile",
    minWidth: "min-w-[85px] sm:min-w-[95px] md:min-w-[100px]",
  },
  {
    key: "status",
    header: "Status",
    minWidth: "min-w-[80px] sm:min-w-[90px] md:min-w-[100px]",
  },
  {
    key: "date",
    header: "Date",
    minWidth: "min-w-[80px] sm:min-w-[90px] md:min-w-[100px]",
  },
];
export const BuyerType = () => {
  const [admins, setAdmins] = useState<User[]>(
    initialUsers.map((admin) => ({ ...admin, checked: false }))
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<statusTypes>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);
  const [isStateOpen, setIsStateOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Generate years from 2019 to 2025
  const years = Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i);

  // Filter admins based on year, month, and search term
  const filteredAdmin = useMemo(() => {
    return admins.filter((admin) => {
      const matchesProfession = admin.profession === "Buyer";
      const matchesYear = selectedYear
        ? admin.date.includes(selectedYear)
        : true;
      const matchesMonth = selectedMonth
        ? admin.date.startsWith(
            `${months.indexOf(selectedMonth) + 1 < 10 ? "0" : ""}${
              months.indexOf(selectedMonth) + 1
            }`
          )
        : true;
      const matchesState = selectedState
        ? admin.location.toLowerCase() === selectedState.toLowerCase()
        : true;
      const matchesStatus =
        selectedStatus === "All"
          ? true
          : admin.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchesSearch = searchTerm
        ? admin.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.userID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return (
        matchesProfession &&
        matchesYear &&
        matchesMonth &&
        matchesSearch &&
        matchesState &&
        matchesStatus
      );
    });
  }, [
    admins,
    selectedYear,
    selectedMonth,
    selectedState,
    searchTerm,
    selectedStatus,
  ]);

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
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStateOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
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
        setIsStateOpen(false);
        setIsStatusOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle view profile (edit)
  const handleViewProfile = (id: string) => {
    alert(`View profile for user with ID: ${id}`);
    // TODO: Implement view profile functionality
  };

  // Handle suspend user (delete)
  const handleSuspended = (id: string) => {
    setAdmins(admins.filter((admin) => admin.userID !== id));
  };

  // Handle toggle status
  const handleToggleStatus = (id: string) => {
    setAdmins(
      admins.map((admin) =>
        admin.userID === id
          ? {
              ...admin,
              status: admin.status === "Active" ? "Suspended" : "Active",
            }
          : admin
      )
    );
  };

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    setAdmins(
      admins.map((admin) =>
        admin.userID === id ? { ...admin, checked: !admin.checked } : admin
      )
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    setAdmins(admins.map((admin) => ({ ...admin, checked: newAllChecked })));
  };

  // Dropdown animation variants
  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };
  return (
    <div className="w-full mx-auto">
      <div className="w-full bg-[#FAF7F7] mt-4 py-4 px-3 sm:px-4 md:px-6">
        {/* Improved Responsive Layout */}
        <div className="ccecc-flex-style gap-4 w-full max-w-full">
          {/* Search Input - Always full width on mobile, constrained on larger screens */}
          <div className="w-full max-w-full sm:max-w-[280px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#538e53] focus:border-transparent placeholder:text-[#808080] placeholder:text-xs sm:placeholder:text-sm placeholder:font-montserrat placeholder:font-medium"
                aria-label="Search all users"
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">
                Search for users by name, userID, or email
              </span>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <SearchIcon stroke="#808080" className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Filter Controls - Responsive Grid Layout */}
          <div className="w-full grid grid-cols-style sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {/* Year and Month Combined Container - Takes 2 columns on larger screens */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="flex gap-0 w-full">
                {/* Year Dropdown */}
                <div className="relative flex-1" ref={yearDropdownRef}>
                  <button
                    onClick={() => setIsYearOpen(!isYearOpen)}
                    className="w-full px-2 pl-7 pr-7 py-2.5 border-[1px] border-[#808080] rounded-l-md border-r-0 text-xs sm:text-sm text-left focus:outline-none focus:ring-[1px] focus:ring-[#538e53] focus:z-10 relative hover:bg-gray-50 transition-colors"
                    role="combobox"
                    aria-expanded={isYearOpen}
                    aria-controls="year-dropdown"
                    aria-label={
                      selectedYear
                        ? `Selected year: ${selectedYear}`
                        : "Select year"
                    }
                  >
                    <span className="truncate">{selectedYear || "Year"}</span>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {isYearOpen ? (
                        <ArrowUpIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                      <CalenderIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isYearOpen && (
                      <motion.div
                        id="year-dropdown"
                        className="absolute z-20 mt-1 w-full border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                        role="listbox"
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div
                          onClick={() => {
                            setSelectedYear("");
                            setIsYearOpen(false);
                          }}
                          className={`px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 ${
                            selectedYear === "" ? "bg-gray-100 font-medium" : ""
                          }`}
                          role="option"
                          aria-selected={selectedYear === ""}
                        >
                          Years
                        </div>
                        {years.map((year) => (
                          <div
                            key={year}
                            onClick={() => {
                              setSelectedYear(year.toString());
                              setIsYearOpen(false);
                            }}
                            className={`px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 ${
                              selectedYear === year.toString()
                                ? "bg-gray-100 font-medium"
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
                    className="w-full px-2 pr-7 py-2.5 border-[1px] border-[#808080] rounded-r-md text-xs sm:text-sm text-left focus:outline-none focus:ring-[1px] focus:ring-[#538e53] focus:z-10 relative hover:bg-gray-50 transition-colors"
                    role="combobox"
                    aria-expanded={isMonthOpen}
                    aria-controls="month-dropdown"
                    aria-label={
                      selectedMonth
                        ? `Selected month: ${selectedMonth}`
                        : "Select month"
                    }
                  >
                    <span className="truncate">{selectedMonth || "Month"}</span>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {isMonthOpen ? (
                        <ArrowUpIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isMonthOpen && (
                      <motion.div
                        id="month-dropdown"
                        className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                        role="listbox"
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div
                          onClick={() => {
                            setSelectedMonth("");
                            setIsMonthOpen(false);
                          }}
                          className={`px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 ${
                            selectedMonth === ""
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                          role="option"
                          aria-selected={selectedMonth === ""}
                        >
                          Months
                        </div>
                        {months.map((month) => (
                          <div
                            key={month}
                            onClick={() => {
                              setSelectedMonth(month);
                              setIsMonthOpen(false);
                            }}
                            className={`px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 ${
                              selectedMonth === month
                                ? "bg-gray-100 font-medium"
                                : ""
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

            {/* State Dropdown */}
            <div
              className="relative flex-shrink-0 md:min-w-[100px]"
              ref={stateDropdownRef}
            >
              <button
                onClick={() => setIsStateOpen(!isStateOpen)}
                className="w-full px-2 pr-7 py-2.5 border-[1px] border-[#808080] rounded-md text-xs sm:text-sm font-montserrat text-left focus:outline-none focus:ring-[1px] focus:ring-[#538e53] hover:bg-gray-50 transition-colors"
                role="combobox"
                aria-expanded={isStateOpen}
                aria-controls="state-dropdown"
                aria-label={
                  selectedState
                    ? `Selected state: ${selectedState}`
                    : "Select state"
                }
              >
                <span className="truncate">
                  {selectedState || "All States"}
                </span>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isStateOpen ? (
                    <ArrowUpIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {isStateOpen && (
                  <motion.div
                    id="state-dropdown"
                    className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                    role="listbox"
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <div
                      onClick={() => {
                        setSelectedState("");
                        setIsStateOpen(false);
                      }}
                      className={`px-3 py-2 text-xs sm:text-sm cursor-pointer font-montserrat hover:bg-gray-100 ${
                        selectedState === "" ? "bg-gray-100 font-medium" : ""
                      }`}
                      role="option"
                      aria-selected={selectedState === ""}
                    >
                      All States
                    </div>
                    {nigeriaStates.map((state) => (
                      <div
                        key={state}
                        onClick={() => {
                          setSelectedState(state);
                          setIsStateOpen(false);
                        }}
                        className={`px-3 py-2 text-xs sm:text-sm cursor-pointer font-montserrat hover:bg-gray-100 ${
                          selectedState === state
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        role="option"
                        aria-selected={selectedState === state}
                      >
                        {state}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status Dropdown */}
            <div
              className="relative flex-shrink-0 md:min-w-[100px]"
              ref={statusDropdownRef}
            >
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="w-full px-2 pr-7 py-2.5 border-[1px] border-[#808080] rounded-md text-xs sm:text-sm font-montserrat text-left focus:outline-none focus:ring-[1px] focus:ring-[#538e53] hover:bg-gray-50 transition-colors"
                role="combobox"
                aria-expanded={isStatusOpen}
                aria-controls="status-dropdown"
                aria-label={
                  selectedStatus
                    ? `Selected status: ${selectedStatus}`
                    : "Select status"
                }
              >
                <span className="truncate">{selectedStatus}</span>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isStatusOpen ? (
                    <ArrowUpIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {isStatusOpen && (
                  <motion.div
                    id="status-dropdown"
                    className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                    role="listbox"
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {statusTypes.map((status) => (
                      <div
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status as statusTypes);
                          setIsStatusOpen(false);
                        }}
                        className={`px-3 py-2 text-xs sm:text-sm cursor-pointer font-montserrat hover:bg-gray-100 ${
                          selectedStatus === status
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        role="option"
                        aria-selected={selectedStatus === status}
                      >
                        {status}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 w-full">
        <AdminTable<User>
          dataType="initialUsers"
          columns={columns}
          initialData={filteredAdmin}
          ActionMenuComponent={UserActionMenu}
          handleViewProfile={handleViewProfile}
          handleSuspended={handleSuspended}
          handleToggleStatus={handleToggleStatus}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          allChecked={allChecked}
        />
      </div>
    </div>
  );
};
