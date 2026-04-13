"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ImagePreviewBooking from "../../_components/BookingTransport/BookingHeader/ImagePreviewBooking";
import { OwnersInfo } from "../../_components/BookingTransport/TruckAndOwnerInfo/OwnersInfo";
import { SimilarFleet } from "../../_components/BookingTransport/TruckAndOwnerInfo/SimilarFleet";
import { TruckInfo } from "../../_components/BookingTransport/TruckAndOwnerInfo/TruckInfo";
import { TruckShowCase } from "../../_components/BookingTransport/TruckShowCase";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useGetTruckById } from "@/hooks/queries/useTransporterQueries";

const BookingTransport: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const truckId = params?.id || null;
  const fleetBidId = searchParams?.get("fleetBidId") || undefined;
  const [currentStep, setCurrentStep] = useState(1);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const truckItem = useAppSelector((state) => state.truck.selectedTruck);
  const { data: apiTruck, isLoading } = useGetTruckById(truckId);

  if (isLoading) {
    return (
      <div className="w-[90%] mx-auto py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-[#538e53] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!truckItem && !apiTruck) {
    return (
      <div className="w-[90%] mx-auto py-20 text-center">
        <p className="text-red-500 font-montserrat">Truck not found or invalid ID</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#538e53] text-white rounded-md cursor-pointer font-montserrat"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Build a merged TruckItem for components that still expect it
  const effectiveTruckItem = truckItem || {
    id: apiTruck!._id,
    image: apiTruck!.image || "",
    images: apiTruck!.images,
    rating: apiTruck!.rating || "0.0",
    truckName: apiTruck!.fleetName,
    amountPerKg: `₦${apiTruck!.pricePerKgEquivalent}`,
    fullLoad: apiTruck!.capacity,
    spaceRemaining: apiTruck!.remainingCapacityDisplay,
    locationFrom: apiTruck!.locationFrom || "",
    locationTo: apiTruck!.locationTo || "",
    fleetDescription: apiTruck!.fleetDescription,
    model: apiTruck!.model,
    size: apiTruck!.size,
    plateNumber: apiTruck!.plateNumber,
    capacityKg: apiTruck!.capacityKg,
    capacity: apiTruck!.capacityKg,
    remainingCapacityKg: apiTruck!.remainingCapacityKg,
    pricePerKg: apiTruck!.pricePerKgEquivalent,
    totalPrice: apiTruck!.price,
  };

  const allImages = effectiveTruckItem.images && effectiveTruckItem.images.length > 0
    ? effectiveTruckItem.images
    : [effectiveTruckItem.image];

  const selectedImage = allImages[selectedImageIndex] || allImages[0];

  return (
    <div className="w-[90%] mx-auto py-6 flex flex-col gap-3.5">
      <ImagePreviewBooking
        item={effectiveTruckItem}
        selectedImage={selectedImage}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isNegotiating={isNegotiating}
        setIsNegotiating={setIsNegotiating}
        fleetBidId={fleetBidId}
      />
      <TruckShowCase
        images={allImages}
        currentIndex={selectedImageIndex}
        onSelect={setSelectedImageIndex}
      />
      <div className="flex flex-col mb-4 lg:flex-row gap-4 w-full">
        <TruckInfo item={effectiveTruckItem} apiTruck={apiTruck} />
        <OwnersInfo />
      </div>
      <SimilarFleet />
    </div>
  );
};

export default BookingTransport;
