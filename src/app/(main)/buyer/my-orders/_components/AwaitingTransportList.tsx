"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransportReadyOrders } from "@/hooks/queries/useOrderQueries";
import { OrderRecord } from "@/services/OrderService";
import { Button } from "@/components/Button";
import { OrderCard } from "./OrderCard";
import { EmptyState } from "./EmptyState";
import { useAppDispatch } from "@/lib/hooks";
import { setPendingTransportOrderIds } from "@/lib/features/pendingTransport/pendingTransportSlice";

const Spinner = () => (
  <div className="w-full flex justify-center items-center py-12">
    <div className="w-8 h-8 border-4 border-[#538e53] border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AwaitingTransportList: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, refetch } = useTransportReadyOrders();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const orders: OrderRecord[] = useMemo(() => {
    const raw = data as unknown;
    if (Array.isArray(raw)) return raw as OrderRecord[];
    return (raw as { data?: OrderRecord[] } | null)?.data ?? [];
  }, [data]);

  const selectedTotal = useMemo(
    () =>
      orders
        .filter((o) => selectedIds.includes(o._id || o.id || ""))
        .reduce((sum, o) => sum + (o.totalAmount ?? 0), 0),
    [orders, selectedIds]
  );

  const allSelected =
    orders.length > 0 && selectedIds.length === orders.length;

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o._id || o.id || "").filter(Boolean));
    }
  };

  const handleBookSelected = () => {
    if (selectedIds.length === 0) return;
    dispatch(setPendingTransportOrderIds(selectedIds));
    router.push(`/buyer/transporter-list?orderIds=${selectedIds.join(",")}`);
  };

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <EmptyState
        title="Couldn't load your orders"
        description="Something went wrong while fetching orders awaiting transport."
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

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders waiting for transport"
        description="After you pay for a product, it will appear here until you book a transporter."
        action={
          <Button
            text="Browse Sellers"
            onClick={() => router.push("/buyer/sellers-list")}
            className="!py-[6px] !px-4 !rounded-[4px] text-[12px]"
          />
        }
      />
    );
  }

  const hasSelection = selectedIds.length > 0;

  return (
    <>
      {hasSelection ? (
        <div className="sticky top-2 z-30 mb-3 bg-[#fefefe] border border-[#538e53] rounded-[6px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <label className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="accent-[#538e53] w-[16px] h-[16px] cursor-pointer"
              />
              <span className="font-montserrat text-[12px] text-[#2b2b2b] whitespace-nowrap">
                {allSelected ? "Unselect all" : "Select all"}
              </span>
            </label>
            <span className="h-5 w-px bg-[#e2e2e2] hidden sm:block" />
            <div className="flex flex-col min-w-0">
              <span className="font-montserrat text-[11px] text-[#808080]">
                {selectedIds.length} order
                {selectedIds.length > 1 ? "s" : ""} selected
              </span>
              <span className="font-montserrat text-[13px] font-semibold text-[#2b2b2b] truncate">
                Subtotal: ₦{selectedTotal.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="font-montserrat text-[12px] text-[#2b2b2b] px-4 py-2 rounded-[4px] border border-[#e2e2e2] hover:bg-[#f5f5f5] cursor-pointer"
            >
              Cancel
            </button>
            <Button
              text={`Book Transport (${selectedIds.length})`}
              onClick={handleBookSelected}
              className="!py-[8px] !px-4 !rounded-[4px] text-[13px]"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 mb-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="accent-[#538e53] w-[16px] h-[16px] cursor-pointer"
            />
            <span className="font-montserrat text-[12px] text-[#2b2b2b]">
              Select all
            </span>
          </label>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const id = order._id || order.id || "";
          return (
            <OrderCard
              key={id}
              order={order}
              variant="awaiting-transport"
              selectable
              selected={selectedIds.includes(id)}
              onToggleSelected={toggleOne}
            />
          );
        })}
      </div>
    </>
  );
};
