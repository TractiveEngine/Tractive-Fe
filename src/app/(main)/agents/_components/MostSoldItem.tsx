import Image from "next/image";
import React from "react";

// Define the product data type
interface MostSoldItemProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  orders: number;
}

// Sample data for 7 out-of-stock products
const MostSoldItemProducts: MostSoldItemProduct[] = [
  {
    id: 1,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
    orders: 65,
  },
  {
    id: 2,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
    orders: 15,
  },
  {
    id: 3,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
    orders: 45,
  },
  {
    id: 4,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
    orders: 25,
  },
];

export const MostSoldItem: React.FC = () => {
  return (
    <div className="w-full lg:w-[39%] bg-[#fefefe] shadow-md rounded-[4px] pb-4 lg:pb-0.5">
      <div className="flex items-end justify-between border-b-[1px] border-[#e2e2e2] mb-4">
        <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-medium bg-[#cce5cc] flex items-center justify-center w-[40%]">
          Most Sold Item
        </h2>
        <span className="font-montserrat text-[#2b2b2b] text-[12px] pr-6 pb-1.5 font-normal">Orders</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {MostSoldItemProducts.map((product) => (
          <div
            key={product.id}
            className="w-full flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-[5px]">
              <Image
                src={product.image}
                alt={product.name}
                width={63}
                height={47}
                className=""
              />
              <div className="flex flex-col gap-2">
                <span className="font-montserrat text-[#2b2b2b] text-[10px] font-normal">
                  {product.name}
                </span>
                <span className="font-montserrat text-[#2b2b2b] text-[10px] font-normal truncate">
                  {product.description}
                </span>
              </div>
            </div>
            <span className="px-4 py-1 w-[4rem] bg-[#f1f1f1] flex items-center justify-center rounded-[4px] whitespace-nowrap text-[10.5px] font-montserrat font-normal text-[#2b2b2b]">
              {product.orders}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
