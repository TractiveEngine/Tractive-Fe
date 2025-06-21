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
import {
  MessageOutline,
  PhoneCall,
  TickIcon,
} from "../../../_components/Icons/AgentIcons";

interface TrackingHistory {
  id: string;
  status: string;
  date: string;
  description: string;
}

// Mock tracking history for search functionality
const mockTrackingHistory: TrackingHistory[] = [
  {
    id: "1",
    status: "Order Placed",
    date: "01/09/2025",
    description: "Order confirmed by seller",
  },
  {
    id: "2",
    status: "Processing",
    date: "02/09/2025",
    description: "Order being prepared for shipment",
  },
  {
    id: "3",
    status: "Shipped",
    date: "03/09/2025",
    description: "Order shipped from warehouse",
  },
  {
    id: "4",
    status: "In Transit",
    date: "04/09/2025",
    description: "Order in transit to destination",
  },
  {
    id: "5",
    status: "Delivered",
    date: "05/09/2025",
    description: "Order delivered to buyer",
  },
];

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

const skeletonVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  pulse: {
    opacity: [0.6, 1, 0.6],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  },
};

export default function TrackOrderPage() {
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
      // Add 5-second delay for testing loader and skeleton
      setTimeout(() => {
        setProduct(foundProduct || null);
        setLoading(false);
      }, 5000);
    }
  }, [productId]);

  const filteredTrackingHistory = mockTrackingHistory.filter(
    (entry) =>
      entry.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.date.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="w-[95%] mx-auto p-6 bg-[#fefefe] rounded-[10px] shadow-md">
        {/* Loader */}
        <div className="flex justify-center items-center h-[20vh]">
          <motion.div
            className="w-12 h-12 border-4 border-t-[#538e53] border-gray-200 rounded-full"
            variants={loaderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="status"
            aria-label="Loading product details"
          />
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="w-[95%] mx-auto p-6 bg-[#f1f1f1]">
      <div className="flex flex-col gap-4 bg-[#fefefe] p-4 rounded-[10px] shadow-md">
        <div className="flex items-center gap-[5rem] mr-auto">
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/agents/delivered")}
            aria-label="Go back to produce list"
          >
            <ArrowLeftIcon stroke="#538e53" className="w-[0.8rem] h-[0.8rem]" />
            <span className="font-montserrat font-normal text-[12px] text-[#538e53]">
              Back
            </span>
          </button>
          <h2 className="font-montserrat font-medium text-[16px] text-[#2b2b2b]">
            Order Tracking
          </h2>
        </div>
        <div className="relative w-[100%] flex-grow">
          <input
            type="text"
            placeholder="Search for chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 bg-[#f1f1f1] text-[#2b2b2b] rounded-[4px] text-[12px] sm:text-[13px] focus:outline-none sm:h-[40px] focus:ring-[#2B9B1E] placeholder:text-[#2b2b2b] placeholder:text-[13px] sm:placeholder:text-[13px] placeholder:font-montserrat placeholder:font-normal"
            aria-label="Search for chat"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SearchIcon stroke="#808080" className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-[0.8rem] border-[2px] p-5 rounded-[10px] border-[#538e53] focus:outline-none focus:ring-[#2B9B1E]">
            <div className="flex flex-col border-[1px] p-4 rounded-[10px] border-[#538e53]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/images/GIGM.png"
                    alt="GIGM Logo"
                    width={67}
                    height={47}
                    className="object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-montserrat font-medium text-[14px] text-[#2b2b2b]">
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
                      <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                        4.0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 p-2 border-[#808080] border-[1px] rounded-[100px]">
                    <PhoneCall />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 p-2 border-[#808080] border-[1px] rounded-[100px]">
                    <MessageOutline />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between w-[90%] mx-auto">
              <div className="flex flex-col gap-2 justify-center items-center">
                <div className="flex items-center p-[3px] justify-center rounded-[100px] bg-[#538e53] text-[#fefefe] w-4 h-4">
                  <TickIcon />
                </div>
                <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
                  Picked
                </span>
              </div>

              <div className="flex-1 h-[2px] border-dashed border-[1px] border-[#808080] mt-[0.49rem]"></div>

              <div className="flex flex-col gap-2 justify-center items-center">
                <div className="flex items-center p-[3px] justify-center rounded-[100px] bg-[#538e53] text-[#fefefe] w-4 h-4">
                  <TickIcon />
                </div>
                <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
                  On Transit
                </span>
              </div>

              <div className="flex-1 h-[2px] border-dashed border-[1px] border-[#808080] mt-[0.49rem]"></div>

              <div className="flex flex-col gap-2 justify-center items-center">
                <div className="flex items-center p-[3px] justify-center rounded-[100px] border-[1px] border-[#808080] text-[#fefefe] w-4 h-4">
                  {/* <TickIcon /> */}
                </div>
                <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
                  Delivered
                </span>
              </div>
            </div>

            <div className="flex flex-col border-[1px] p-4 rounded-[10px] border-[#538e53]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-[73px] h-[48px] p-2 bg-[#CCE5CC] rounded-[4px]">
                    <Image
                      src="/images/Trucker.png"
                      alt="Trucker Image"
                      width={45}
                      height={45}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-montserrat font-medium text-[14px] text-[#2b2b2b]">
                      Mack4567
                    </span>
                    <p className="font-montserrat font-medium text-[14px] text-[#2b2b2b]">
                      IOT: 5677666655
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-[73px] h-[48px] p-2 bg-[#CCE5CC] rounded-[4px]">
                    <Image
                      src={product.image}
                      alt="product Image"
                      width={73}
                      height={47}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-montserrat font-medium text-[14px] text-[#2b2b2b]">
                      {product.name}
                    </span>
                    <p className="font-montserrat font-medium text-[14px] text-[#2b2b2b]">
                      ID: {product.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
