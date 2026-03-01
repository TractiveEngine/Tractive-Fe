"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
// import { VideoPreview } from "../../_components/ProductDetails/productHeader/VideoPreview";
import { MakeBid } from "../../_components/ProductDetails/productHeader/MakeBid";
import { ImgShowCase } from "../../_components/ProductDetails/ImgShowCase";
import { ProductInfo } from "../../_components/ProductDetails/productAndSellersInfo/ProductInfo";
import { SellersInfo } from "../../_components/ProductDetails/productAndSellersInfo/SellersInfo";
import { SimilarProduct } from "../../_components/ProductDetails/SimilarProduct";
import { useProduct } from "@/hooks/queries/useProductQueries";

const ProductDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: product,
    isLoading: isProductLoading,
    refetch: refetchProduct,
  } = useProduct(id || null);



  const isLoading = isProductLoading;

  const handleBidSuccess = useCallback(() => {
    // Refetch sensitive data without page reload
    refetchProduct();
  }, [refetchProduct]);

  if (isLoading) {
    return (
      <div className="w-[90%] mx-auto py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-[#538e53] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!id || !product) {
    return (
      <div className="text-center py-10 text-red-500">
        Product not found or invalid ID
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto py-6">
      <div className="flex flex-col mb-4 lg:flex-row gap-4 w-full">
        <ImgShowCase 
          images={product.images} 
          videoSrc={
            product.videos && product.videos.length > 0
              ? product.videos[0]
              : undefined
          }
        />
        <MakeBid
          productId={id}
          defaultPrice={product.price}
          defaultQuantity={product.quantity}
          onBidSuccess={handleBidSuccess}
        />
      </div>
      <div className="flex flex-col mb-4 lg:flex-row gap-4 w-full">
        <ProductInfo
          item={product}
        />
        <SellersInfo 
          owner={product.owner} 
          onRefresh={refetchProduct} 
        />
      </div>
      <SimilarProduct productId={id} />
    </div>
  );
};

export default ProductDetail;

// api/bids POST - create post
// {
//   "product": "507f1f77bcf86cd799439013",
//   "proposedPrice": 4500,
//   "quantity": 20,
//   "message": "Interested in bulk purchase"
// }
