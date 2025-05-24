"use client";
import { useParams } from "next/navigation";
import ImagePreviewBooking from "../../_components/BookingTransport/BookingHeader/ImagePreviewBooking";
import { OwnersInfo } from "../../_components/BookingTransport/TruckAndOwnerInfo/OwnersInfo";
import { SimilarFleet } from "../../_components/BookingTransport/TruckAndOwnerInfo/SimilarFleet";
import { TruckInfo } from "../../_components/BookingTransport/TruckAndOwnerInfo/TruckInfo";
import { TruckShowCase } from "../../_components/BookingTransport/TruckShowCase";
import { TruckData } from "@/utils/TruckData";
import { useState } from "react";

const BookingTransport: React.FC = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isNegotiating, setIsNegotiating] = useState(false);
 // Get the truck ID from the URL
  const truckItem = TruckData.find((truck) => truck.id === id) || {
    ...TruckData[0],
    rating: String(TruckData[0].rating),
  }; // Fallback to first truck if not found

  return (
    <div className="w-[90%] mx-auto py-6 flex flex-col gap-3.5">
      <ImagePreviewBooking
        item={truckItem}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isNegotiating={isNegotiating}
        setIsNegotiating={setIsNegotiating}
      />
      <TruckShowCase />
      <div className="flex flex-col mb-4 lg:flex-row gap-4 w-full">
        <TruckInfo item={{ ...truckItem, rating: String(truckItem.rating) }} />
        <OwnersInfo />
      </div>
      <SimilarFleet />
    </div>
  );
};

export default BookingTransport;
