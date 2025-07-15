import Image from "next/image";
import React from "react";

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
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-[#e2e2e2]">
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left">
              <div className="flex items-center justify-center p-2 bg-[#cce5cc] rounded-tl-[6px] rounded-br-[6px]  w-[50%]">
                On Transit
              </div>
            </th>
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left">
              IOT
            </th>
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left">
              Route
            </th>
            <th className="font-montserrat text-[#2b2b2b] text-[12px] font-normal text-left">
              Drivers
            </th>
          </tr>
        </thead>
        <tbody>
          {transitData.map((item) => (
            <tr
              key={item.id}
            >
              <td className="p-[0.35rem]">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-[#f1f1f1] flex items-center justify-center rounded-[4px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                      {item.name}
                    </span>
                    <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal truncate max-w-[120px] sm:max-w-[180px]">
                      {item.description}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-[0.35rem]">
                <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                  {item.iot}
                </span>
              </td>
              <td className="p-[0.35rem]">
                <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                  {item.route}
                </span>
              </td>
              <td className="p-[0.35rem]">
                <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                  {item.driver}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
