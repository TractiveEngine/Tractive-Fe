"use client";
import React, { useState } from "react";
import { StoreHeader } from "../_components/sellersStore/StoreHeader";
import { FilterProduct } from "../_components/sellersStore/FilterProduct";
import { StoreRecommendation } from "../_components/sellersStore/StoreRecommendation";
import { OtherStoreProduct } from "../_components/sellersStore/OtherStoreProduct";
import { useParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetSeller,
  useGetSellerProducts,
} from "@/hooks/queries/useSellerQueries";

export default function SellersID() {
  const { id } = useParams();
  const sellerId = Array.isArray(id) ? id[0] : id;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [switchSide, setSwitchSide] = useState<string>("high-to-low");

  const { data: seller, isLoading: isSellerLoading } = useGetSeller(sellerId);
  const { data: products, isLoading: isProductsLoading } = useGetSellerProducts(
    sellerId,
    {
       search: debouncedSearch || undefined,
       category: selectedFilter.length > 0 ? selectedFilter[0] : undefined,
    }
  );

  return (
    <div className="w-full bg-[#f1f1f1]">
      <StoreHeader seller={seller} isLoading={isSellerLoading} />
      <FilterProduct 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          switchSide={switchSide}
          setSwitchSide={setSwitchSide}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <StoreRecommendation recommendations={seller?.recommendations as any} isLoading={isSellerLoading} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <OtherStoreProduct products={products as any} isLoading={isProductsLoading} />
    </div>
  );
}
