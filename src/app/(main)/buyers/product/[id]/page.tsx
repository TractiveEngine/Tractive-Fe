"use client";

import { useParams } from "next/navigation";
import React from "react";
import { VideoPreview } from "../../_components/ProductDetails/productHeader/VideoPreview";
import { MakeBid } from "../../_components/ProductDetails/productHeader/MakeBid";
import { ImgShowCase } from "../../_components/ProductDetails/ImgShowCase";
import { ProductInfo } from "../../_components/ProductDetails/productAndSellersInfo/ProductInfo";
import { SellersInfo } from "../../_components/ProductDetails/productAndSellersInfo/SellersInfo";
import { SimilarProduct } from "../../_components/ProductDetails/SimilarProduct";
import { BiddingData, BiddingItem } from "../../BiddingDatas"; // Adjusted import path

// Define props for child components
interface ProductComponentProps {
  item: BiddingItem;
}

const ProductDetail: React.FC = () => {
  const params = useParams<{ id: string }>(); // Explicitly type id as string
  const id = params?.id;
  console.log("ID from useParams:", id); // Debug the id

  const item = BiddingData.find((data) => data.id === id);

  if (!id || !item) {
    return (
      <div className="text-center py-10 text-red-500">
        Bidding item not found or invalid ID
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto py-6">
      <div className="flex flex-col mb-4 md:flex-row gap-4 w-full">
        <VideoPreview />
        <MakeBid />
      </div>
      <div className="mb-4">
        <ImgShowCase />
      </div>
      <div className="flex flex-col mb-4 md:flex-row gap-4 w-full">
        <ProductInfo item={item} />
        <SellersInfo />
      </div>
      <SimilarProduct />
    </div>
  );
};

export default ProductDetail;

// Update child components to accept props (example interfaces)
// Add these to respective component files
export interface VideoPreviewProps extends ProductComponentProps {}
export interface MakeBidProps extends ProductComponentProps {}
export interface ImgShowCaseProps extends ProductComponentProps {}
export interface ProductInfoProps extends ProductComponentProps {}
export interface SellersInfoProps extends ProductComponentProps {}
export interface SimilarProductProps extends ProductComponentProps {}
