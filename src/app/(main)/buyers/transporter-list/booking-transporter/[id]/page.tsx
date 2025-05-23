"use client";
import ImagePreviewBooking from "../../_components/BookingTransport/BookingHeader/ImagePreviewBooking";
import { OwnersInfo } from "../../_components/BookingTransport/TruckAndOwnerInfo/OwnersInfo";
import { SimilarFleet } from "../../_components/BookingTransport/TruckAndOwnerInfo/SimilarFleet";
import { TruckInfo } from "../../_components/BookingTransport/TruckAndOwnerInfo/TruckInfo";
import { TruckShowCase } from "../../_components/BookingTransport/TruckShowCase";
import { TruckData } from "../../_components/TransporterProfile/AlmostFullTruck";
import { useState } from "react";

const BookingTransport: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const truckItem = { ...TruckData[0], rating: Number(TruckData[0].rating) }; // Ensure rating is a number

  return (
    <div className="w-[90%] mx-auto py-6 flex flex-col gap-3.5">
      <ImagePreviewBooking
        item={truckItem}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <TruckShowCase />
      <div className="flex flex-col mb-4 lg:flex-row gap-4 w-full">
        <TruckInfo item={truckItem} />
        <OwnersInfo />
      </div>

      <SimilarFleet />
    </div>
  );
};

export default BookingTransport;
