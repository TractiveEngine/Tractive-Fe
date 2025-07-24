"use client";
import React from "react";
import { MapTrackingTimeline } from "./_components/MapTrackingTimeline";
import { OrderTrackingAndTransportInfo } from "./_components/OrderTrackingAndTransportInfo";
import { TransportInfoAndPackageProduct } from "./_components/TransportInfoAndPackageProduct";
import "../TrackOrder.css";

export default function TrackOrderPage() {
  return (
    <div className="w-full bg-[#f1f1f1] mb-[2rem]">
      <div className="w-[95%] mx-auto flex flex-col tracking_timeline_container gap-2 sm:gap-4">
        <OrderTrackingAndTransportInfo />
        <div className="flex flex-col mapProductTransport_Details gap-2 sm:gap-4 w-full">
          <MapTrackingTimeline />
          <TransportInfoAndPackageProduct />
        </div>
      </div>
    </div>
  );
}
