"use client";
import React, { useState } from "react";
import { TransporterHeader } from "../_components/TransporterProfile/TransporterHeader";
import { FilterTransporter } from "../_components/TransporterProfile/FilterTransporter";
import { TransporterRecommendation } from "../_components/TransporterProfile/TransporterRecommendation";
import { AlmostFullTruck } from "../_components/TransporterProfile/AlmostFullTruck";
import { EmptyTruck } from "../_components/TransporterProfile/EmptyTruck";

import { useParams } from "next/navigation";

export default function TransportersID() {
  const params = useParams();
  const id = params?.id as string;
  const [fromState, setFromState] = useState<string>("");
  const [toState, setToState] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("All");

  return (
    <div className="w-full bg-[#f1f1f1]">
      <TransporterHeader transporterId={id} />
      <FilterTransporter
        fromState={fromState}
        toState={toState}
        sortOption={sortOption}
        setFromState={setFromState}
        setToState={setToState}
        setSortOption={setSortOption}
      />
      <TransporterRecommendation transporterId={id} />
      {(sortOption === "All" || sortOption === "Almost Full") && (
        <AlmostFullTruck
          fromState={fromState}
          toState={toState}
        />
      )}
      {(sortOption === "All" || sortOption === "Empty") && (
        <EmptyTruck
          fromState={fromState}
          toState={toState}
        />
      )}
    </div>
  );
}
