"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@/icons/Icons";
import { AddToStoreIcon, CalenderIcon } from "@/icons/DashboardIcons";
import { TableList } from "../_components/table/TableList";
import { FarmerActionMenu } from "./_components/FarmerActionMenu";
import { OnboardingFarmers } from "./_components/OnboardingFarmer";
import { ApiFarmer, Farmer, farmerService } from "@/services/FarmerService";
import { UserProfile } from "@/services/UserService";

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

// Roles that can manage farmers
const FARMER_MANAGEMENT_ROLES = ["admin", "supervisor", "agent", "field-agent"];

const FarmersListPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
  const [farmersData, setFarmersData] = useState<Farmer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

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

  // Check if user can manage farmers
  const canManageFarmers = currentUser
    ? FARMER_MANAGEMENT_ROLES.includes(currentUser.activeRole)
    : false;

  // Fetch current user profile
  const fetchCurrentUser = useCallback(async () => {
    try {
      setUserLoading(true);
      console.log("🔄 Fetching current user profile...");
      const user = await farmerService.getCurrentUser();
      setCurrentUser(user);
      console.log("✅ Current user:", user);
      console.log(
        "✅ Can manage farmers:",
        FARMER_MANAGEMENT_ROLES.includes(user.activeRole)
      );
    } catch (err) {
      console.error("❌ Error fetching user profile:", err);
      // Don't set error for user fetch - we can still show farmers in read-only mode
      console.log("⚠️ Continuing in read-only mode");
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Fetch farmers from API
  const fetchFarmers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching farmers from backend...");
      const response = await farmerService.getFarmers();
      console.log("✅ Received farmers:", response);

      // Convert API farmers to frontend format
      const farmersWithUIState = response.farmers.map((farmer: ApiFarmer) => ({
        id: farmer._id,
        name: farmer.name || "-",
        mobile: farmer.phone || "-",
        altMobile: "-",
        localMarket: farmer.villageOrLocalMarket || "-",
        image: "/images/farmer_modal_profile.png",
        state: farmer.state || "-",
        address: farmer.address || "-",
        ninOrCac: farmer.nin || farmer.businessCAC || "-",
        bankName: "-",
        accountNumber: "-",
        accountName: "-",
        revenue: "₦0",
        orders: "0",
        date: farmer.createdAt
          ? new Date(farmer.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
        checked: false,
      })) as Farmer[];

      setFarmersData(farmersWithUIState);
      console.log(`✅ Set ${farmersWithUIState.length} farmers to state`);
    } catch (err) {
      console.error("❌ Error fetching farmers:", err);
      // Check if it's a permission error vs network error
      if (err.message && err.message.includes("permission")) {
        setError("You don't have permission to view farmers");
      } else {
        setError(err.message || "Failed to fetch farmers");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load - fetch user first, then farmers
  useEffect(() => {
    const initializeData = async () => {
      console.log("🚀 Component mounted - initializing data...");
      await fetchCurrentUser();
      await fetchFarmers();
    };

    initializeData();
  }, [fetchCurrentUser, fetchFarmers]);

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
        setIsOnboardModalOpen(false);
        setIsEditModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      if (!canManageFarmers) {
        setError("You don't have permission to edit farmers");
        return;
      }

      console.log(`✏️ Editing farmer with ID: ${id}`);
      const farmer = farmersData.find((f) => f.id === id);
      if (farmer) {
        setEditFarmer(farmer);
        setIsEditModalOpen(true);
      } else {
        console.error(`❌ Farmer with ID ${id} not found in local state`);
      }
    },
    [farmersData, canManageFarmers]
  );

  // Handle farmer onboarding
  const handleOnboardSubmit = async (
    formData: Omit<Farmer, "id" | "revenue" | "orders" | "date" | "checked">
  ) => {
    if (!canManageFarmers) {
      setError("You don't have permission to create farmers");
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      console.log("📝 Onboarding farmer with data:", formData);
      await farmerService.createFarmer(formData);
      console.log("✅ Farmer created successfully");

      setIsOnboardModalOpen(false);
      await fetchFarmers();
    } catch (err) {
      console.error("❌ Error creating farmer:", err);
      setError(err.message || "Failed to create farmer");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle farmer edit
  const handleEditSubmit = async (
    formData: Omit<Farmer, "id" | "revenue" | "orders" | "date" | "checked">
  ) => {
    if (!editFarmer || !canManageFarmers) {
      setError("You don't have permission to edit farmers");
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      console.log("📝 Updating farmer with data:", formData);

      // Note: If your API doesn't support PATCH/PUT, you may need to handle this differently
      // For now, we'll just close the modal and refetch
      // await farmerService.updateFarmer(editFarmer.id, formData);

      console.log("✅ Farmer update requested");
      setIsEditModalOpen(false);
      setEditFarmer(null);

      // Refetch to get updated data
      await fetchFarmers();
    } catch (err) {
      console.error("❌ Error updating farmer:", err);
      setError(err.message || "Failed to update farmer");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Client-side filtering
  const filteredFarmers = farmersData.filter((farmer) => {
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
        (months.indexOf(selectedMonth) + 1).toString().padStart(2, "0")
      );

    return matchesSearch && matchesYear && matchesMonth;
  });

  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  // Loading state
  if ((loading && farmersData.length === 0) || userLoading) {
    return (
      <div className="w-full">
        <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
          <h2 className="text-[17px] font-montserrat text-[#2b2b2b] px-6 pt-6 mb-4">
            Farmers
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#538e53]"></div>
            <span className="ml-3 text-gray-600">Loading user data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
        <h2 className="text-[17px] font-montserrat text-[#2b2b2b] px-6 pt-6 mb-4">
          Farmers{" "}
          {(loading || submitLoading) && (
            <span className="text-sm text-gray-500">(Loading...)</span>
          )}
          {farmersData.length > 0 && (
            <span className="text-sm text-gray-600 ml-2">
              ({farmersData.length} total)
            </span>
          )}
          {currentUser && (
            <span className="text-xs text-gray-500 ml-2">
              (Role: {currentUser.activeRole})
            </span>
          )}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm font-semibold mb-1">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchFarmers();
              }}
              className="mt-2 text-sm text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Authentication Warning */}
        {!farmerService.isAuthenticated() && (
          <div className="mx-6 mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm font-semibold mb-1">
              Authentication Required
            </p>
            <p className="text-yellow-700 text-sm">
              Please log in to manage farmers. Token status:{" "}
              {farmerService.getToken() ? "Found" : "Missing"}
            </p>
          </div>
        )}

        {/* Permission Info */}
        {currentUser && !canManageFarmers && (
          <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 text-sm font-semibold mb-1">
              View Only Mode
            </p>
            <p className="text-blue-700 text-sm">
              Your role ({currentUser.activeRole}) has read-only access to
              farmers.
              {currentUser.activeRole === "agent" &&
                " You can view farmers but cannot create or edit them."}
            </p>
          </div>
        )}

        <OnboardingFarmers
          isOpen={isOnboardModalOpen}
          onClose={() => {
            setIsOnboardModalOpen(false);
            setError(null);
          }}
          onSubmit={handleOnboardSubmit}
        />

        <OnboardingFarmers
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditFarmer(null);
            setError(null);
          }}
          onSubmit={handleEditSubmit}
          editFarmer={editFarmer}
        />

        <div className="w-full h-[1px] bg-[#e2e2e2]"></div>

        <div className="w-full bg-[#FAF7F7] mt-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-[100%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
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
                        className="absolute z-[100] mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
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
                        className="absolute z-[100] mt-1 w-full sm:w-[100px] bg-white border border-gray-300 rounded-[4px] shadow-md max-h-30 overflow-y-auto"
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

            <div className="flex items-center gap-4 justify-end">
              <button
                onClick={() => setIsOnboardModalOpen(true)}
                disabled={
                  !farmerService.isAuthenticated() ||
                  !canManageFarmers ||
                  submitLoading
                }
                className="cursor-pointer flex items-center gap-[7px] px-4 sm:px-6 py-2 opacity-[0.92] bg-[#538e53] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors hover:bg-[#467a46] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Onboard farmer"
                title={
                  !canManageFarmers
                    ? `Your role (${currentUser?.activeRole}) cannot onboard farmers`
                    : "Onboard new farmer"
                }
              >
                <AddToStoreIcon stroke="#fefefe" />
                Onboard
              </button>
            </div>
          </div>
        </div>

        <div className="my-6 overflow-x-auto">
          {filteredFarmers.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Image
                src="/images/noData.png"
                alt="No Data"
                width={106}
                height={60}
              />
              <p className="text-[13px] font-montserrat mb-2">
                No farmers found
              </p>
              <p className="text-[11px] font-montserrat">
                {searchQuery || selectedYear || selectedMonth
                  ? "Try adjusting your filters"
                  : farmerService.isAuthenticated()
                  ? canManageFarmers
                    ? "Start by onboarding your first farmer"
                    : "No farmers available for your role"
                  : "Please login to view farmers"}
              </p>
            </div>
          ) : (
            <TableList<Farmer>
              dataType="farmers"
              columns={farmerColumns}
              initialData={filteredFarmers}
              ActionMenuComponent={FarmerActionMenu}
              handleEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmersListPage;
