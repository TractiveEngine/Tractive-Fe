"use client"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/utils/loginAuth";
import React, { useEffect, useState } from "react";

import { SellerList } from "./_components/SellerList";
import { FilterSeller } from "./_components/FilterSeller";
import { FilterSellerMobile } from "./_components/FilterSellerMobile";


export default function SellerPage() {
  const router = useRouter();
  
  useEffect(() => {
    if (!isUserLoggedIn()) {
      toast.error("Login to view the Sellers List.", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }, [router]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  return (
    <div className="w-full bg-[#f1f1f1] min-h-screen">
      <div className="w-full sm:w-[90%] flex flex-col gap-[1.5rem] sm:flex-row sm:gap-4 lg:gap-8 mx-auto px-4 sm:px-0">
        <FilterSeller
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
        />
        <FilterSellerMobile
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
