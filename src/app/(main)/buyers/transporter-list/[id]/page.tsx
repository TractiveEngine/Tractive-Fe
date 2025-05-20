"use client"
import React, { useState } from "react";
import { TransporterHeader } from "../_components/TransporterProfile/TransporterHeader";
import { FilterTransporter } from "../_components/TransporterProfile/FilterTransporter";
import { TransporterRecommendation } from "../_components/TransporterProfile/TransporterRecommendation";
import { AlmostFullTruck } from "../_components/TransporterProfile/AlmostFullTruck";

export default function TransportersID() {
  const [fromState, setFromState] = useState<string>("");
  const [toState, setToState] = useState<string>("");
  return (
    <div className="w-full bg-[#f1f1f1]">
      <TransporterHeader />
      <FilterTransporter
        fromState={fromState}
        toState={toState}
        setFromState={setFromState}
        setToState={setToState}
      />
      <TransporterRecommendation />
      <AlmostFullTruck />
    </div>
  );
}

{/* <AlmostFullTruck fromState={fromState} toState={toState} /> */}