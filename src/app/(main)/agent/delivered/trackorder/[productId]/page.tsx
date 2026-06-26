"use client";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapTrackingTimeline } from "../_components/MapTrackingTimeline";
import { OrderTrackingAndTransportInfo } from "../_components/OrderTrackingAndTransportInfo";
import { TransportInfoAndPackageProduct } from "../_components/TransportInfoAndPackageProduct";
import { useOrderDetail } from "@/hooks/queries/useOrderQueries";
import { orderToTrackOrder } from "@/app/(main)/buyer/(account)/track-orders/_components/trackOrdersData";
import "../TrackOrder.css";

export default function TrackOrderPage() {
  const { productId } = useParams();
  const orderId = typeof productId === "string" ? productId : "";

  const { data: record, isLoading, isError } = useOrderDetail(orderId);

  const order = useMemo(
    () => (record ? orderToTrackOrder(record) : null),
    [record],
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#f1f1f1]">
        <motion.div
          className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-[#538e53] border-gray-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          role="status"
          aria-label="Loading order tracking"
        />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-2 bg-[#f1f1f1] px-4 text-center">
        <p className="font-montserrat font-medium text-[14px] text-[#2b2b2b]">
          We couldn&apos;t load this order&apos;s tracking details.
        </p>
        <p className="font-montserrat font-normal text-[12px] text-[#808080]">
          The order may have been removed, or it isn&apos;t available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f1f1f1] mb-[2rem]">
      <div className="w-[95%] mx-auto flex flex-col tracking_timeline_container gap-2 sm:gap-4">
        <OrderTrackingAndTransportInfo order={order} />
        <div className="flex flex-col mapProductTransport_Details gap-2 sm:gap-4 w-full">
          <MapTrackingTimeline order={order} />
          <TransportInfoAndPackageProduct order={order} />
        </div>
      </div>
    </div>
  );
}
