"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "@/icons/Icons";
import { OrderListCard } from "./_components/OrderListCard";
import { OrderTrackingMap } from "./_components/OrderTrackingMap";
import { TransporterInfoPanel } from "./_components/TransporterInfoPanel";
import { PackagesPanel } from "./_components/PackagesPanel";
import {
  OrderListSkeleton,
  TrackingDetailSkeleton,
} from "./_components/OrderListSkeleton";
import type {
  TrackOrder,
  TrackOrderPackage,
  TrackOrderStatus,
} from "./_components/trackOrdersData";
import { useOrders } from "@/hooks/queries/useOrderQueries";
import type { OrderRecord } from "@/services/OrderService";

type ApiObject = Record<string, unknown>;

const asObject = (v: unknown): ApiObject =>
  v && typeof v === "object" ? (v as ApiObject) : {};

const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

const asString = (v: unknown, fallback = "—"): string =>
  typeof v === "string" && v ? v : fallback;

const asNumber = (v: unknown, fallback = 0): number =>
  typeof v === "number" ? v : fallback;

const formatDateShort = (iso?: unknown): string => {
  if (typeof iso !== "string" || !iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const TRANSPORT_STATUS_TO_TRACK: Record<string, TrackOrderStatus> = {
  pending: "pending",
  picked: "picked",
  on_transit: "on_transit",
  in_transit: "on_transit",
  delivered: "delivered",
};

const mapTransportStatus = (s: unknown): TrackOrderStatus => {
  const v = (typeof s === "string" ? s : "").toLowerCase();
  return TRANSPORT_STATUS_TO_TRACK[v] ?? "pending";
};

const orderToTrackOrder = (raw: OrderRecord): TrackOrder => {
  const o = raw as ApiObject;
  const id = asString(o._id ?? o.id, "");
  const transporter = asObject(o.transporter);
  const fleet = asObject(o.fleet ?? o.truck);
  const products = asArray(o.products);
  const firstLine = asObject(products[0]);
  const firstProduct = asObject(firstLine.product ?? firstLine);
  const productImages = asArray(firstProduct.images);
  const status = mapTransportStatus(o.transportStatus);

  const updatedAt = formatDateShort(o.updatedAt);
  const pickedAt =
    formatDateShort(o.pickedAt) !== "—"
      ? formatDateShort(o.pickedAt)
      : status !== "pending"
        ? updatedAt
        : "—";
  const onTransitAt =
    formatDateShort(o.onTransitAt) !== "—"
      ? formatDateShort(o.onTransitAt)
      : status === "on_transit" || status === "delivered"
        ? updatedAt
        : "—";
  const deliveredAt =
    formatDateShort(o.deliveredAt) !== "—"
      ? formatDateShort(o.deliveredAt)
      : status === "delivered"
        ? updatedAt
        : "—";

  return {
    id,
    transporter: {
      name: asString(transporter.name ?? transporter.businessName, "Transporter"),
      logo: asString(transporter.logo ?? transporter.image, "/images/truckcontainer.png"),
      rating: asNumber(transporter.rating, 4),
      avatar: asString(transporter.avatar ?? transporter.image, "/images/profileSettingImage.png"),
      company: asString(transporter.company ?? transporter.businessName ?? transporter.name, "Goddess corporation"),
      location: asString(transporter.location, asString(firstLine.localTransportFrom, "—")),
      yearsOfService: asNumber(transporter.yearsOfService, 0),
      followers: asNumber(transporter.followers, 0),
      ratingLabel: asString(transporter.ratingLabel, "—"),
    },
    fleet: {
      name: asString(fleet.fleetName ?? fleet.name ?? fleet.plateNumber, "—"),
      iot: asString(fleet.iot ?? fleet.plateNumber, "—"),
      image: asString(
        fleet.image ?? asArray(fleet.images)[0],
        "/images/truckcontainer.png",
      ),
    },
    product: {
      name: asString(firstProduct.name, "—"),
      id: asString(firstProduct._id ?? firstProduct.id, "—"),
      image: asString(productImages[0], "/images/foodTracked.png"),
    },
    status,
    pickedAt,
    onTransitAt,
    deliveredAt,
    estDeliveryDate: formatDateShort(o.estDeliveryDate),
    fromLocation: asString(
      o.fromLocation ?? firstLine.localTransportFrom,
      "—",
    ),
    toLocation: asString(
      o.toLocation ?? firstLine.localTransportTo ?? o.address,
      "—",
    ),
    packages: products.map((p, i): TrackOrderPackage => {
      const line = asObject(p);
      const prod = asObject(line.product ?? line);
      const imgs = asArray(prod.images);
      return {
        id: asString(line._id ?? prod._id ?? `pkg-${i}`, `pkg-${i}`),
        productId: asString(prod._id ?? prod.id, "—"),
        name: asString(prod.name, "—"),
        image: asString(imgs[0], "/images/foodTracked.png"),
        description: asString(prod.description, ""),
      };
    }),
  };
};

type TabKey = "new" | "picked" | "on_transit" | "delivered";

const TABS: { key: TabKey; label: string; status: TrackOrderStatus }[] = [
  { key: "new", label: "New", status: "pending" },
  { key: "picked", label: "Picked", status: "picked" },
  { key: "on_transit", label: "On transit", status: "on_transit" },
  { key: "delivered", label: "Delivered", status: "delivered" },
];

export default function BuyerTrackOrdersPage() {
  const { data: ordersRaw, isLoading } = useOrders();
  const [activeTab, setActiveTab] = useState<TabKey>("new");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    new: null,
    picked: null,
    on_transit: null,
    delivered: null,
  });
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  useEffect(() => {
    const update = () => {
      const active = tabRefs.current[activeTab];
      const container = tabsContainerRef.current;
      if (active && container) {
        const cRect = container.getBoundingClientRect();
        const tRect = active.getBoundingClientRect();
        setIndicatorStyle({ left: tRect.left - cRect.left, width: tRect.width });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeTab]);

  // Only orders that are paid have a meaningful transport state
  const trackOrders: TrackOrder[] = useMemo(() => {
    if (!Array.isArray(ordersRaw)) return [];
    return ordersRaw
      .filter((o) => (o as ApiObject).status === "paid")
      .map(orderToTrackOrder)
      .filter((o) => !!o.id);
  }, [ordersRaw]);

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      new: 0,
      picked: 0,
      on_transit: 0,
      delivered: 0,
    };
    for (const o of trackOrders) {
      const tab = TABS.find((t) => t.status === o.status);
      if (tab) counts[tab.key]++;
    }
    return counts;
  }, [trackOrders]);

  const filteredOrders = useMemo(() => {
    const targetStatus = TABS.find((t) => t.key === activeTab)!.status;
    const q = searchQuery.toLowerCase();
    return trackOrders
      .filter((o) => o.status === targetStatus)
      .filter((o) => {
        if (!q) return true;
        return [
          o.id,
          o.transporter.name,
          o.transporter.company,
          o.fleet.name,
          o.fleet.iot,
          o.product.name,
          o.product.id,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
  }, [trackOrders, activeTab, searchQuery]);

  useEffect(() => {
    if (filteredOrders.length === 0) {
      if (selectedId) setSelectedId("");
      return;
    }
    const stillVisible = filteredOrders.some((o) => o.id === selectedId);
    if (!stillVisible) setSelectedId(filteredOrders[0].id);
  }, [filteredOrders, selectedId]);

  const selectedOrder = useMemo(
    () => trackOrders.find((o) => o.id === selectedId) ?? null,
    [trackOrders, selectedId],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex flex-col gap-3 bg-[#fefefe] rounded-[10px] p-4 shadow-sm">
        <h1 className="font-montserrat font-medium text-[16px] sm:text-[18px] text-[#2b2b2b] text-center">
          Order Tracking
        </h1>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#e2e2e2] rounded-[6px] text-sm focus:outline-none focus:ring-1 focus:ring-[#538e53] placeholder:text-[#808080] placeholder:text-[12px] font-montserrat"
            aria-label="Search orders"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon stroke="#808080" className="w-4 h-4" />
          </div>
        </div>

        <div
          ref={tabsContainerRef}
          className="relative flex items-center gap-5 border-b border-[#e2e2e2]"
          role="tablist"
          aria-label="Track orders tabs"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[tab.key] = el;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1 py-2 font-montserrat text-[13px] font-medium cursor-pointer ${
                  isActive ? "text-[#538e53]" : "text-[#2b2b2b]"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] font-montserrat font-medium rounded-[4px] px-[5px] py-[1px] min-w-[18px] flex items-center justify-center ${
                    isActive
                      ? "bg-[#538e53] text-[#fefefe]"
                      : "bg-[#f1f1f1] text-[#2b2b2b]"
                  }`}
                >
                  {tabCounts[tab.key]}
                </span>
              </button>
            );
          })}
          <motion.div
            className="absolute -bottom-[1px] h-[3px] rounded-t-[4px] bg-[#538e53]"
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>

        <div className="flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1">
          {isLoading ? (
            <OrderListSkeleton cards={3} />
          ) : filteredOrders.length === 0 ? (
            <div className="py-10 text-center font-montserrat text-sm text-[#808080]">
              No orders in this status.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderListCard
                key={order.id}
                order={order}
                selected={order.id === selectedOrder?.id}
                onSelect={setSelectedId}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <TrackingDetailSkeleton />
        ) : selectedOrder ? (
          <>
            <OrderTrackingMap order={selectedOrder} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TransporterInfoPanel order={selectedOrder} />
              <PackagesPanel order={selectedOrder} />
            </div>
          </>
        ) : (
          <div className="bg-[#fefefe] rounded-[10px] p-10 text-center font-montserrat text-sm text-[#808080] shadow-sm">
            Select an order to view tracking details.
          </div>
        )}
      </div>
    </div>
  );
}
