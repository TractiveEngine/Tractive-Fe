import Link from "next/link";
import React from "react";
import { StarIcon, WishIcon1, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import { ApiProduct, Bidder } from "@/services/productService";

interface ProductInfoProps {
  item: ApiProduct;
  bidders: Bidder[];
  leadingBidder: Bidder | null;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  item,
  bidders,
  leadingBidder,
}) => {
  // Get unique avatars from bidders or placeholders
  const bidderAvatars = bidders.slice(0, 4);
  const remainingBidders = Math.max(0, bidders.length - 4);

  // Format price
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(item.price);

  return (
    <div className="w-full flex flex-col px-4 sm:px-6 md:px-8 pt-2 pb-6 gap-6 sm:gap-8 bg-[#fefefe]">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-[7rem] gap-4">
            <p className="font-montserrat font-normal text-base sm:text-lg text-[#2b2b2b]">
              {item.name}
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
                    {item.rating || "4.0"}
                  </span>
                </div>
                <p className="font-montserrat font-normal text-xs sm:text-sm text-[#2b2b2b]">
                  ({item.reviews || 120} Reviews)
                </p>
              </div>
              <div className="bg-[#f1f1f1] cursor-pointer flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                <WishIcon1
                  title="Add to Wishlist"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
              Quantity{" "}
              <span className="text-[#2b2b2b]">
                {item.quantity} {item.unit}
              </span>
            </p>
            <span className="w-[1.5px] h-3 sm:h-4 bg-[#2b2b2b] hidden sm:block"></span>
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
              Price <span className="text-[#2b2b2b]">{formattedPrice}</span>
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

        {/* Bidders Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center pl-2">
              {bidderAvatars.length > 0 ? (
                bidderAvatars.map((bidder, index) => (
                  <div
                    key={bidder.id}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white relative bg-gray-200 overflow-hidden ${index > 0 ? "-ml-2 sm:-ml-3" : ""}`}
                  >
                    <Image
                      src={
                        bidder.avatar || `/images/bidder${(index % 4) + 1}.png`
                      } // Fallback to existing logic if no avatar
                      alt={bidder.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No bids yet</p>
              )}
            </div>
            {remainingBidders > 0 && (
              <p className="font-montserrat font-normal text-xs sm:text-sm text-[#2b2b2b]">
                + {remainingBidders} others have bidden
              </p>
            )}
            {bidderAvatars.length > 0 && remainingBidders === 0 && (
              <p className="font-montserrat font-normal text-xs sm:text-sm text-[#2b2b2b]">
                have bidden
              </p>
            )}
          </div>
          <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#2b2b2b] hidden sm:block"></span>

          {/* Leading Bidder */}
          {leadingBidder ? (
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
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative rounded-full overflow-hidden">
                  <Image
                    src={leadingBidder.avatar || "/images/leadbidder.png"}
                    alt="Bidder"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
                {leadingBidder.name}:{" "}
                <span className="text-[#2b2b2b]">₦{leadingBidder.amount}</span>
              </p>
            </div>
          ) : (
            <p className="font-montserrat font-normal text-xs sm:text-sm text-[#808080]">
              Be the first to bid!
            </p>
          )}
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
