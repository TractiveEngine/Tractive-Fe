"use client";
import React from "react";
import { StoreHeader } from "../_components/sellersStore/StoreHeader";
import { FilterProduct } from "../_components/sellersStore/FilterProduct";
import { StoreRecommendation } from "../_components/sellersStore/StoreRecommendation";
import { OtherStoreProduct } from "../_components/sellersStore/OtherStoreProduct";
import { useParams } from "next/navigation";
import {
  useGetSeller,
  useGetSellerProducts,
} from "@/hooks/queries/useSellerQueries";
export default function SellersID() {
  const { id } = useParams();
  const sellerId = Array.isArray(id) ? id[0] : id;

  const { data: seller, isLoading: isSellerLoading } = useGetSeller(sellerId);
  const { data: products, isLoading: isProductsLoading } = useGetSellerProducts(
    sellerId
  );

  return (
    <div className="w-full bg-[#f1f1f1]">
      <StoreHeader seller={seller} isLoading={isSellerLoading} />
      <FilterProduct />
      <StoreRecommendation />
      <OtherStoreProduct products={products} isLoading={isProductsLoading} />
    </div>
  );
}
