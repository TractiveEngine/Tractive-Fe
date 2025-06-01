"use client"
import React, { useEffect, useState } from "react";
import { FilterTransporter } from "./_components/FilterTransporter";
import {  TransporterList } from "./_components/TransporterList";
import { isUserLoggedIn } from "@/utils/loginAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function TransportersListPage() {
  const router = useRouter();
  
  useEffect(() => {
    if (!isUserLoggedIn()) {
      toast.error("Login to Book a transporter.", {
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
      <div className="w-full sm:w-[90%] flex flex-col sm:flex-row sm:gap-4 lg:gap-8 mx-auto px-4 sm:px-0">
        <FilterTransporter
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
        />
        <TransporterList
          selectedRatings={selectedRatings}
          selectedLocations={selectedLocations}
          selectedYears={selectedYears}
        />
      </div>
    </div>
  );
}
