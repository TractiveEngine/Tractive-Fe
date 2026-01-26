"use client";

import BidingCard from "@/components/cards/BidingCard";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { productService, ApiProduct } from "@/services/productService";
import { toast } from "sonner";

// productCode1001

export const Biding = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Use a ref to prevent race conditions or duplicate fetches for the same page
  const loadingRef = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // Callback ref for the last element to trigger infinite scroll
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  const fetchProducts = useCallback(async (pageToFetch: number) => {
    // Prevent duplicate requests
    if (loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      const response = await productService.getProducts({
        page: pageToFetch,
        limit: 12,
        status: "available",
      });

      const newProducts = response.products;
      const total = response.total || 0;

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => {
          // Deduplicate products based on ID to be safe
          const existingIds = new Set(prev.map((p) => p.id));
          const distinctNew = newProducts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...distinctNew];
        });

        // If we fetched fewer items than limit, or reached total, stop.
        if (
          newProducts.length < 12 ||
          (response.pagination &&
            response.pagination.page * response.pagination.limit >= total)
        ) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
      setInitialLoadDone(true);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
    // Cleanup on unmount is handled by the effect cleanup logic implicitly for pure functions,
    // but for the observer we need strict cleanup.
  }, [page, fetchProducts]);

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        All Products
      </p>

      {initialLoadDone && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-montserrat">
            No products available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => {
            const isLast = products.length === index + 1;

            // Format price
            const formattedPrice = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(product.price);

            // Use static assets for visual consistency with the design provided in BiddingDatas
            // These should eventually come from the backend or be conditional
            return (
              <div
                key={`${product.id}-${index}`}
                ref={isLast ? lastProductElementRef : null}
                className="w-full"
              >
                <BidingCard
                  id={product.id}
                  image={product.images[0] || "/images/pp_onion.png"}
                  title={product.name}
                  time="Available" // Static for now as per "Product Listing" context
                  description={product.description}
                  timeImage="/images/redclock.png"
                  crownImage="/images/leadingcrown.png"
                  leadingProfileImage="/images/leadingProfileImage.png"
                  quantity={`${product.quantity} ${product.unit || "Units"}`}
                  amount={formattedPrice}
                  biddingPrice={formattedPrice} // Using same price for now as bidding logic is out of scope
                />
              </div>
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center p-8 w-full">
          <div className="w-8 h-8 border-4 border-[#538e53] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-400 font-montserrat text-sm w-full">
          You've reached the end of the list
        </div>
      )}
    </div>
  );
};





