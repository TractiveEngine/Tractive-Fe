"use client";
import TruckCard from "@/components/cards/TruckCard";
import React from "react";
import { useGetTransporterTrucks } from "@/hooks/queries/useTransporterQueries";
import { Loader2 } from "lucide-react";

interface AlmostFullTruckProps {
  transporterId: string;
  fromState?: string;
  toState?: string;
  sortOption?: string;
}

export const AlmostFullTruck = ({
  transporterId,
  fromState = "",
  toState = "",
  sortOption = "All",
}: AlmostFullTruckProps) => {
  const { data: trucksData, isLoading, isError } = useGetTransporterTrucks({
    status: "almost_full",
    fromState,
    toState,
  });
  const rawTrucks = Array.isArray(trucksData) ? trucksData : trucksData?.trucks || [];

  // Assuming the API filters by 'almost_full' status, we might just need client-side formatting 
  // and possibly some residual filtering based on sortOption if the backend doesn't handle fullLoad sort semantics
  const formattedTrucks = rawTrucks.map((truck: any, index: number) => ({
    id: truck._id || truck.id || `truck-${index}`,
    image: (truck.images && truck.images.length > 0) ? truck.images[0] : truck.image || "/images/AlmostFull.png",
    truckName: truck.fleetName || truck.model || truck.truckName || truck.name || "Unknown Truck",
    rating: truck.rating || 0, // Truck ratings might not be in response, defaulting to 0
    amountPerKg: truck.price ? `₦${truck.price.toLocaleString()}` : truck.pricePerKg || truck.amountPerKg || "₦0",
    fullLoad: truck.capacity || truck.size || truck.fullLoad || "Unknown Capacity",
    locationFrom: truck.route?.fromState || truck.locationFrom || truck.origin || "Unknown",
    locationTo: truck.route?.toState || truck.locationTo || truck.destination || "Unknown",
    spaceRemaining: truck.spaceRemaining || truck.availableSpace || "0kg",
  }));

  const filteredTruckData = formattedTrucks.filter((truck: any) => {
    // Sort option filtering if needed on client side
    let matchesSort = true;
    if (sortOption === "Empty") {
      // should primarily not show up in AlmostFull but just in case
      matchesSort = false;
    } else if (sortOption === "Almost Full") {
      matchesSort = true;
    }

    return matchesSort;
  });

  if (isLoading) {
    return (
      <div className="w-[90%] mx-auto py-6 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#2b2b2b] w-6 h-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[90%] mx-auto py-6 flex flex-col justify-center items-center">
        <p className="text-[#808080] font-montserrat text-[14px]">Failed to load almost full trucks.</p>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        Almost Full
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTruckData.length > 0 ? (
          filteredTruckData.map((card: any) => (
            <TruckCard
              isEmptyTruck={false}
              key={card.id}
              id={card.id}
              image={card.image}
              truckName={card.truckName}
              rating={card.rating}
              amountPerKg={card.amountPerKg}
              fullLoad={card.fullLoad}
              locationFrom={card.locationFrom}
              locationTo={card.locationTo}
              spaceRemaining={card.spaceRemaining}
            />
          ))
        ) : (
          <div className="col-span-full py-10 flex justify-center">
             <p className="text-[#808080] font-montserrat text-[14px]">No almost full trucks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlmostFullTruck;
