"use client";
import { BuyersPackage, BuyersPackages } from "@/utils/BuyersPackage";
import Image from "next/image";
interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  maxWidth?: string;
}

const packageColumns: ColumnConfig<BuyersPackage>[] = [
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
          className="object-cover sm:w-[79px] sm:h-[43px] rounded-[7px]"
        />
        <div className="flex flex-col">
          <span className="truncate text-[12px] sm:text-[13px] font-normal font-montserrat text-[#2b2b2b]">
            {packagedProduct.name}
          </span>
          <span className="truncate text-[12px] sm:text-[13px] font-normal font-montserrat text-[#2b2b2b] hidden sm:block">
            ID:{packagedProduct.id}
          </span>
        </div>
      </div>
    ),
  },
];

export const PackagedTable: React.FC = () => {
  return (
    <div className="w-full bg-[#fefefe] shadow-md rounded-[8px] overflow-hidden">
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
            {BuyersPackages.map((item, index) => (
              <tr
                key={item.id}
                className={`
                  bg-[#fefefe]
                  ${
                    index === BuyersPackages.length - 1
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
                        index === BuyersPackages.length - 1 && colIndex === 0
                          ? "first:rounded-bl-[10px]"
                          : ""
                      }
                      ${
                        index === BuyersPackages.length - 1 &&
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
