"use client";
import { MapTrackingTimeline } from "../_components/MapTrackingTimeline";
import { OrderTrackingAndTransportInfo } from "../_components/OrderTrackingAndTransportInfo";
import { TransportInfoAndPackageProduct } from "../_components/TransportInfoAndPackageProduct";

export default function TrackOrderPage() {
  return (
    <div className="w-[95%] mx-auto p-6 bg-[#f1f1f1] flex gap-4">
      <OrderTrackingAndTransportInfo />
      <div className='flex flex-col gap-2'>
      <MapTrackingTimeline />
      <TransportInfoAndPackageProduct />
      </div>
    </div>
  );
}
