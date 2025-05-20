"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { WishList } from "./_components/WishList";
import { MyBiding } from "./_components/MyBiding";

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"wish-list" | "my-biddings">(
    "wish-list"
  );
  const [borderStyle, setBorderStyle] = useState<{
    width: number;
    left: number;
  }>({ width: 0, left: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Data for WishList and BiddingProduct
  const wishListData = [
    {
      id: "productCode1253",
      image: "/images/pp_onion.png",
      title: "Pepper",
      time: "24:08:07",
      description: "Introducing the humble and delightful Pepper.",
      timeImage: "/images/redclock.png",
      crownImage: "/images/leadingcrown.png",
      quantity: "50 Bags",
      amount: "$400",
      bidingPrice: "$350",
    },
    {
      id: "productCode1254",
      image: "/images/pp_onion.png",
      title: "Tomato",
      time: "12:05:03",
      description: "Fresh and juicy tomatoes for all your needs.",
      timeImage: "/images/redclock.png",
      crownImage: "/images/leadingcrown.png",
      quantity: "30 Bags",
      amount: "$250",
      bidingPrice: "$200",
    },
    {
      id: "productCode1252",
      image: "/images/pp_onion.png",
      title: "Maize",
      time: "18:15:09",
      description: "High-quality maize for various uses.",
      timeImage: "/images/redclock.png",
      crownImage: "/images/leadingcrown.png",
      quantity: "75 Bags",
      amount: "$600",
      bidingPrice: "$550",
    },
    {
      id: "productCode1251",
      image: "/images/pp_onion.png",
      title: "Chicken",
      time: "06:30:45",
      description: "Fresh chicken straight from the farm.",
      timeImage: "/images/redclock.png",
      crownImage: "/images/leadingcrown.png",
      quantity: "20 Units",
      amount: "$150",
      bidingPrice: "$120",
    },
  ];

  const biddingProductData = [
    {
      id: "productCode1253",
      image: "/images/pp_onion.png",
      title: "Pepper",
      time: "24:08:07",
      description: "Introducing the humble and delightful Pepper.",
      timeImage: "/images/redclock.png",
      crownImage: "/images/leadingcrown.png",
      quantity: "50 Bags",
      amount: "$400",
      bidingPrice: "$350",
    },
    {
      id: "productCode1254",
      image: "/images/pp_onion.png",
      title: "Tomato",
      time: "12:05:03",
      description: "Fresh and juicy tomatoes for all your needs.",
      timeImage: "/images/redclock.png",
      crownImage: "/images/leadingcrown.png",
      quantity: "30 Bags",
      amount: "$250",
      bidingPrice: "$200",
    },
    {
      id: "productCode1252",
      image: "/images/pp_onion.png",
      title: "Maize",
      time: "18:15:09",
      description: "High-quality maize for various uses.",
      timeImage: "/images/redclock.png",
      crownImage: "/images/leadingcrown.png",
      quantity: "75 Bags",
      amount: "$600",
      bidingPrice: "$550",
    },
    
    
  ];

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
                <span className="text-[#fefefe] bg-[#538e53] p-[1px] text-[9px] rounded-[3px] w-[0.99rem] flex items-center justify-center">
                  {biddingProductData.length}
                </span>
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
            <WishList data={wishListData} />
          ) : (
            <MyBiding data={biddingProductData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
