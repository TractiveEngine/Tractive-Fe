"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SearchIcon, StarIcon, YellowStarIcon } from "@/icons/Icons";
import { PhoneCall, TickIcon } from "./Icons/TransporterIcons";
import { CreateFleetTripModal } from "./CreateFleetTripModal";
import {
  useFleetTrips,
  useFleetTripTracking,
  useUpdateFleetTripStatus,
} from "@/hooks/queries/useTransporterQueries";
import {
  FleetTripStatus,
  FleetTripSummary,
  FleetTripTracking,
} from "@/services/fleetTripService";

export type BookingTabKey = "new" | "picked" | "on_transit" | "delivered";

interface BookingTripsViewProps {
  defaultTab: BookingTabKey;
  /** Render a single hardcoded reference trip at the top of the list with a
   * "this is dummy data" banner. Useful as a visual reference while the backend
   * is still empty. Remove the prop to drop the dummy entirely. */
  showDummyReference?: boolean;
}

// --- DUMMY REFERENCE DATA — remove together with the `showDummyReference` prop. ---
const DUMMY_TRIP_ID = "__dummy_reference_trip__";

const DUMMY_PACKAGES = [
  { id: "123456789", name: "Coco Yam", image: "/images/yellowPepper.png" },
  { id: "987654321", name: "Potato", image: "/images/yellowPepper.png" },
  { id: "456789123", name: "Plantain", image: "/images/yellowPepper.png" },
];

