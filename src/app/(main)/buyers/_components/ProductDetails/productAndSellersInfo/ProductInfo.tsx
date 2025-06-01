import Link from "next/link";
import React from "react";
import { StarIcon, WishIcon1, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import { BiddingItem } from "../../../BiddingDatas";

interface ProductInfoProps {
  item: BiddingItem;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({item}) => {
  return (
    <div className="w-[100%] flex flex-col px-4 pt-2 pb-6 gap-[50px] bg-[#fefefe]">
      <div className="w-[100%] flex flex-col">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between w-1/2">
              <p className="font-montserrat font-normal text-[17px] text-[#2b2b2b]">
                {item.title}
              </p>
              <div className="flex items-center gap-[40px]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <YellowStarIcon />
                    <YellowStarIcon />
                    <YellowStarIcon />
                    <YellowStarIcon />
                    <StarIcon />
                    <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                      4.0
                    </span>
                  </div>
                  <p className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                    (120 Reviews)
                  </p>
                </div>
                <div className="bg-[#f1f1f1] cursor-pointer flex items-center justify-center w-[30px] h-[30px] rounded-full">
                  <WishIcon1 title="Add to Wishlist" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-montserrat font-normal text-[13px] text-[#808080]">
                Quantity
                <span className="text-[#2b2b2b]"> {item.quantity}</span>
              </p>
              <span className="w-[1.5px] h-[15px] bg-[#2b2b2b]"></span>
              <p className="font-montserrat font-normal text-[13px] text-[#808080]">
                Price <span className="text-[#2b2b2b]">{item.amount}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-montserrat font-normal text-[13px] text-[#808080]">
              Description
            </p>
            <p className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
              {item.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-12">
            <div className="relative w-[30px] h-[30px]">
              <Image
                src="/images/bidder1.png"
                alt="Bidder 1"
                width={30}
                height={30}
                className="absolute left-0 z-10"
              />
              <Image
                src="/images/bidder2.png"
                alt="Bidder 2"
                width={30}
                height={30}
                className="absolute left-[12px] z-20"
              />
              <Image
                src="/images/bidder3.png"
                alt="Bidder 3"
                width={30}
                height={30}
                className="absolute left-[28px] z-30"
              />
              <Image
                src="/images/bidder4.png"
                alt="Bidder 4"
                width={30}
                height={30}
                className="absolute left-[40px] z-40"
              />
            </div>
            <p className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
              + 24 others have bidden
            </p>
          </div>
          <span className="w-[10px] h-[10px] rounded-[100px] bg-[#2b2b2b]"></span>
          <div className="flex items-center gap-1.5">
            <span className="font-montserrat text-[13px] text-[#2b2b2b] font-normal">
              Leading:
            </span>
            <div className="flex items-center flex-col mb-3">
              <Image
                src="/images/leadingcrown.png"
                alt="crown"
                width={20}
                height={20}
                className=""
              />
              <Image
                src="/images/leadbidder.png"
                alt="Bidder"
                width={30}
                height={30}
              />
            </div>
          </div>
          <p className="font-montserrat font-normal text-[13px] text-[#808080]">
            James Peters:{" "}
            <span className="text-[#2b2b2b]">{item.biddingPrice}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-montserrat font-normal text-[13px] text-[#808080]">
            Share this
          </p>
          <div className="flex items-center gap-2">
            <Image
              src="/images/FacebookBlack.png"
              alt="Social Media"
              width={24}
              height={24}
            />
            <Image
              src="/images/WhatsAppBlack.png"
              alt="Social Media"
              width={24}
              height={24}
            />
            <Image
              src="/images/TwitterBlack.png"
              alt="Social Media"
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
      <Link
        href="/report"
        className="font-montserrat font-normal text-[12px] text-[#8b4513]"
      >
        Report this item
      </Link>
    </div>
  );
};
