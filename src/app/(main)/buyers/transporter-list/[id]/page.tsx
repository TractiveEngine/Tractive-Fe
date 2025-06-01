"use client";
import React, { useState } from "react";
import { TransporterHeader } from "../_components/TransporterProfile/TransporterHeader";
import { FilterTransporter } from "../_components/TransporterProfile/FilterTransporter";
import { TransporterRecommendation } from "../_components/TransporterProfile/TransporterRecommendation";
import { AlmostFullTruck } from "../_components/TransporterProfile/AlmostFullTruck";
import { EmptyTruck } from "../_components/TransporterProfile/EmptyTruck";

export default function TransportersID() {
  const [fromState, setFromState] = useState<string>("");
  const [toState, setToState] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("All");
  return (
    <div className="w-full bg-[#f1f1f1]">
      <TransporterHeader />
      <FilterTransporter
        fromState={fromState}
        toState={toState}
        sortOption={sortOption}
        setFromState={setFromState}
        setToState={setToState}
        setSortOption={setSortOption}
      />
      <TransporterRecommendation />
      <AlmostFullTruck />
      <EmptyTruck />
    </div>
  );
}