const DummyTrackingPanel: React.FC = () => {
  return (
    <>
      <div className="w-full h-fit flex flex-col gap-4 bg-[#fefefe] rounded-[10px] shadow-md">
        <Image
          src="/images/trackingMap.png"
          alt="Map"
          width={699}
          height={508}
          className="object-cover w-full h-auto max-h-[400px] sm:max-h-[500px]"
        />
        <div className="relative w-[100%] mx-auto h-[50px] sm:h-[60px]">
          <div className="absolute top-[0.5rem] left-[10%] right-[55%] h-[2px] timeline_dashed_line_m1 border-dashed border-[1px] border-[#808080]" />
          <div className="absolute top-[0.5rem] left-[45%] right-[10%] h-[2px] timeline_dashed_line_m2 border-dashed border-[1px] border-[#808080]" />
          <div className="absolute left-[3%] Picked_Date top-0 flex flex-col gap-1 justify-center items-center">
            <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-4 h-4 z-10">
              <TickIcon />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                Picked
              </span>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                20/04/2025
              </span>
            </div>
          </div>
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
            <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-4 h-4 z-10">
              <TickIcon />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                On Transit
              </span>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                23/04/2025
              </span>
            </div>
          </div>
          <div className="absolute right-[2%] deliveredEST_Date top-0 flex flex-col gap-1 justify-center items-center">
            <div className="flex items-center p-[3px] justify-center rounded-full bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe] w-4 h-4 z-10" />
            <div className="flex flex-col items-center">
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                Delivered
              </span>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                EST date 26/04/2025
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-4 pb-4">
          <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b]">
            From: Umuahia, Abia State
          </span>
          <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b]">
            To: Ikorodu, Lagos State
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 rounded-[8px]">
        <div className="flex ProductBuyer_Details gap-4 w-full">
          <div className="flex flex-col bg-[#fefefe] shadow-md rounded-[10px] p-3 sm:p-4 w-full">
            <h2 className="font-montserrat font-normal text-[12px] sm:text-[14px] mb-2 text-[#2b2b2b]">
              Buyers Information
            </h2>
            <div className="flex flex-col gap-2 items-center justify-center">
              <Image
                src="/images/profileSettingImage.png"
                alt="Buyer avatar"
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
                Goodness corporation
              </span>
              <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
                Abia State
              </span>
              <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#538e53] text-center">
                New Customer
              </span>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-[15px] h-[15px]" />
                <span className="font-montserrat font-normal text-center text-[14px] text-[#2b2b2b]">
                  09034145971
                </span>
              </div>
              <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
                No 24 umuahia street off loko road
              </span>
            </div>
          </div>

          <div className="w-full bg-[#fefefe] shadow-md rounded-[8px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[100%] border-separate border-spacing-y-3 sm:border-spacing-y-0">
                <thead>
                  <tr className="bg-[#fefefe] border-b border-[#e0e0e0]">
                    <th
                      scope="col"
                      className="px-3 py-1 sm:px-2 sm:py-2 text-left font-montserrat font-normal text-[11px] sm:text-[12px] text-[#2b2b2b] border-b-[1px] border-[#e0e0e0]"
                    >
                      Package
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DUMMY_PACKAGES.map((pkg) => (
                    <tr
                      key={pkg.id}
                      className="bg-[#fefefe] border-b border-[#e0e0e0]"
                    >
                      <td className="px-3 py-1 sm:px-2 sm:py-2 text-[10px] sm:text-[11px] font-montserrat font-normal">
                        <div className="flex items-center gap-2">
                          <Image
                            src={pkg.image}
                            alt={pkg.name}
                            width={40}
                            height={24}
                            className="object-cover w-[79px] h-[43px] rounded-[7px]"
                          />
                          <div className="flex flex-col">
                            <span className="truncate text-[12px] sm:text-[13px] font-normal font-montserrat text-[#2b2b2b]">
                              {pkg.name}
                            </span>
                            <span className="truncate text-[12px] sm:text-[13px] font-normal font-montserrat text-[#2b2b2b]">
                              ID:{pkg.id}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// --- END DUMMY REFERENCE DATA ---

interface DummyReferenceCardProps {
  selected: boolean;
  onSelect: () => void;
}

const DummyReferenceCard: React.FC<DummyReferenceCardProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex flex-col gap-3 border-[2px] p-3 sm:p-4 rounded-[10px] transition-colors cursor-pointer ${
        selected ? "border-[#538e53] bg-[#f3f9f3]" : "border-[#538e53]"
      }`}
    >
      <div className="flex flex-col border-[1px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            <Image
              src="/images/GIGM.png"
              alt="GIGM Logo"
              width={50}
              height={35}
              className="object-cover w-10 h-7 sm:w-12 sm:h-8"
            />
            <div className="flex flex-col">
              <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b] truncate">
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
          <span className="cursor-pointer flex items-center gap-[7px] px-4 sm:px-6 py-2 opacity-[0.9] bg-[#538e53] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px]">
            Picked
          </span>
        </div>
      </div>

      <div className="relative w-[100%] mx-auto h-[40px] sm:h-[50px]">
        <div className="absolute top-[0.5rem] left-[10%] right-[55%] h-[2px] timeline_dashed_line_1 border-dashed border-[1px] border-[#808080]" />
        <div className="absolute top-[0.5rem] left-[45%] right-[10%] h-[2px] timeline_dashed_line_2 border-dashed border-[1px] border-[#808080]" />
        <div className="absolute left-[5%] top-0 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe] w-4 h-4 z-10" />
          <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
            Picked
          </span>
        </div>
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe] w-4 h-4 z-10" />
          <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
            On Transit
          </span>
        </div>
        <div className="absolute right-[5%] top-0 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe] w-4 h-4 z-10" />
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
                src="/images/Trucker.png"
                alt="Trucker"
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

          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
              <Image
                src="/images/foodTracked.png"
                alt="Product"
                width={50}
                height={30}
                className="object-cover w-10 h-6 sm:w-12 sm:h-8"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                Tomatoes
              </span>
              <p className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                ID: 2964532561
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

const TAB_TO_STATUS: Record<BookingTabKey, FleetTripStatus> = {
  new: "pending",
  picked: "picked",
  on_transit: "on_transit",
  delivered: "delivered",
};

const TABS: { key: BookingTabKey; label: string }[] = [
  { key: "new", label: "New" },
  { key: "picked", label: "Picked" },
  { key: "on_transit", label: "On Transit" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_ORDER: FleetTripStatus[] = [
  "pending",
  "picked",
  "on_transit",
  "delivered",
];

const NEXT_STATUS: Partial<Record<FleetTripStatus, { to: FleetTripStatus; label: string }>> = {
  pending: { to: "picked", label: "Picked" },
  picked: { to: "on_transit", label: "On Transit" },
  on_transit: { to: "delivered", label: "Delivered" },
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const isReached = (current: FleetTripStatus | undefined, target: FleetTripStatus) => {
  if (!current || current === "cancelled") return false;
  return STATUS_ORDER.indexOf(current) >= STATUS_ORDER.indexOf(target);
};

const tripFleetName = (trip: FleetTripSummary): string => {
  if (trip.fleet && typeof trip.fleet === "object") {
    return trip.fleet.fleetName || trip.fleet.plateNumber || "Fleet";
  }
  return (trip.fleet as string) || "Fleet";
};

const tripFleetIot = (trip: FleetTripSummary): string => {
  if (trip.fleet && typeof trip.fleet === "object") {
    return trip.fleet.iot || trip.fleet.plateNumber || "—";
  }
  return "—";
};

const tripFleetImage = (trip: FleetTripSummary): string => {
  if (trip.fleet && typeof trip.fleet === "object") {
    return (
      trip.fleet.image ||
      (trip.fleet.images && trip.fleet.images[0]) ||
      "/images/Trucker.png"
    );
  }
  return "/images/Trucker.png";
};

const tripPrimaryBuyerName = (trip: FleetTripSummary): string => {
  const first = trip.buyers?.[0];
  return first?.name || "—";
};

const findTimelineDate = (
  tracking: FleetTripTracking | undefined,
  status: FleetTripStatus,
): string | undefined => {
  if (!tracking) return undefined;
  const direct =
    status === "picked"
      ? tracking.pickedAt
      : status === "on_transit"
        ? tracking.onTransitAt
        : status === "delivered"
          ? tracking.deliveredAt
          : undefined;
  if (direct) return direct;
  return tracking.timeline?.find((e) => e.status === status)?.at;
};

interface TripCardProps {
  trip: FleetTripSummary;
  selected: boolean;
  onSelect: () => void;
  onAdvance: () => void;
  isAdvancing: boolean;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  selected,
  onSelect,
  onAdvance,
  isAdvancing,
}) => {
  const status = (trip.status as FleetTripStatus) || "pending";
  const next = NEXT_STATUS[status];
  const picked = isReached(status, "picked");
  const onTransit = isReached(status, "on_transit");
  const delivered = isReached(status, "delivered");
  const buyerName = tripPrimaryBuyerName(trip);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex flex-col gap-3 border-[2px] p-3 sm:p-4 rounded-[10px] transition-colors cursor-pointer ${
        selected ? "border-[#538e53]" : "border-gray-200 hover:border-[#a8c9a8]"
      }`}
    >
      <div className="flex flex-col border-[1px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
              <Image
                src={tripFleetImage(trip)}
                alt="Fleet"
                width={40}
                height={40}
                className="object-cover w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b] truncate">
                {tripFleetName(trip)}
              </span>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#808080]">
                Buyer: {buyerName}
              </span>
            </div>
          </div>
          {next && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (!isAdvancing) onAdvance();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isAdvancing) {
                  e.stopPropagation();
                  onAdvance();
                }
              }}
              aria-disabled={isAdvancing}
              className={`cursor-pointer flex items-center gap-[7px] px-4 sm:px-6 py-2 opacity-[0.9] bg-[#538e53] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors hover:bg-[#467a46] ${
                isAdvancing ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {isAdvancing ? "Updating…" : `Mark ${next.label}`}
            </span>
          )}
        </div>
      </div>

      <div className="relative w-[100%] mx-auto h-[40px] sm:h-[50px]">
        <div className="absolute top-[0.5rem] left-[10%] right-[55%] h-[2px] timeline_dashed_line_1 border-dashed border-[1px] border-[#808080]" />
        <div className="absolute top-[0.5rem] left-[45%] right-[10%] h-[2px] timeline_dashed_line_2 border-dashed border-[1px] border-[#808080]" />
        <div className="absolute left-[5%] top-0 flex flex-col gap-1 justify-center items-center">
          <div
            className={`flex items-center p-[3px] justify-center rounded-full ${
              picked
                ? "bg-[#538e53] text-[#fefefe]"
                : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
            } w-4 h-4 z-10`}
          >
            {picked && <TickIcon />}
          </div>
          <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
            Picked
          </span>
        </div>
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
          <div
            className={`flex items-center p-[3px] justify-center rounded-full ${
              onTransit
                ? "bg-[#538e53] text-[#fefefe]"
                : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
            } w-4 h-4 z-10`}
          >
            {onTransit && <TickIcon />}
          </div>
          <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
            On Transit
          </span>
        </div>
        <div className="absolute right-[5%] top-0 flex flex-col gap-1 justify-center items-center">
          <div
            className={`flex items-center p-[3px] justify-center rounded-full ${
              delivered
                ? "bg-[#538e53] text-[#fefefe]"
                : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
            } w-4 h-4 z-10`}
          >
            {delivered && <TickIcon />}
          </div>
          <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
            Delivered
          </span>
        </div>
      </div>
    </button>
  );
};

interface TrackingPanelProps {
  tripId: string;
}

const TrackingPanel: React.FC<TrackingPanelProps> = ({ tripId }) => {
  const { data: tracking, isLoading } = useFleetTripTracking(tripId, {
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center bg-[#fefefe] rounded-[10px] shadow-md py-16">
        <div className="animate-spin h-8 w-8 border-4 border-[#538e53] border-t-transparent rounded-full" />
      </div>
    );
  }

  const status = tracking?.status as FleetTripStatus | undefined;
  const picked = isReached(status, "picked");
  const onTransit = isReached(status, "on_transit");
  const delivered = isReached(status, "delivered");

  const buyer = tracking?.buyers?.[0];
  const packages = tracking?.packages ?? [];

  return (
    <>
      <div className="w-full h-fit flex flex-col gap-4 bg-[#fefefe] rounded-[10px] shadow-md">
        <Image
          src="/images/trackingMap.png"
          alt="Map"
          width={699}
          height={508}
          className="object-cover w-full h-auto max-h-[400px] sm:max-h-[500px]"
        />
        <div className="relative w-[100%] mx-auto h-[50px] sm:h-[60px]">
          <div className="absolute top-[0.5rem] left-[10%] right-[55%] h-[2px] timeline_dashed_line_m1 border-dashed border-[1px] border-[#808080]" />
          <div className="absolute top-[0.5rem] left-[45%] right-[10%] h-[2px] timeline_dashed_line_m2 border-dashed border-[1px] border-[#808080]" />
          <div className="absolute left-[3%] Picked_Date top-0 flex flex-col gap-1 justify-center items-center">
            <div
              className={`flex items-center p-[3px] justify-center rounded-full ${
                picked
                  ? "bg-[#538e53] text-[#fefefe]"
                  : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
              } w-4 h-4 z-10`}
            >
              {picked && <TickIcon />}
            </div>
            <div className="flex flex-col items-center">
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                Picked
              </span>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                {formatDate(findTimelineDate(tracking, "picked"))}
              </span>
            </div>
          </div>
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
            <div
              className={`flex items-center p-[3px] justify-center rounded-full ${
                onTransit
                  ? "bg-[#538e53] text-[#fefefe]"
                  : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
              } w-4 h-4 z-10`}
            >
              {onTransit && <TickIcon />}
            </div>
            <div className="flex flex-col items-center">
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                On Transit
              </span>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                {formatDate(findTimelineDate(tracking, "on_transit"))}
              </span>
            </div>
          </div>
          <div className="absolute right-[2%] deliveredEST_Date top-0 flex flex-col gap-1 justify-center items-center">
            <div
              className={`flex items-center p-[3px] justify-center rounded-full ${
                delivered
                  ? "bg-[#538e53] text-[#fefefe]"
                  : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
              } w-4 h-4 z-10`}
            >
              {delivered && <TickIcon />}
            </div>
            <div className="flex flex-col items-center">
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                Delivered
              </span>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                {delivered
                  ? formatDate(findTimelineDate(tracking, "delivered"))
                  : `EST ${formatDate(tracking?.estDeliveryDate)}`}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-4 pb-4">
          <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b]">
            From: {tracking?.fromLocation || "—"}
          </span>
          <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b]">
            To: {tracking?.toLocation || "—"}
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 rounded-[8px]">
        <div className="flex ProductBuyer_Details gap-4 w-full">
          <div className="flex flex-col bg-[#fefefe] shadow-md rounded-[10px] p-3 sm:p-4 w-full">
            <h2 className="font-montserrat font-normal text-[12px] sm:text-[14px] mb-2 text-[#2b2b2b]">
              Buyers Information
            </h2>
            <div className="flex flex-col gap-2 items-center justify-center">
              <Image
                src={buyer?.avatar || "/images/profileSettingImage.png"}
                alt="Buyer avatar"
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
                {buyer?.name || "—"}
              </span>
              {buyer?.phone && (
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-[15px] h-[15px]" />
                  <span className="font-montserrat font-normal text-center text-[14px] text-[#2b2b2b]">
                    {buyer.phone}
                  </span>
                </div>
              )}
              {buyer?.address && (
                <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
                  {buyer.address}
                </span>
              )}
            </div>
          </div>

          <div className="w-full bg-[#fefefe] shadow-md rounded-[8px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[100%] border-separate border-spacing-y-3 sm:border-spacing-y-0">
                <thead>
                  <tr className="bg-[#fefefe] border-b border-[#e0e0e0]">
                    <th
                      scope="col"
                      className="px-3 py-1 sm:px-2 sm:py-2 text-left font-montserrat font-normal text-[11px] sm:text-[12px] text-[#2b2b2b] border-b-[1px] border-[#e0e0e0]"
                    >
                      Package
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {packages.length === 0 ? (
                    <tr>
                      <td className="px-3 py-3 text-center font-montserrat text-[11px] text-[#808080]">
                        No packages
                      </td>
                    </tr>
                  ) : (
                    packages.map((pkg) => {
                      const id = (pkg._id || pkg.id || pkg.productId || "") as string;
                      return (
                        <tr key={id} className="bg-[#fefefe] border-b border-[#e0e0e0]">
                          <td className="px-3 py-1 sm:px-2 sm:py-2 text-[10px] sm:text-[11px] font-montserrat font-normal">
                            <div className="flex items-center gap-2">
                              <Image
                                src={pkg.image || "/images/foodTracked.png"}
                                alt={pkg.name || "Package"}
                                width={40}
                                height={24}
                                className="object-cover w-[79px] h-[43px] rounded-[7px]"
                              />
                              <div className="flex flex-col">
                                <span className="truncate text-[12px] sm:text-[13px] font-normal font-montserrat text-[#2b2b2b]">
                                  {pkg.name || "—"}
                                </span>
                                <span className="truncate text-[12px] sm:text-[13px] font-normal font-montserrat text-[#2b2b2b]">
                                  ID: {pkg.productId || id}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const BookingTripsView: React.FC<BookingTripsViewProps> = ({
  defaultTab,
  showDummyReference,
}) => {
  const [activeTab, setActiveTab] = useState<BookingTabKey>(defaultTab);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>(
    { left: 0, width: 0 },
  );

  const { data: trips, isLoading } = useFleetTrips({
    status: TAB_TO_STATUS[activeTab],
  });

  const tripsList: FleetTripSummary[] = useMemo(
    () => (Array.isArray(trips) ? trips : []),
    [trips],
  );

  const filteredTrips = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tripsList;
    return tripsList.filter((t) =>
      [
        tripFleetName(t),
        tripFleetIot(t),
        tripPrimaryBuyerName(t),
        (t._id as string) || (t.id as string) || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [tripsList, searchQuery]);

  // Auto-select first trip when the list updates.
  // The dummy reference card counts as a valid selection too — don't bounce off it.
  useEffect(() => {
    if (showDummyReference && selectedTripId === DUMMY_TRIP_ID) return;
    if (filteredTrips.length === 0) {
      setSelectedTripId(null);
      return;
    }
    const stillVisible =
      selectedTripId &&
      filteredTrips.some(
        (t) => (t._id || t.id) === selectedTripId,
      );
    if (!stillVisible) {
      const first = filteredTrips[0];
      setSelectedTripId((first._id || first.id) as string);
    }
  }, [filteredTrips, selectedTripId, showDummyReference]);

  // Animated tab underline
  useEffect(() => {
    const update = () => {
      const idx = TABS.findIndex((t) => t.key === activeTab);
      const tab = tabRefs.current[idx];
      const container = containerRef.current;
      if (tab && container) {
        const cRect = container.getBoundingClientRect();
        const tRect = tab.getBoundingClientRect();
        setIndicatorStyle({ left: tRect.left - cRect.left, width: tRect.width });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeTab]);

  const { mutate: updateStatus, isPending: isAdvancing, variables: advanceVars } =
    useUpdateFleetTripStatus();

  const handleAdvance = (trip: FleetTripSummary) => {
    const id = (trip._id || trip.id) as string;
    const status = (trip.status as FleetTripStatus) || "pending";
    const next = NEXT_STATUS[status];
    if (!id || !next) return;
    updateStatus({ tripId: id, payload: { status: next.to } });
  };

  return (
    <div className="w-full bg-[#f1f1f1] mb-[2rem]">
      <div className="w-[95%] mx-auto flex flex-col tracking_timeline_container gap-2 sm:gap-4">
        {/* Left column: list */}
        <div className="w-full flex flex-col gap-4 bg-[#fefefe] pt-4 rounded-[10px]">
          <div className="flex items-center justify-between gap-2 px-3 sm:px-4">
            <div className="flex-1" />
            <h2 className="font-montserrat text-center font-medium text-[17px] sm:text-[20px] text-[#2b2b2b]">
              Order Tracking
            </h2>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 bg-[#538e53] text-[#fefefe] text-[11px] sm:text-[12px] font-montserrat rounded-[4px] hover:bg-[#467a46] whitespace-nowrap"
              >
                Create Trip
              </button>
            </div>
          </div>

          <div className="relative w-full px-2 sm:px-4">
            <input
              type="text"
              placeholder="Search by buyer, fleet or IOT"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-[#f1f1f1] text-[#2b2b2b] rounded-[4px] text-[12px] sm:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2B9B1E] placeholder:text-[#2b2b2b] placeholder:text-[12px] sm:placeholder:text-[14px] placeholder:font-montserrat placeholder:font-normal"
              aria-label="Search trips"
            />
            <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2">
              <SearchIcon stroke="#808080" className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div
              className="relative flex items-center gap-1 sm:gap-5 mb-2 flex-nowrap px-2 sm:px-4"
              ref={containerRef}
              role="tablist"
            >
              {TABS.map((tab, idx) => (
                <button
                  key={tab.key}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  role="tab"
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-[14px] font-medium cursor-pointer p-3 pb-0 sm:text-base flex-shrink-0 ${
                    activeTab === tab.key ? "text-[#538e53]" : "text-[#2b2b2b]"
                  }`}
                  aria-selected={activeTab === tab.key}
                >
                  {tab.label}
                </button>
              ))}
              <motion.div
                className="absolute -bottom-[0.5rem] rounded-t-[10px] h-[3.7px] bg-[#538e53]"
                animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
            <div className="w-full h-[1px] bg-[#e2e2e2]" />
          </div>

          <div className="flex flex-col gap-3 px-3 sm:px-4 pb-4">
            {showDummyReference && (
              <>
                <DummyReferenceCard
                  selected={selectedTripId === DUMMY_TRIP_ID}
                  onSelect={() => setSelectedTripId(DUMMY_TRIP_ID)}
                />
                <div className="text-center text-[11px] sm:text-[12px] font-montserrat font-medium text-[#b45309] bg-[#fef3c7] border border-dashed border-[#f59e0b] rounded-[6px] py-2 px-3">
                  ↑ This is dummy data — actual data is below ↓
                </div>
              </>
            )}
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-[#538e53] border-t-transparent rounded-full" />
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="py-10 text-center font-montserrat text-sm text-[#808080]">
                No trips in this status.
              </div>
            ) : (
              filteredTrips.map((trip) => {
                const id = (trip._id || trip.id) as string;
                const advancing =
                  isAdvancing && advanceVars?.tripId === id;
                return (
                  <TripCard
                    key={id}
                    trip={trip}
                    selected={selectedTripId === id}
                    onSelect={() => setSelectedTripId(id)}
                    onAdvance={() => handleAdvance(trip)}
                    isAdvancing={advancing}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right column: tracking + buyer + packages */}
        <div className="flex flex-col mapProductTransport_Details gap-2 sm:gap-4 w-full">
          {selectedTripId === DUMMY_TRIP_ID ? (
            <DummyTrackingPanel />
          ) : selectedTripId ? (
            <TrackingPanel tripId={selectedTripId} />
          ) : (
            <div className="w-full flex items-center justify-center bg-[#fefefe] rounded-[10px] shadow-md py-16 font-montserrat text-sm text-[#808080]">
              Select a trip to view tracking details.
            </div>
          )}
        </div>
      </div>

      <CreateFleetTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};
