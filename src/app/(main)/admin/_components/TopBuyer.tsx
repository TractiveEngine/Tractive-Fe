import Image from "next/image";
import React from "react";

// Define the product data type
interface OutOfStockProduct {
  id: number;
  name: string;
  image: string;
}

// Sample data for 7 out-of-stock products
const outOfStockProducts: OutOfStockProduct[] = [
  {
    id: 1,
    name: "Joseph Oyin",
    image: "/images/TopBuyer.png",
  },
  {
    id: 2,
    name: "Joseph Oyin",
    image: "/images/TopBuyer.png",
  },
  {
    id: 3,
    name: "Joseph Oyin",
    image: "/images/TopBuyer.png",
  },
  {
    id: 4,
    name: "Joseph Oyin",
    image: "/images/TopBuyer.png",
  },
  {
    id: 5,
    name: "Joseph Oyin",
    image: "/images/TopBuyer.png",
  },
  {
    id: 6,
    name: "Joseph Oyin",
    image: "/images/TopBuyer.png",
  },
  {
    id: 7,
    name: "Joseph Oyin",
    image: "/images/TopBuyer.png",
  },
];

export const TopBuyer: React.FC = () => {
  return (
    <div className="w-full lg:w-[39%] bg-[#fefefe] shadow-md rounded-[4px]">
      <div className="flex justify-between items-center mb-4 pr-4">
        <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-medium bg-[#cce5cc] flex items-center justify-center w-[40%]">
          Top Buyers
        </h2>
        <span className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
          Revenue
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {outOfStockProducts.map((product) => (
          <div
            key={product.id}
            className="w-full flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-[5px]">
              <Image
                src={product.image}
                alt={product.name}
                width={40}
                height={40}
                className=""
              />
                <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                  {product.name}
                </span>
            </div>
            <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium cursor-pointer">
              $40,000
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
