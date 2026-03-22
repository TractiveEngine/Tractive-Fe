"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProductRow } from "./ProductRow";
import { Fleet } from "@/utils/Fleet";


interface FleetTableProps {
  fleets: Fleet[];
  copyToClipboard: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleToggleStatus: (id: string, newStatusStr: string) => void; // Changed from handleSetAvailable
  handleTracking: (id: string) => void;
  onRowClick?: (fleet: Fleet) => void;
}

export const FleetTable: React.FC<FleetTableProps> = ({
  fleets,
  copyToClipboard,
  handleEdit,
  handleDelete,
  handleToggleStatus,
  handleTracking,
  onRowClick,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="Table_Container"
    >
      <table
        className="w-full border-separate border-spacing-y-3"
        aria-label="Fleet management table"
      >
        <thead>
          <tr className="text-left text-[13px] font-normal font-montserrat text-[#808080] md:text-sm">
            <th
              className="min-w-[150px] py-1.5 pl-4 font-montserrat font-normal"
              scope="col"
            >
              Item
            </th>
            <th
              className="min-w-[100px] py-1.5 pl-4 font-montserrat font-normal sm:table-cell"
              scope="col"
            >
              IOT
            </th>
            <th
              className="min-w-[100px] py-1.5 pl-4 font-montserrat font-normal md:table-cell"
              scope="col"
            >
              Route
            </th>
            <th
              className="min-w-[100px] py-1.5 pl-4 font-montserrat font-normal lg:table-cell"
              scope="col"
            >
              Status
            </th>
            <th
              className="min-w-[100px] py-1.5 pl-4 font-montserrat font-normal lg:table-cell"
              scope="col"
            >
              Price
            </th>
            <th
              className="min-w-[100px] py-1.5 pl-4 font-montserrat font-normal md:table-cell"
              scope="col"
            >
              Date
            </th>
            <th className="min-w-[50px] py-1.5 pl-4" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {fleets.length > 0 ? (
            fleets.map((fleet, index) => (
              <ProductRow
                key={fleet.id}
                fleet={fleet}
                index={index}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                copyToClipboard={copyToClipboard}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleToggleStatus={handleToggleStatus}
                handleTracking={handleTracking}
                onRowClick={onRowClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Image
                    src="/images/truckcontainer.png"
                    alt="Empty Fleet"
                    width={80}
                    height={80}
                    className="opacity-70 object-contain rounded-full bg-[#f1f1f1] w-[80px] h-[80px]"
                  />
                  <h3 className="text-[16px] font-medium font-montserrat text-[#2b2b2b]">
                    No Fleet Available
                  </h3>
                  <p className="text-[13px] font-montserrat text-[#808080]">
                    Add a fleet to see your fleet list
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};