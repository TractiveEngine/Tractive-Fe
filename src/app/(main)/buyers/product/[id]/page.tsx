"use client";
import { useParams } from "next/navigation";
import React from "react";
import { biddingData } from "../../_components/BuyerHome/Biding";
import { VideoPreview } from "../../_components/ProductDetails/productHeader/VideoPreview";
import { MakeBid } from "../../_components/ProductDetails/productHeader/MakeBid";
import { ImgShowCase } from "../../_components/ProductDetails/ImgShowCase";
import { ProductInfo } from "../../_components/ProductDetails/productAndSellersInfo/ProductInfo";
import { SellersInfo } from "../../_components/ProductDetails/productAndSellersInfo/SellersInfo";
import { SimilarProduct } from "../../_components/ProductDetails/SimilarProduct";

const ProductDetail = () => {
  const { id } = useParams(); // Get the dynamic id from the URL
  const item = biddingData.find((data) => data.id === id); // Find the item by id

  if (!item) {
    return <div className="text-center py-10">Bidding item not found</div>;
  }

  return (
    <div className="w-[90%] mx-auto py-6">
      <div className="flex flex-col mb-4 md:flex-row gap-4 w-[100%]">
        <VideoPreview />
        <MakeBid />
      </div>
      <div className=" mb-4 ">
        <ImgShowCase />
      </div>
      <div className="flex flex-col mb-4 md:flex-row gap-4 w-[100%]">
        <ProductInfo />
        <SellersInfo />
      </div>
      <SimilarProduct />
    </div>
  );
};

export default ProductDetail;
