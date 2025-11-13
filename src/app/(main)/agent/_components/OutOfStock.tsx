import Image from "next/image";
import React from "react";

// Define the product data type
interface OutOfStockProduct {
  id: number;
  name: string;
  description: string;
  image: string;
}

// Sample data for 7 out-of-stock products
const outOfStockProducts: OutOfStockProduct[] = [
  {
    id: 1,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
  },
  {
    id: 2,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
  },
  {
    id: 3,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
  },
  {
    id: 4,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
  },
  {
    id: 5,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
  },
  {
    id: 6,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
  },
  {
    id: 7,
    name: "Coco-yam",
    description: "Best of all the",
    image: "/images/yellowPepper.png",
  },
];

export const OutOfStock: React.FC = () => {
  return (
    <div className="w-full lg:w-[39%] bg-[#fefefe] shadow-md rounded-[4px]">
      <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-medium mb-4 bg-[#cce5cc] flex items-center justify-center w-[40%]">
        Out of Stock
      </h2>

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
            <span className="font-montserrat text-[#538e53] text-[12px] font-medium cursor-pointer">
              Restock
            </span>
          </div>
        ))}
      </div>
      <button className="flex items-center justify-end ml-auto mr-4 text-[12px] font-montserrat mt-[1rem] text-[#538e53]">
        See all
      </button>
    </div>
  );
};
