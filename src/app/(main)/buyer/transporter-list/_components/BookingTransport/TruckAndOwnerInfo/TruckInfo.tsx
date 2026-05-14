import Link from "next/link";
import React from "react";
import { StarIcon, WishIcon1, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import { LocationIcon } from "@/icons/Icon1";
import { TruckItem } from "@/utils/TruckData";
import { ApiTruck } from "@/services/transporterService";

interface TruckInfoProps {
  item: TruckItem;
  apiTruck?: ApiTruck;
}

export const TruckInfo: React.FC<TruckInfoProps> = ({ item, apiTruck }) => {
  const capacity = apiTruck?.capacity || item.capacity || item.fullLoad;
  const estimatedDelivery = apiTruck?.estimatedDeliveryText || "3 days";
  const priceLabel = apiTruck
    ? `₦${apiTruck.price.toLocaleString()} ${apiTruck.priceUnitLabel}`
    : item.amountPerKg;
  const remainingCapacity = apiTruck?.remainingCapacityDisplay || item.spaceRemaining;
  const status = apiTruck?.status;
  const bidSummary = apiTruck?.bidSummary;

  return (
    <div className="w-[100%] flex flex-col px-4 pt-2 pb-6 gap-[50px] bg-[#fefefe]">
      <div className="w-[100%] flex flex-col gap-5">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between flex-wrap w-[100%] md:w-3/5">
              <p className="font-montserrat font-normal text-[17px] text-[#2b2b2b]">
                {item.truckName}
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
                      {item.rating}
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

            <div className="flex items-center flex-wrap gap-1 sm:gap-[4px]">
              <div className="flex items-center gap-[3px]">
                <LocationIcon />
                <p className="font-montserrat text-[10px] sm:text-[11px] md:text-[12px] text-[#2b2b2b] font-medium">
                  {item.locationFrom} to {item.locationTo}
                </p>
              </div>
              <span className="w-[2px] h-[1rem] bg-[#808080]" />
              <p className="font-montserrat text-[10px] sm:text-[11px] md:text-[12px] text-[#2b2b2b] font-normal">
                {capacity}
              </p>
              <span className="w-[2px] h-[1rem] bg-[#808080]" />
              <p className="font-montserrat text-[10px] sm:text-[11px] md:text-[12px] text-[#2b2b2b] font-normal">
                Estimated delivery: {estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Price, Remaining Capacity & Status */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-4">
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
              Price: <span className="text-[#2b2b2b] font-medium">{priceLabel}</span>
            </p>
            <span className="w-[1.5px] h-3 sm:h-4 bg-[#808080]" />
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
              Space Remaining: <span className="text-[#2b2b2b] font-medium">{remainingCapacity}</span>
            </p>
            {status && (
              <>
                <span className="w-[1.5px] h-3 sm:h-4 bg-[#808080]" />
                <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
                  Status:{" "}
                  <span
                    className={`font-bold uppercase text-xs ${
                      status === "available" ? "text-green-600" : status === "on_transit" ? "text-orange-500" : "text-red-500"
                    }`}
                  >
                    {status.replace(/_/g, " ")}
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Bid Summary */}
          {bidSummary && bidSummary.totalBids > 0 && (
            <div className="flex flex-col gap-2 p-3 bg-[#f9f9f9] rounded-md">
              <p className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
                Bid Summary
              </p>
              <div className="flex items-center flex-wrap gap-3">
                <p className="font-montserrat text-xs text-[#808080]">
                  Total Bids: <span className="text-[#2b2b2b] font-medium">{bidSummary.totalBids}</span>
                </p>
                <span className="w-[1.5px] h-3 bg-[#808080]" />
                <p className="font-montserrat text-xs text-[#808080]">
                  Active: <span className="text-[#2b2b2b] font-medium">{bidSummary.activeBidsCount}</span>
                </p>
                <span className="w-[1.5px] h-3 bg-[#808080]" />
                <p className="font-montserrat text-xs text-[#808080]">
                  Highest Bid: <span className="text-[#2b2b2b] font-medium">₦{bidSummary.highestBidAmount.toLocaleString()}</span>
                </p>
              </div>
              {bidSummary.activeBidders.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  <p className="font-montserrat text-xs text-[#808080]">Active Bidders:</p>
                  <div className="flex flex-wrap gap-2">
                    {bidSummary.activeBidders.map((bidder) => (
                      <span
                        key={bidder.id}
                        className="font-montserrat text-xs bg-white px-2 py-1 rounded border border-[#e0e0e0] text-[#2b2b2b]"
                      >
                        {bidder.name} — {bidder.loadDisplay}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <p className="font-montserrat font-normal text-[13px] text-[#808080]">
              Description
            </p>
            <p className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
              {item.fleetDescription || "No description available."}
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
              {bidSummary
                ? `+ ${bidSummary.totalBids} others have booked`
                : "+ 24 others have booked"}
            </p>
          </div>
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
        Report this Fleet
      </Link>
    </div>
  );
};
