"use client";
import React, { useState } from "react";
import { usePaidShippingOrders } from "@/hooks/queries/useOrderQueries";
import { OrderRecord } from "@/services/OrderService";
import { Button } from "@/components/Button";
import { OrderCard } from "./OrderCard";
import { EmptyState } from "./EmptyState";

const Spinner = () => (
  <div className="w-full flex justify-center items-center py-12">
    <div className="w-8 h-8 border-4 border-[#538e53] border-t-transparent rounded-full animate-spin" />
  </div>
);

type FilterKey = "all" | "not_moved" | "in_transit" | "delivered";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "not_moved", label: "Not Moved" },
  { key: "in_transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

const normalize = (s?: string) => (s || "").toLowerCase();

const matchesFilter = (order: OrderRecord, filter: FilterKey) => {
  if (filter === "all") return true;
  const ts = normalize(order.transportStatus);
  if (filter === "not_moved") return ts === "not_moved" || ts === "pending" || ts === "parked" || ts === "";
  return ts === filter;
};

export const ShippingList: React.FC = () => {
  const { data, isLoading, isError, refetch } = usePaidShippingOrders();
  const [filter, setFilter] = useState<FilterKey>("all");

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <EmptyState
        title="Couldn't load your shipping orders"
        description="Something went wrong while fetching your shipping orders."
        action={
          <Button
            text="Try again"
            onClick={() => refetch()}
            className="!py-[6px] !px-4 !rounded-[4px] text-[12px]"
          />
        }
      />
    );
  }

  const raw = data as unknown;
  const orders: OrderRecord[] = Array.isArray(raw)
    ? (raw as OrderRecord[])
    : ((raw as { data?: OrderRecord[] })?.data ?? []);
  const visible = orders.filter((o) => matchesFilter(o, filter));

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No shipping orders yet"
        description="Once you pay for both a product and its transporter, you'll be able to track it here."
      />
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-3 py-[6px] font-montserrat text-[12px] rounded-[4px] border whitespace-nowrap transition-colors cursor-pointer ${
              filter === f.key
                ? "bg-[#538e53] text-[#fefefe] border-[#538e53]"
                : "bg-[#fefefe] text-[#2b2b2b] border-[#e2e2e2] hover:bg-[#f5f5f5]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No orders match this filter"
          description="Try a different status or clear the filter."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((order) => (
            <OrderCard
              key={order._id || order.id}
              order={order}
              variant="shipping"
            />
          ))}
        </div>
      )}
    </>
  );
};
