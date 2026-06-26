"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IdCopyIcon } from "../../../produce-list/_components/table/ProductRow";
import type { TrackOrderPackage } from "@/app/(main)/buyer/(account)/track-orders/_components/trackOrdersData";

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
};

const IdCell: React.FC<{ id: string }> = ({ id }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(id);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span>{id}</span>
      <button
        onClick={handleCopy}
        title="Copy Product ID"
        aria-label="Copy Product ID"
        className="cursor-pointer relative"
      >
        <IdCopyIcon />
        {isCopied && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#538e53] text-white text-[10px] px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
};

interface Props {
  packages: TrackOrderPackage[];
}

export const PackagedTable: React.FC<Props> = ({ packages }) => {
  return (
    <div className="w-full xl:w-[63%] bg-[#fefefe] shadow-md rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[100%] border-separate border-spacing-y-3 sm:border-spacing-y-0">
          <thead>
            <tr className="bg-[#fefefe] border-b border-[#e0e0e0]">
              <th
                className="px-3 py-1 sm:px-2 sm:py-2 text-left font-montserrat font-normal text-[11px] sm:text-[12px] text-[#2b2b2b] border-b-[1px] border-[#e0e0e0] max-w-[60px] first:rounded-tl-[10px]"
                scope="col"
              >
                Package
              </th>
              <th
                className="px-3 py-1 sm:px-2 sm:py-2 text-left font-montserrat font-normal text-[11px] sm:text-[12px] text-[#2b2b2b] border-b-[1px] border-[#e0e0e0] max-w-[50px] sm:max-w-[30px] last:rounded-tr-[10px]"
                scope="col"
              >
                ID
              </th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr className="bg-[#fefefe]">
                <td
                  colSpan={2}
                  className="px-3 py-6 text-center text-[11px] font-montserrat font-normal text-[#808080]"
                >
                  No packages on this order.
                </td>
              </tr>
            ) : (
              packages.map((item, index) => {
                const isLast = index === packages.length - 1;
                return (
                  <tr
                    key={item.id}
                    className={`bg-[#fefefe] ${
                      isLast ? "last:border-b-0" : "border-b border-[#e0e0e0]"
                    }`}
                  >
                    <td
                      className={`px-3 py-1 sm:px-2 sm:py-2 text-[10px] sm:text-[11px] font-montserrat font-normal max-w-[60px] ${
                        isLast ? "first:rounded-bl-[10px]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.image}
                          alt={`Image of ${item.name}`}
                          width={40}
                          height={24}
                          className="object-cover sm:w-[53px] sm:h-[30px]"
                        />
                        <div className="flex flex-col">
                          <span className="truncate text-[11px] sm:text-[12px] font-normal font-montserrat text-[#2b2b2b]">
                            {item.name}
                          </span>
                          <span className="truncate text-[11px] sm:text-[12px] font-normal font-montserrat text-[#2b2b2b] hidden sm:block">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-3 py-1 sm:px-2 sm:py-2 text-[10px] sm:text-[11px] font-montserrat font-normal max-w-[50px] sm:max-w-[30px] ${
                        isLast ? "last:rounded-br-[10px]" : ""
                      }`}
                    >
                      <IdCell id={item.productId} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
