"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { VideoPreview } from "../../_components/ProductDetails/productHeader/VideoPreview";
import { MakeBid } from "../../_components/ProductDetails/productHeader/MakeBid";
import { ImgShowCase } from "../../_components/ProductDetails/ImgShowCase";
import { ProductInfo } from "../../_components/ProductDetails/productAndSellersInfo/ProductInfo";
import { SellersInfo } from "../../_components/ProductDetails/productAndSellersInfo/SellersInfo";
import { SimilarProduct } from "../../_components/ProductDetails/SimilarProduct";
import { productService, ApiProduct, Bidder } from "@/services/productService";

const ProductDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [leadingBidder, setLeadingBidder] = useState<Bidder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductDetails = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      // 1. Fetch Product
      const productData = await productService.getProduct(id);
      setProduct(productData);

      // 2. Fetch Bidders (Parallel)
      const biddersPromise = productService.getBidders(id);
      const winnerPromise = productService.getWinningBidder(id);

      const [biddersData, winnerData] = await Promise.all([
        biddersPromise,
        winnerPromise,
      ]);
      setBidders(biddersData);
      setLeadingBidder(winnerData);
    } catch (error) {
      console.error("Failed to fetch product details", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refreshBidders = useCallback(async () => {
    if (!id) return;
    try {
      const [biddersData, winnerData] = await Promise.all([
        productService.getBidders(id),
        productService.getWinningBidder(id),
      ]);
      setBidders(biddersData);
      setLeadingBidder(winnerData);
    } catch (error) {
      console.error("Failed to refresh bidders", error);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

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
        <VideoPreview
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
          onBidSuccess={refreshBidders}
        />
      </div>
      <div className="mb-4">
        <ImgShowCase images={product.images} />
      </div>
      <div className="flex flex-col mb-4 lg:flex-row gap-4 w-full">
        <ProductInfo
          item={product}
          bidders={bidders}
          leadingBidder={leadingBidder}
        />
        <SellersInfo />
      </div>
      <SimilarProduct />
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
