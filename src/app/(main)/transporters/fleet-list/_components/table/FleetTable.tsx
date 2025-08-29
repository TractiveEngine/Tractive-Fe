"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProductRow } from "./ProductRow";
import { Fleet } from "@/utils/Fleet";


interface FleetTableProps {
  fleets: Fleet[];
  copyToClipboard: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleToggleStatus: (id: string) => void; // Changed from handleSetAvailable
  handleTracking: (id: string) => void;
}

export const FleetTable: React.FC<FleetTableProps> = ({
  fleets,
  copyToClipboard,
  handleEdit,
  handleDelete,
  handleToggleStatus,
  handleTracking,
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
        className="w-full table-auto border-collapse"
        aria-label="Fleet management table"
      >
        <thead>
          <tr className="text-left text-[13px] font-normal font-montserrat text-gray-800 md:text-sm">
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
          {fleets.map((fleet, index) => (
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
            />
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};