"use client"
import React, { useState } from "react";
import { FilterSeller } from "./_components/FilterSeller";
import { SellerList } from "./_components/SellerList";


export default function SellerPage() {
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  return (
    <div className="w-full bg-[#f1f1f1] min-h-screen">
      <div className="w-full sm:w-[90%] flex flex-col sm:flex-row sm:gap-4 lg:gap-8 mx-auto px-4 sm:px-0">
        <FilterSeller
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
        />
        <SellerList
          selectedRatings={selectedRatings}
          selectedLocations={selectedLocations}
          selectedYears={selectedYears}
        />
      </div>
    </div>
  );
}
