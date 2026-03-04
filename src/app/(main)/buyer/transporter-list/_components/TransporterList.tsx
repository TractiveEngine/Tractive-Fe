import React from "react";
import { TransporterCard } from "./TransporterCard";
import { useGetTransporters } from "@/hooks/queries/useTransporterQueries";
import { Loader2 } from "lucide-react";
interface SellerListProps {
  selectedRatings: number[];
  selectedLocations: string[];
  selectedYears: string[];
}

export const TransporterList: React.FC<SellerListProps> = ({
  selectedRatings,
  selectedLocations,
  selectedYears,
}) => {
  const { data: transportersData, isLoading, isError } = useGetTransporters();
  const rawTransporters = transportersData || [];

  const apiTransporters = rawTransporters.map((transporter: any, index: number) => ({
    id: transporter._id || transporter.id || `transporter-${index}`,
    image: transporter.image || transporter.profilePicture || "/images/GoLogistics.png",
    transporterName: transporter.businessName || transporter.name || transporter.transporterName || "Unknown Transporter",
    rating: transporter.rating || 0,
    rateStatus: transporter.rateStatus || (transporter.rating >= 4 ? "Excellent" : transporter.rating >= 3 ? "Good" : "Fair"),
    transporterYear: transporter.transporterYear || transporter.yearsOfExperience || "1",
    customerNumber: transporter.customerNumber || transporter.fleetsCount || 0,
    transporterBio: transporter.transporterBio || transporter.bio || "Connecting you to the best logistics.",
    locationFrom: transporter.locationFrom || transporter.state || transporter.city || "Various",
    locationTo: transporter.locationTo || "Locations",
  }));
  
  const transporters = [
    ...apiTransporters,
    {
      id: "TransporterTGO1",
      image: "/images/GoLogistics.png",
      transporterName: "GO Logistics (Dummy)",
      rating: 4.0,
      rateStatus: "Excellent",
      transporterYear: "10",
      customerNumber: 300,
      transporterBio: "Given you the best ride ever than you can imagine.",
      locationFrom: "kano",
      locationTo: "Delta",
    }
  ];

  const filteredTransporters = transporters.filter((transporter) => {
    const matchesRating =
      selectedRatings.length === 0 || selectedRatings.includes(transporter.rating);
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(transporter.locationFrom);
    const matchesYears =
      selectedYears.length === 0 ||
      selectedYears.includes(
        parseInt(transporter.transporterYear) <= 5 ? "1-5 Years" : "6-10 Years"
      );
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
