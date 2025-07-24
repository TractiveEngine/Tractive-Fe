"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PackagedProduct, PackagedProducts } from "@/utils/PackageData";
import { IdCopyIcon } from "../../_components/Icons/TransporterIcons";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  maxWidth?: string;
}

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

const packageColumns: ColumnConfig<PackagedProduct>[] = [
  {
    header: "Package",
    key: "name",
    maxWidth: "max-w-[60px]",
    render: (packagedProduct) => (
      <div className="flex items-center gap-2">
        <Image
          src={packagedProduct.image}
          alt={`Image of ${packagedProduct.name}`}
          width={40} // Reduced for mobile
          height={24}
          className="object-cover sm:w-[53px] sm:h-[30px]"
        />
        <div className="flex flex-col">
          <span className="truncate text-[11px] sm:text-[12px] font-normal font-montserrat text-[#2b2b2b]">
            {packagedProduct.name}
          </span>
          <span className="truncate text-[11px] sm:text-[12px] font-normal font-montserrat text-[#2b2b2b] hidden sm:block">
            {packagedProduct.description}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "ID",
    key: "id",
    maxWidth: "max-w-[50px] sm:max-w-[30px]",
    render: (packagedProduct) => <IdCell id={packagedProduct.id} />,
  },
];

export const PackagedTable: React.FC = () => {
  return (
    <div className="w-full xl:w-[63%] bg-[#fefefe] shadow-md rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[100%] border-separate border-spacing-y-3 sm:border-spacing-y-0">
          <thead>
            <tr className="bg-[#fefefe] border-b border-[#e0e0e0]">
              {packageColumns.map((column, index) => (
                <th
                  key={column.key.toString()}
                  className={`
                    px-3 py-1 sm:px-2 sm:py-2 text-left font-montserrat font-normal text-[11px] sm:text-[12px] text-[#2b2b2b] border-b-[1px] border-[#e0e0e0]
                    ${column.maxWidth || ""}
                    ${index === 0 ? "first:rounded-tl-[10px]" : ""}
                    ${
                      index === packageColumns.length - 1
                        ? "last:rounded-tr-[10px]"
                        : ""
                    }
                  `}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PackagedProducts.map((item, index) => (
              <tr
                key={item.id}
                className={`
                  bg-[#fefefe]
                  ${
                    index === PackagedProducts.length - 1
                      ? "last:border-b-0"
                      : "border-b border-[#e0e0e0]"
                  }
                `}
              >
                {packageColumns.map((column, colIndex) => (
                  <td
                    key={`${item.id}-${column.key}`}
                    className={`
                      px-3 py-1 sm:px-2 sm:py-2 text-[10px] sm:text-[11px] font-montserrat font-normal
                      ${column.maxWidth || ""}
                      ${
                        index === PackagedProducts.length - 1 && colIndex === 0
                          ? "first:rounded-bl-[10px]"
                          : ""
                      }
                      ${
                        index === PackagedProducts.length - 1 &&
                        colIndex === packageColumns.length - 1
                          ? "last:rounded-br-[10px]"
                          : ""
                      }
                    `}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
