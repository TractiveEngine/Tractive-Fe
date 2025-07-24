"use client";
import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { DeliveredProductData, Product } from "@/utils/ProductData";
import Image from "next/image";
import {
  ArrowLeftIcon,
  SearchIcon,
  StarIcon,
  YellowStarIcon,
} from "@/icons/Icons";
import "../TrackOrder.css"; // Ensure this CSS file is imported for styles
import { MessageOutline, PhoneCall, TickIcon } from "../../_components/Icons/TransporterIcons";

const loaderVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
      rotate: { repeat: Infinity, duration: 1, ease: "linear" },
    },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

export const OrderTrackingAndTransportInfo = () => {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (typeof productId === "string") {
      const foundProduct = DeliveredProductData.find((p) => p.id === productId);
      if (!foundProduct) {
        notFound();
      }
      setTimeout(() => {
        setProduct(foundProduct || null);
        setLoading(false);
      }, 5000);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center mx-auto p-4 sm:p-6 ">
        <motion.div
          className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-[#538e53] border-gray-200 rounded-full"
          variants={loaderVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          role="status"
          aria-label="Loading product details"
        />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col gap-4 bg-[#fefefe] p-3 sm:p-4 rounded-[10px] shadow-md h-fit">
      <div className="flex items-center gap-4 sm:gap-8 mr-auto">
        <button
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => router.push("/agents/delivered")}
          aria-label="Go back to produce list"
        >
          <ArrowLeftIcon stroke="#538e53" className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-montserrat font-normal text-[11px] sm:text-[12px] text-[#538e53]">
            Back
          </span>
        </button>
        <h2 className="font-montserrat font-medium text-[14px] sm:text-[16px] text-[#2b2b2b]">
          Order Tracking
        </h2>
      </div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search for chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 sm:pl-10 py-1.5 sm:py-2 bg-[#f1f1f1] text-[#2b2b2b] rounded-[4px] text-[11px] sm:text-[13px] focus:outline-none focus:ring-[#2B9B1E] placeholder:text-[#2b2b2b] placeholder:text-[11px] sm:placeholder:text-[13px] placeholder:font-montserrat placeholder:font-normal"
          aria-label="Search for chat"
        />
        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
          <SearchIcon stroke="#808080" className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-3 border-[2px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
          <div className="flex flex-col border-[1px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Image
                  src="/images/GIGM.png"
                  alt="GIGM Logo"
                  width={50}
                  height={35}
                  className="object-cover w-10 h-7 sm:w-12 sm:h-8"
                />
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b]">
                    GIGM Transport Company
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <YellowStarIcon />
                      <YellowStarIcon />
                      <YellowStarIcon />
                      <YellowStarIcon />
                      <StarIcon />
                    </div>
                    <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                      4.0
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 p-2 border-[#808080] border-[1px] rounded-full">
                  <PhoneCall />
                </div>
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 p-2 border-[#808080] border-[1px] rounded-full">
                  <MessageOutline />
                </div>
              </div>
            </div>
          </div>
          {/* Timeline Container */}
          <div className="relative w-[100%] mx-auto h-[40px] sm:h-[50px]">
            <div className="absolute top-[0.5rem] left-[10%] right-[55%] h-[2px] timeline_dashed_line_1 border-dashed border-[1px] border-[#808080]"></div>
            <div className="absolute top-[0.5rem] left-[45%] right-[10%] h-[2px] timeline_dashed_line_2 border-dashed border-[1px] border-[#808080]"></div>
            <div className="absolute left-[5%] top-0 flex flex-col gap-1 justify-center items-center">
              <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-3 h-3 sm:w-4 sm:h-4 z-10">
                <TickIcon />
              </div>
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                Picked
              </span>
            </div>
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
              <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-3 h-3 sm:w-4 sm:h-4 z-10">
                <TickIcon />
              </div>
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                On Transit
              </span>
            </div>
            <div className="absolute right-[5%] top-0 flex flex-col gap-1 justify-center items-center">
              <div className="flex items-center p-[3px] justify-center rounded-full bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe] w-3 h-3 sm:w-4 sm:h-4 z-10"></div>
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                Delivered
              </span>
            </div>
          </div>
          <div className="flex flex-col border-[1px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
                  <Image
                    src="/images/Trucker.png"
                    alt="Trucker Image"
                    width={40}
                    height={40}
                    className="object-cover w-8 h-8 sm:w-10 sm:h-10"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    Mack4567
                  </span>
                  <p className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    IOT: 5677666655
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
                  <Image
                    src={product.image}
                    alt="product Image"
                    width={50}
                    height={30}
                    className="object-cover w-10 h-6 sm:w-12 sm:h-8"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    {product.name}
                  </span>
                  <p className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    ID: {product.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
