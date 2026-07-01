"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTransporterMostHired } from "@/hooks/queries/useTransporterDashboardQueries";

export const MostHired: React.FC = () => {
  const { data, isLoading, isError } = useTransporterMostHired(7);
  // On lg screens the column is short, so cap at 4 rows; show all otherwise.
  const [limit, setLimit] = useState(7);

  useEffect(() => {
    const update = () => setLimit(window.innerWidth <= 1024 ? 4 : 7);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const drivers = (data ?? []).slice(0, limit);

  return (
    <div className="w-full rounded-[4px]">
      <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-normal mb-4 bg-[#cce5cc] flex items-center justify-center w-[40%]">
        Most hired
      </h2>

      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full flex items-center gap-[5px] px-4 pb-5 lg:pb-1"
            >
              <span className="w-[60px] h-[44px] rounded-[4px] bg-[#ececec] animate-pulse" />
              <div className="flex flex-col gap-2">
                <span className="block h-2.5 w-24 rounded bg-[#ececec] animate-pulse" />
                <span className="block h-2.5 w-32 rounded bg-[#ececec] animate-pulse" />
              </div>
            </div>
          ))
        ) : isError || !drivers.length ? (
          <p className="px-4 py-8 text-center text-[11px] font-montserrat text-[#808080]">
            {isError ? "Couldn't load most hired." : "No hires yet."}
          </p>
        ) : (
          drivers.map((driver) => (
            <div
              key={driver.id}
              className="w-full flex items-center justify-between px-4 pb-5 lg:pb-1"
            >
              <div className="flex items-center gap-[5px]">
                <div className="bg-[#f1f1f1] flex items-center w-[60px] h-[44px] px-[8px] justify-center rounded-[4px] gap-[5px]">
                  <Image
                    src={driver.image || "/images/truckcontainer.png"}
                    alt={driver.name}
                    width={43}
                    height={27}
                    className=""
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                    {driver.name}
                  </span>
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                    {driver.description}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
