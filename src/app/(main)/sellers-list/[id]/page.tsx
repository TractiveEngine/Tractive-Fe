import React from "react";
import { StoreHeader } from "../_components/sellersStore/StoreHeader";
import { FilterProduct } from "../_components/sellersStore/FilterProduct";
import { StoreRecommendation } from "../_components/sellersStore/StoreRecommendation";
import { OtherStoreProduct } from "../_components/sellersStore/OtherStoreProduct";

export default function SellersID() {
  return (
    <div className="w-full bg-[#f1f1f1]">
      <StoreHeader />
      <FilterProduct />
      <StoreRecommendation />
      <OtherStoreProduct />
    </div>
  );
}
