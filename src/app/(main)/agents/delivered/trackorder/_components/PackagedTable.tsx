import { useState } from "react";
import Image from "next/image";
import { PackagedProduct, PackagedProducts } from "@/utils/PackageData";
import { IdCopyIcon } from "../../../produce-list/_components/table/ProductRow";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
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

const packageColumns: ColumnConfig<PackagedProduct>[] = [
  {
    header: "Package",
    key: "name",
    minWidth: "min-w-[150px]",
    render: (packagedProduct) => (
      <div className="flex items-center gap-2">
        <Image
          src={packagedProduct.image}
          alt={`Image of ${packagedProduct.name}`}
          width={53}
          height={30}
          className="object-cover"
        />
        <div className="flex flex-col">
          <span className="truncate text-[12px] font-normal font-montserrat text-[#2b2b2b]">
            {packagedProduct.name}
          </span>
          <span className="truncate text-[12px] font-normal font-montserrat text-[#2b2b2b]">
            {packagedProduct.description}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "ID",
    key: "id",
    minWidth: "min-w-[100px]",
    render: (packagedProduct) => {
      const [isCopied, setIsCopied] = useState(false);

      const handleCopy = async () => {
        const success = await copyToClipboard(packagedProduct.id);
        if (success) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <span>{packagedProduct.id}</span>
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
    },
  },
];

export const PackagedTable: React.FC = () => {
  return (
    <div className="w-full bg-[#fefefe] shadow-md rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="border-spacing-0">
          <thead>
            <tr className="bg-[#fefefe] border-b border-[#e0e0e0]">
              {packageColumns.map((column, index) => (
                <th
                  key={column.key.toString()}
                  className={`
                    px-4 py-2 text-left font-montserrat font-normal text-[12px] text-[#2b2b2b]
                    ${column.minWidth || ""}
                    ${index === 0 ? "first:rounded-tl-[10px]" : ""}
                    ${
                      index === packageColumns.length - 1
                        ? "last:rounded-tr-[10px]"
                        : ""
                    }
                  `}
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
                      px-4 py-2 text-[11px] font-montserrat font-normal
                      ${column.minWidth || ""}
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
