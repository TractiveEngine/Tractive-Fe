"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { WishList } from "./_components/WishList";
import { MyBiding } from "./_components/MyBiding";
import { useGetWishlist } from "@/hooks/queries/useUserQueries";
import { WishlistItem } from "@/services/productService";

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"wish-list" | "my-biddings">(
    "wish-list"
  );
  const [borderStyle, setBorderStyle] = useState<{
    width: number;
    left: number;
  }>({ width: 0, left: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [page, setPage] = useState(1);
  const [accumulatedWishlist, setAccumulatedWishlist] = useState<WishlistItem[]>([]);

  // Fetch WishList using new API endpoint
  const { data: wishlistResponse, isLoading, isFetching } = useGetWishlist(page, 20);
  
  // Extract data array and pagination metadata
  const currentWishlistBatch: WishlistItem[] = useMemo(
    () => wishlistResponse?.data?.wishlist || wishlistResponse?.data || wishlistResponse?.wishlist || wishlistResponse || [],
    [wishlistResponse]
  );
  
  useEffect(() => {
    // When we get new data and we are not just loading the first page, append it.
    // However, if page is 1, replace accumulated data (e.g. after a delete invalidate).
    if (page === 1) {
       setAccumulatedWishlist(currentWishlistBatch);
    } else if (currentWishlistBatch.length > 0) {
       setAccumulatedWishlist(prev => {
          // Prevent duplicates by checking IDs
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existingIds = new Set(prev.map(item => item._id || (item as any).id));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newItems = currentWishlistBatch.filter((item: WishlistItem) => !existingIds.has(item._id || (item as any).id));
          return [...prev, ...newItems];
       });
    }
  }, [currentWishlistBatch, page]);

  const wishListData = accumulatedWishlist;
  
  // Extract pagination data to determine if we have more pages
  const pagination = wishlistResponse?.pagination;
  const hasMore = pagination ? pagination.page * pagination.limit < pagination.total : currentWishlistBatch.length === 20;

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };


  // Update border position and width when active tab changes
  useEffect(() => {
    const activeTabRef = tabRefs.current[activeTab];
    if (activeTabRef) {
      const { offsetWidth, offsetLeft } = activeTabRef;
      setBorderStyle({ width: offsetWidth, left: offsetLeft });
    }
  }, [activeTab]);

  return (
    <div className="w-[100%] bg-[#f1f1f1]">
      <div className="">
        <div className="relative flex flex-col gap-2">
          <div className="flex relative gap-8 w-[90%] mx-auto">
            <div className="flex relative gap-8">
              <button
                type="button"
                ref={(el) => {
                  tabRefs.current["wish-list"] = el;
                }}
                className={`py-2 flex items-center gap-[2px] text-sm font-normal text-[#2b2b2b] cursor-pointer ${
                  activeTab === "wish-list" ? "text-[#538e53]" : ""
                }`}
                onClick={() => setActiveTab("wish-list")}
              >
                Wish-List
                <span className="text-[#fefefe] bg-[#538e53] p-[1px] text-[9px] rounded-[3px] w-[0.99rem] flex items-center justify-center">
                  {wishListData.length}
                </span>
              </button>
              <button
                type="button"
                ref={(el) => {
                  tabRefs.current["my-biddings"] = el;
                }}
                className={`py-2 flex items-center gap-[2px] text-sm font-normal text-[#2b2b2b] cursor-pointer ${
                  activeTab === "my-biddings" ? "text-[#538e53]" : ""
                }`}
                onClick={() => setActiveTab("my-biddings")}
              >
                My Biddings
              </button>
            </div>
            <motion.div
              className="absolute -bottom-[8px] rounded-t-[5px] h-[4px] bg-[#538e53]"
              animate={{ width: borderStyle.width, left: borderStyle.left }}
              transition={{ type: "tween", duration: 0.3 }}
            />
          </div>
          <span className="w-[100%] h-[1px] bg-[#d2d2d2]"></span>
        </div>
        <div className="mt-4">
          {activeTab === "wish-list" ? (
            <WishList 
               data={wishListData} 
               isLoading={isLoading && page === 1} 
               isFetchingNextPage={isFetching && page > 1}
               hasMore={hasMore}
               onLoadMore={handleLoadMore}
            />
          ) : (
            <MyBiding />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
