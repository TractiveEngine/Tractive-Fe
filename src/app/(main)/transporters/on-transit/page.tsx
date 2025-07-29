"use client";
import React, { useState } from "react";
import { MapTrackingTimeline } from "./_components/MapTrackingTimeline";
import { TransportInfoAndPackageProduct } from "./_components/TransportInfoAndPackageProduct";
import "./TrackOrder.css";
import { TabTitles } from "./_components/TabTitles";

export default function TrackOrderPage() {
  const [isPicked, setIsPicked] = useState<boolean>(false);
  const [isDelivered, setIsDelivered] = useState<boolean>(false);
  const [isOnTransit, setIsOnTransit] = useState<boolean>(false);

  const handlePickedClick = () => {
    setIsPicked(true);
  };

  const handleTransitClick = () => {
    setIsOnTransit(true);
  };
  const handleDeliveredClick = () => {
    setIsDelivered(true);
  };

  return (
    <div className="w-full bg-[#f1f1f1] mb-[2rem]">
      <div className="w-[95%] mx-auto flex flex-col tracking_timeline_container gap-2 sm:gap-4">
        <TabTitles
          isPicked={isPicked}
          onPickedClick={handlePickedClick}
          isOnTransit={isOnTransit}
          onTransitClick={handleTransitClick}
          isDelivered={isDelivered}
          onDeliveredClick={handleDeliveredClick}
        />
        <div className="flex flex-col mapProductTransport_Details gap-2 sm:gap-4 w-full">
          <MapTrackingTimeline
            isPicked={isPicked}
            isOnTransit={isOnTransit}
            isDelivered={isDelivered}
          />
          <TransportInfoAndPackageProduct />
        </div>
      </div>
    </div>
  );
}
