import Image from "next/image";
import React from "react";

// Define the product data type
interface MostHiredDriversProps {
  id: number;
  name: string;
  description: string;
  image: string;
}

// Sample data for 7 out-of-stock products
const MostHiredDrivers: MostHiredDriversProps[] = [
  {
    id: 1,
    name: "Heavy container",
    description: "40 fit container, elegant model",
    image: "/images/truckcontainer.png",
  },
  {
    id: 2,
    name: "Heavy container",
    description: "40 fit container, elegant model",
    image: "/images/truckcontainer.png",
  },
  {
    id: 3,
    name: "Heavy container",
    description: "40 fit container, elegant model",
    image: "/images/truckcontainer.png",
  },
  {
    id: 4,
    name: "Heavy container",
    description: "40 fit container, elegant model",
    image: "/images/truckcontainer.png",
  },
  {
    id: 5,
    name: "Heavy container",
    description: "40 fit container, elegant model",
    image: "/images/truckcontainer.png",
  },
  {
    id: 6,
    name: "Heavy container",
    description: "40 fit container, elegant model",
    image: "/images/truckcontainer.png",
  },
  {
    id: 7,
    name: "Heavy container",
    description: "40 fit container, elegant model",
    image: "/images/truckcontainer.png",
  },
];

export const MostHired: React.FC = () => {
  return (
    <div className="w-full rounded-[4px]">
      <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-normal mb-4 bg-[#cce5cc] flex items-center justify-center w-[40%]">
        Most hired
      </h2>

      <div className="flex flex-col gap-2.5">
        {MostHiredDrivers.map((drivers) => (
          <div
            key={drivers.id}
            className="w-full flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-[5px]">
              <div className="bg-[#f1f1f1] flex items-center w-[60px] h-[44px] px-[8px] justify-center rounded-[4px] gap-[5px]">
              <Image
                src={drivers.image}
                alt={drivers.name}
                width={43}
                height={27}
                className=""
              />

              </div>
              <div className="flex flex-col gap-[8ppx]">
                <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
                  {drivers.name}
                </span>
                <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal truncate">
                  {drivers.description}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
