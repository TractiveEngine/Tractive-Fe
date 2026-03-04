"use client";
import React from "react";
import TruckCard from "@/components/cards/TruckCard";
import { useGetTransporterTrucks } from "@/hooks/queries/useTransporterQueries";
import { Loader2 } from "lucide-react";

interface EmptyTruckProps {
  transporterId: string;
  fromState?: string;
  toState?: string;
  sortOption?: string;
}

export const EmptyTruck = ({
  transporterId,
  fromState = "",
  toState = "",
  sortOption = "All",
}: EmptyTruckProps) => {
  const { data: trucksData, isLoading, isError } = useGetTransporterTrucks({
    status: "empty",
    fromState,
    toState,
  });
  const rawTrucks = Array.isArray(trucksData) ? trucksData : trucksData?.trucks || [];

  const formattedTrucks = rawTrucks.map((truck: any, index: number) => ({
    id: truck._id || truck.id || `truck-${index}`,
    image: (truck.images && truck.images.length > 0) ? truck.images[0] : truck.image || "/images/EmptyTruck.png",
    truckName: truck.fleetName || truck.model || truck.truckName || truck.name || "Unknown Truck",
    rating: truck.rating || 0,
    amountPerKg: truck.price ? `₦${truck.price.toLocaleString()}` : truck.pricePerKg || truck.amountPerKg || "₦0",
    fullLoad: truck.capacity || truck.size || truck.fullLoad || "Unknown Capacity",
    locationFrom: truck.route?.fromState || truck.locationFrom || truck.origin || "Unknown",
    locationTo: truck.route?.toState || truck.locationTo || truck.destination || "Unknown",
    spaceRemaining: truck.spaceRemaining || truck.availableSpace || "0kg",
  }));

  const filteredTruckData = formattedTrucks.filter((truck: any) => {
    // Sort option filtering if needed on client side
    let matchesSort = true;
    if (sortOption === "Almost Full") {
      matchesSort = false;
    } else if (sortOption === "Empty") {
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
        <p className="text-[#808080] font-montserrat text-[14px]">Failed to load empty trucks.</p>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        Empty Truck
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTruckData.length > 0 ? (
          filteredTruckData.map((card: any) => (
            <TruckCard
              isEmptyTruck={true}
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
             <p className="text-[#808080] font-montserrat text-[14px]">No empty trucks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyTruck;
