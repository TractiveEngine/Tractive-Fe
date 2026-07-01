"use client";
import Image from "next/image";
import React from "react";
import "../Table.css";
import { useTransporterTransit } from "@/hooks/queries/useTransporterDashboardQueries";

export const TransitTable: React.FC = () => {
  const { data, isLoading, isError } = useTransporterTransit(10);
  const rows = data ?? [];

  return (
    <div className="TransitTable">
      <table className="w-full table-auto border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-[12px] font-normal font-montserrat text-[#808080]">
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left">
              <div className="flex items-center justify-center p-2 bg-[#cce5cc] rounded-tl-[6px] rounded-br-[6px] w-max">
                On Transit
              </div>
            </th>
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left px-2.5">
              <span className="hidden sm:flex">IOT</span>
            </th>
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left px-2.5">
              <span className="hidden lg:flex">Route</span>
            </th>
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left px-2.5">
              <span className="hidden lg:flex">Drivers</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="bg-white">
                <td className="py-2.5 px-4 border-y border-l border-gray-200 rounded-l-[8px]">
                  <div className="flex items-center gap-3">
                    <span className="w-[40px] h-[24px] rounded bg-[#ececec] animate-pulse" />
                    <div className="flex flex-col gap-1.5">
                      <span className="block h-2.5 w-24 rounded bg-[#ececec] animate-pulse" />
                      <span className="block h-2.5 w-20 rounded bg-[#ececec] animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-4 border-y border-gray-200">
                  <span className="hidden sm:block h-2.5 w-16 rounded bg-[#ececec] animate-pulse" />
                </td>
                <td className="py-2.5 px-4 border-y border-gray-200">
                  <span className="hidden lg:block h-2.5 w-20 rounded bg-[#ececec] animate-pulse" />
                </td>
                <td className="py-2.5 px-4 border-y border-r border-gray-200 rounded-r-[8px]">
                  <span className="hidden lg:block h-2.5 w-16 rounded bg-[#ececec] animate-pulse" />
                </td>
              </tr>
            ))
          ) : isError || !rows.length ? (
            <tr>
              <td
                colSpan={4}
                className="py-8 text-center text-[11px] font-montserrat text-[#808080]"
              >
                {isError ? "Couldn't load transit." : "Nothing on transit."}
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr
                key={item.id}
                className="bg-white hover:bg-gray-50 transition-colors relative"
              >
                <td className="py-2.5 px-4 border-y border-l border-gray-200 rounded-l-[8px]">
                  <div className="flex items-center gap-3">
                    <div className="bg-[f1f1f1] flex items-center justify-center rounded-[4px]">
                      <Image
                        src={item.image || "/images/truckcontainer.png"}
                        alt={item.name}
                        width={40}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium">
                        {item.name}
                      </span>
                      <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-4 border-y border-gray-200">
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal hidden sm:flex">
                    {item.iot}
                  </span>
                </td>
                <td className="py-2.5 px-4 border-y border-gray-200">
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal hidden lg:flex">
                    {item.route}
                  </span>
                </td>
                <td className="py-2.5 px-4 border-y border-r border-gray-200 rounded-r-[8px]">
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal hidden lg:flex">
                    {item.driver}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!isLoading && !isError && rows.length > 0 && (
        <button className="cursor-pointer flex items-center justify-end ml-auto mr-2 text-[12px] font-montserrat mt-1 text-[#538e53]">
          See all
        </button>
      )}
    </div>
  );
};
