"use client";
import TruckCard from "@/components/cards/TruckCard";
import React from "react";

interface AlmostFullTruckProps {
  fromState?: string;
  toState?: string;
  sortOption?: string;
}

export const TruckData = [
  {
    id: "BookingCode0021234110",
    image: "/images/transportTruck.png",
    rating: "4.0",
    truckName: "Monster Truck",
    amountPerKg: "$40",
    fullLoad: "$100",
    spaceRemaining: "100 kg",
    locationFrom: "Lagos",
    locationTo: "Abuja",
  },
  {
    id: "BookingCode0021234120",
    image: "/images/transportTruck.png",
    rating: "4.5",
    truckName: "Heavy Duty Hauler",
    amountPerKg: "$50",
    fullLoad: "$150",
    spaceRemaining: "0 kg",
    locationFrom: "Kano",
    locationTo: "Ibadan",
  },
  {
    id: "BookingCode0021234129",
    image: "/images/transportTruck.png",
    rating: "4.2",
    truckName: "Freight Master",
    amountPerKg: "$45",
    fullLoad: "$120",
    spaceRemaining: "120kg",
    locationFrom: "Jos",
    locationTo: "Enugu",
  },
  {
    id: "BookingCode0021234130",
    image: "/images/transportTruck.png",
    rating: "4.8",
    truckName: "Cargo King",
    amountPerKg: "$60",
    fullLoad: "$200",
    spaceRemaining: "500 kg",
    locationFrom: "Owerri",
    locationTo: "Kano",
  },
];


export const SimilarFleet = ({
  fromState = "",
  toState = "",
  sortOption = "All",
}: AlmostFullTruckProps) => {
  const filteredTruckData = TruckData.filter((truck) => {
    // Route filtering
    const matchesFrom = fromState ? truck.locationFrom === fromState : true;
    const matchesTo = toState ? truck.locationTo === toState : true;

    // Sort option filtering
    const fullLoadNum = parseFloat(truck.fullLoad);
    const spaceRemainingNum = parseFloat(truck.spaceRemaining);
    let matchesSort = true;

    if (sortOption === "Empty") {
      matchesSort = spaceRemainingNum === fullLoadNum;
    } else if (sortOption === "Almost Full") {
      matchesSort = spaceRemainingNum > 0 && spaceRemainingNum < fullLoadNum;
    }

    return matchesFrom && matchesTo && matchesSort;
  });

  return (
    <div className="py-1">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        Similar Fleet
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTruckData.map((card) => (
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
        ))}
      </div>
    </div>
  );
};