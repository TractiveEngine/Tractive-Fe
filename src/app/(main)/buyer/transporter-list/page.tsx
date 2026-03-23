"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FilterTransporter } from "./_components/FilterTransporter";
import { TransporterList } from "./_components/TransporterList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FilterTransporterMobile } from "./_components/FilterTransporterMobile";
import { GetTransportersParams } from "@/services/transporterService";

export default function TransportersListPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Login to Book a transporter.", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }, [status, router]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  // Build API query params from the filter selections
  const apiParams = useMemo<GetTransportersParams>(() => {
    const params: GetTransportersParams = {};

    // API accepts a single minimum rating value
    if (selectedRatings.length > 0) {
      params.rating = Math.min(...selectedRatings);
    }

    // API accepts a single location (state)
    if (selectedLocations.length === 1) {
      params.location = selectedLocations[0];
    }

    // API accepts minimum yearsOfExperience as integer
    if (selectedYears.length === 1) {
      if (selectedYears.includes("Less than a year")) {
        params.yearsOfExperience = 0;
      } else if (selectedYears.includes("1-5 Years")) {
        params.yearsOfExperience = 1;
      } else if (selectedYears.includes("6-10 Years")) {
        params.yearsOfExperience = 6;
      }
    }

    return params;
  }, [selectedRatings, selectedLocations, selectedYears]);

  return (
    <div className="w-full bg-[#f1f1f1] min-h-screen">
      <div className="w-full sm:w-[90%] flex flex-col gap-[1.5rem] sm:flex-row sm:gap-4 lg:gap-8 mx-auto py-6 px-4 sm:px-0">
        <FilterTransporter
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
        />
        <FilterTransporterMobile
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
        />

        <TransporterList
          apiParams={apiParams}
          selectedRatings={selectedRatings}
          selectedLocations={selectedLocations}
          selectedYears={selectedYears}
        />
      </div>
    </div>
  );
}
