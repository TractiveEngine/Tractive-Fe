import Image from "next/image";
import React from "react";
import "../Table.css"

// Define the transit data type
interface TransitData {
  id: number;
  name: string;
  description: string;
  image: string;
  iot: string;
  route: string;
  driver: string;
}

// Sample transit data with truck names
const transitData: TransitData[] = [
  {
    id: 1,
    name: "FreightMaster 001",
    description: "Fresh produce delivery",
    image: "/images/truckcontainer.png",
    iot: "32421345",
    route: "Lagos to Abuja",
    driver: "John Adebayo",
  },
  {
    id: 2,
    name: "CargoKing 002",
    description: "Organic farm produce",
    image: "/images/truckcontainer.png",
    iot: "98765432",
    route: "Ogun to Kano",
    driver: "Chidi Okeke",
  },
  {
    id: 3,
    name: "Transatron 003",
    description: "Bulk grain transport",
    image: "/images/truckcontainer.png",
    iot: "45678912",
    route: "Kaduna to Enugu",
    driver: "Aminu Bello",
  },
  {
    id: 4,
    name: "MegaFreight 004",
    description: "Tropical fruit shipment",
    image: "/images/truckcontainer.png",
    iot: "12345678",
    route: "Oyo to Rivers",
    driver: "Emeka Nwosu",
  },
];

export const TransitTable: React.FC = () => {
  return (
    <div className="w-full bg-[#fefefe] shadow-md rounded-[8px] overflow-x-auto">
      <div className="Table_Container">
        {" "}
        {/* Set minimum width to ensure table doesn't shrink too much */}
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-[#e2e2e2]">
              <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left py-2 px-4">
                <div className="flex items-center justify-center p-2 bg-[#cce5cc] rounded-tl-[6px] rounded-br-[6px] w-max">
                  On Transit
                </div>
              </th>
              <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left py-2 px-4">
                IOT
              </th>
              <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left py-2 px-4">
                Route
              </th>
              <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left py-2 px-4">
                Drivers
              </th>
            </tr>
          </thead>
          <tbody>
            {transitData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#e2e2e2] last:border-b-0"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f1f1f1] flex items-center justify-center rounded-[4px] min-w-[40px]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-[150px]">
                      <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium">
                        {item.name}
                      </span>
                      <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal truncate max-w-[180px]">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 min-w-[80px]">
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                    {item.iot}
                  </span>
                </td>
                <td className="py-3 px-4 min-w-[120px]">
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                    {item.route}
                  </span>
                </td>
                <td className="py-3 px-4 min-w-[100px]">
                  <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                    {item.driver}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
