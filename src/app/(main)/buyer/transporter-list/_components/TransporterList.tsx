import React, { useState } from "react";
import { TransporterCard } from "./TransporterCard";
import { useGetTransporters } from "@/hooks/queries/useTransporterQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";
import { GetTransportersParams } from "@/services/transporterService";

interface SellerListProps {
  apiParams: GetTransportersParams;
  selectedRatings: number[];
  selectedLocations: string[];
  selectedYears: string[];
}

export const TransporterList: React.FC<SellerListProps> = ({
  apiParams,
  selectedRatings,
  selectedLocations,
  selectedYears,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const queryParams: GetTransportersParams = {
    ...apiParams,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };

  const { data: transportersData, isLoading, isError } = useGetTransporters(queryParams);
  const rawTransporters = transportersData || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transporters = rawTransporters.map((transporter: any, index: number) => ({
    id: transporter._id || transporter.id || `transporter-${index}`,
    image: transporter.image || transporter.profilePicture || "/images/GoLogistics.png",
    transporterName: transporter.businessName || transporter.name || transporter.transporterName || "Unknown Transporter",
    rating: transporter.rating || 0,
    rateStatus: transporter.rateStatus || (transporter.rating >= 4 ? "Excellent" : transporter.rating >= 3 ? "Good" : "Fair"),
    transporterYear: transporter.transporterYear || transporter.yearsOfExperience || "1",
    customerNumber: transporter.customerNumber || transporter.matchingFleetCount || transporter.fleetsCount || 0,
    transporterBio: transporter.transporterBio || transporter.bio || "Connecting you to the best logistics.",
    locationFrom: transporter.locationFrom || transporter.location || transporter.state || transporter.city || "Various",
    locationTo: transporter.locationTo || "Locations",
  }));

  // Client-side filtering for multi-select cases the API can't handle
  const filteredTransporters = transporters.filter((transporter) => {
    // Only apply client-side rating filter when multiple ratings selected
    const matchesRating =
      selectedRatings.length <= 1 || selectedRatings.includes(transporter.rating);
    // Only apply client-side location filter when multiple locations selected
    const matchesLocation =
      selectedLocations.length <= 1 ||
      selectedLocations.includes(transporter.locationFrom);
    const yearsNum = parseInt(transporter.transporterYear);
    const yearBucket = yearsNum < 1 ? "Less than a year" : yearsNum <= 5 ? "1-5 Years" : "6-10 Years";
    const matchesYears =
      selectedYears.length <= 1 ||
      selectedYears.includes(yearBucket);
    return matchesRating && matchesLocation && matchesYears;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full lg:w-[95%] h-[300px] bg-[#fefefe] rounded-[7px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <Loader2 className="animate-spin text-[#2b2b2b] w-8 h-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center w-full lg:w-[95%] h-[300px] bg-[#fefefe] rounded-[7px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <p className="text-[#808080] font-montserrat font-medium text-[16px]">
          Failed to load transporters. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full lg:w-[95%] gap-4 bg-[#fefefe] h-auto rounded-[7px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col justify-center gap-4 w-full px-4 pt-6 bg-[#fefefe]">
        <input
          type="text"
          placeholder="Search for transporters"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-none sm:max-w-[400px] p-2 border border-[#808080] rounded-md text-[#2b2b2b] placeholder-[#808080] focus:outline-none focus:ring-[1px] focus:ring-[#538e53] focus:border-transparent text-[12px] sm:text-[14px]"
        />
        <p className="mt-2 text-[14px] sm:text-[17px] font-normal font-montserrat text-[#808080]">
          Connect with Sellers
        </p>
      </div>
      <div className="TransportList_Card">
        {filteredTransporters.length > 0 ? (
          filteredTransporters.map((transporter) => (
            <TransporterCard
              key={transporter.id}
              id={transporter.id}
              image={transporter.image}
              transporterName={transporter.transporterName}
              rating={transporter.rating}
              rateStatus={transporter.rateStatus}
              transporterYear={transporter.transporterYear}
              customerNumber={transporter.customerNumber}
              transporterBio={transporter.transporterBio}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-[200px]">
            <p className="text-[#808080] font-montserrat font-medium text-[16px]">
              No transporters found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
