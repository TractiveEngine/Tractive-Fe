"use client";
import React from "react";
import { TruckData } from "@/utils/TruckData";
import TruckCard from "@/components/cards/TruckCard";

interface EmptyTruckProps {
  fromState?: string;
  toState?: string;
  sortOption?: string;
}

export const EmptyTruck = ({
  fromState = "",
  toState = "",
  sortOption = "All",
}: EmptyTruckProps) => {
  const filteredTruckData = TruckData.filter((truck) => {
    // Route filtering
    const matchesFrom = fromState ? truck.locationFrom === fromState : true;
    const matchesTo = toState ? truck.locationTo === toState : true;

    // Sort option filtering
    const fullLoadNum = parseFloat(truck.fullLoad.replace("$", ""));
    const spaceRemainingNum = parseFloat(
      truck.spaceRemaining.replace("kg", "")
    );
    let matchesSort = true;

    if (sortOption === "Empty") {
      matchesSort = spaceRemainingNum >= fullLoadNum;
    } else if (sortOption === "Almost Full") {
      matchesSort = spaceRemainingNum > 0 && spaceRemainingNum < fullLoadNum;
    }

    return matchesFrom && matchesTo && matchesSort;
  });

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        Empty Truck
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTruckData.map((card) => (
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
        ))}
      </div>
    </div>
  );
};

export default EmptyTruck;
