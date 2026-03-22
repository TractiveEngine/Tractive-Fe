"use client";

import React from "react";
import { AllTransit } from "./_components/ALLTransit";

export default function FleetListPage() {
  return (
    <div className="mx-auto mb-5 w-[95%] rounded-[10px] bg-white shadow-md">
      <h1 className="mb-4 px-6 pt-6 text-base font-normal font-montserrat sm:text-lg">
        Stock Management
      </h1>
      <div className="h-px w-full bg-gray-200" />
      <div className="mb-4">
        <AllTransit />
      </div>
    </div>
  );
}
