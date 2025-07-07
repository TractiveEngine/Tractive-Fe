"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { LoaderIcon } from "@/icons/Icons";

interface Seller {
  name: string;
  image: string;
  rating: number;
  storeLink: string;
}

interface TopSellersProps {
  topSellers: Seller[];
  loadingStates: Record<string, boolean>;
  isFollowing: (sellerName: string) => boolean;
  toggleFollow: (sellerName: string) => Promise<void>;
  renderStars: (rating: number) => React.ReactNode[];
}

export const TopSellers: React.FC<TopSellersProps> = ({
  topSellers,
  loadingStates,
  isFollowing,
  toggleFollow,
  renderStars,
}) => {
  // Loader SVG
  const Loader = () => <LoaderIcon />;

  return (
    <div className="w-full lg:w-[33%] bg-[#FEFEFE] rounded-[4px] flex flex-col gap-[1rem] mb-4 lg:mb-0">
      <p className="text-[#2B2B2B] bg-[#CCE5CC80] px-[1rem] py-[0.7rem] rounded-tl-[7px] rounded-br-[7px] text-[0.89rem] w-[7rem] font-normal">
        Top Sellers
      </p>
      <div className="flex flex-col gap-4 mx-auto mb-0 md:mb-4 w-[90%]">
        {topSellers.map((seller, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-1.5"
          >
            <div className="flex items-center gap-2">
              <div>
                <Image
                  src={seller.image}
                  alt={`Top Seller ${seller.name}`}
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col">
                <span className="truncate text-[0.7rem] text-[#2B2B2B] font-normal">
                  {seller.name}
                </span>
                <div className="flex items-center gap-[0.2rem]">
                  {renderStars(seller.rating)}
                </div>
              </div>
            </div>
            
            <Button
              text={
                loadingStates[seller.name] ? (
                  <Loader />
                ) : isFollowing(seller.name) ? (
                  "Following"
                ) : (
                  "Visit Store"
                )
              }
              onClick={() => toggleFollow(seller.name)}
              className="bg-transparent border-[#538E53] border-[2px] !hover:text-[#fefefe]  !rounded-[4px] !px-[0.5rem] !py-[0.55rem] text-[0.8rem] font-normal flex items-center justify-center"
              textClass="text-[#538E53] !hover:text-[#fefefe] text-[0.8rem] font-normal"
              disabled={loadingStates[seller.name]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
