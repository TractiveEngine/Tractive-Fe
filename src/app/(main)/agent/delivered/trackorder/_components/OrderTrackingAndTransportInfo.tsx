"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import type { TrackOrder } from "@/app/(main)/buyer/(account)/track-orders/_components/trackOrdersData";
import "../TrackOrder.css";

const NA = "N/A";

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) =>
        i < Math.round(rating) ? (
          <YellowStarIcon key={i} />
        ) : (
          <StarIcon key={i} />
        ),
      )}
    </div>
    <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
      {rating.toFixed(1)}
    </span>
  </div>
);

const StepDot = ({ active }: { active: boolean }) => (
  <div
    className={`flex items-center p-[3px] justify-center rounded-full w-4 h-4 z-10 ${
      active
        ? "bg-[#538e53] text-[#fefefe]"
        : "bg-[#fefefe] border-[1px] border-[#808080]"
    }`}
  >
    {active && <TickIcon />}
  </div>
);

interface Props {
  order: TrackOrder;
}

export const OrderTrackingAndTransportInfo = ({ order }: Props) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const t = order.transporter;
  const picked = ["picked", "on_transit", "delivered"].includes(order.status);
  const onTransit = ["on_transit", "delivered"].includes(order.status);
  const delivered = order.status === "delivered";

  const companyName = t.name !== NA ? t.name : "Transporter not assigned";
  const logoSrc = t.logo !== NA ? t.logo : t.avatar;

  return (
    <div className="w-full flex flex-col gap-4 bg-[#fefefe] p-3 sm:p-4 rounded-[10px] shadow-md h-fit">
      {/* Updated header container */}
      <div className="flex items-center justify-between relative">
        <button
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => router.push("/agent/delivered")}
          aria-label="Go back to produce list"
        >
          <ArrowLeftIcon stroke="#538e53" className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-montserrat font-normal text-[11px] sm:text-[12px] text-[#538e53]">
            Back
          </span>
        </button>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 font-montserrat font-medium text-[14px] sm:text-[16px] text-[#2b2b2b]">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <Image
                  src={logoSrc}
                  alt={`${companyName} logo`}
                  width={50}
                  height={35}
                  className="object-cover w-10 h-7 sm:w-12 sm:h-8 rounded-[4px]"
                />
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b]">
                    {companyName}
                  </span>
                  <Stars rating={t.rating} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 p-2 border-[#808080] border-[1px] rounded-full cursor-pointer">
                  <PhoneCall />
                </div>
                <div className="flex items-center justify-center w-8 h-8 p-2 border-[#808080] border-[1px] rounded-full cursor-pointer">
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
              <StepDot active={picked} />
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                Picked
              </span>
            </div>
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
              <StepDot active={onTransit} />
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                On Transit
              </span>
            </div>
            <div className="absolute right-[5%] top-0 flex flex-col gap-1 justify-center items-center">
              <StepDot active={delivered} />
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                Delivered
              </span>
            </div>
          </div>
          <div className="flex flex-col border-[1px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
                  <Image
                    src={order.fleet.image}
                    alt="Fleet vehicle"
                    width={40}
                    height={40}
                    className="object-cover w-8 h-8 sm:w-10 sm:h-10"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    {order.fleet.name}
                  </span>
                  <p className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    IOT: {order.fleet.iot}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
                  <Image
                    src={order.product.image}
                    alt={order.product.name}
                    width={50}
                    height={30}
                    className="object-cover w-10 h-6 sm:w-12 sm:h-8"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    {order.product.name}
                  </span>
                  <p className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    ID: {order.product.id}
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
