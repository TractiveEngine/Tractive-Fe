import Link from "next/link";
import React from "react";
import { StarIcon, WishIcon1, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import { BiddingItem } from "../../../BiddingDatas";

interface ProductInfoProps {
  item: BiddingItem;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ item }) => {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 md:px-8 pt-2 pb-6 gap-6 sm:gap-8 bg-[#fefefe]">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-[7rem] gap-4">
            <p className="font-montserrat font-normal text-base sm:text-lg text-[#2b2b2b]">
              {item.title}
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <YellowStarIcon />
                  <YellowStarIcon />
                  <YellowStarIcon />
                  <YellowStarIcon />
                  <StarIcon />
                  <span className="font-montserrat font-normal text-xs sm:text-sm text-[#2b2b2b]">
                    4.0
                  </span>
                </div>
                <p className="font-montserrat font-normal text-xs sm:text-sm text-[#2b2b2b]">
                  (120 Reviews)
                </p>
              </div>
              <div className="bg-[#f1f1f1] cursor-pointer flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                <WishIcon1 title="Add to Wishlist" className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
              Quantity <span className="text-[#2b2b2b]">{item.quantity}</span>
            </p>
            <span className="w-[1.5px] h-3 sm:h-4 bg-[#2b2b2b] hidden sm:block"></span>
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
              Price <span className="text-[#2b2b2b]">{item.amount}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
            Description
          </p>
          <p className="font-montserrat font-normal text-xs sm:text-sm text-[#2b2b2b]">
            {item.description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <Image
                src="/images/bidder1.png"
                alt="Bidder 1"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white"
              />
              <Image
                src="/images/bidder2.png"
                alt="Bidder 2"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white -ml-2 sm:-ml-3"
              />
              <Image
                src="/images/bidder3.png"
                alt="Bidder 3"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white -ml-2 sm:-ml-3"
              />
              <Image
                src="/images/bidder4.png"
                alt="Bidder 4"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white -ml-2 sm:-ml-3"
              />
            </div>
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#2b2b2b]">
              + 24 others have bidden
            </p>
          </div>
          <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#2b2b2b] hidden sm:block"></span>
          <div className="flex items-center gap-1.5">
            <span className="font-montserrat text-xs sm:text-sm text-[#2b2b2b] font-normal">
              Leading:
            </span>
            <div className="flex items-center flex-col">
              <Image
                src="/images/leadingcrown.png"
                alt="crown"
                width={16}
                height={16}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <Image
                src="/images/leadbidder.png"
                alt="Bidder"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
          </div>
          <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
            James Peters: <span className="text-[#2b2b2b]">{item.biddingPrice}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
            Share this
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/images/FacebookBlack.png"
              alt="Facebook"
              width={20}
              height={20}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <Image
              src="/images/WhatsAppBlack.png"
              alt="WhatsApp"
              width={20}
              height={20}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <Image
              src="/images/TwitterBlack.png"
              alt="Twitter"
              width={20}
              height={20}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>
        </div>
      </div>
      <Link
        href="/report"
        className="font-montserrat font-normal text-xs sm:text-sm text-[#8b4513]"
      >
        Report this item
      </Link>
    </div>
  );
};