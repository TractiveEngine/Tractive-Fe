// _components/MyBids.tsx
"use client";
import Image from "next/image";
import React from "react";
import { YellowStarIcon } from "@/icons/Icons";
import { TrashIcon } from "@/icons/Icon1";

interface BidItem {
  id: string;
  title: string;
  quantity: string;
  seller: string;
  price: number;
  imageSrc: string;
}

interface MyBidsProps {
  bidItems: BidItem[];
  selection: { isCheckoutAll: boolean; selectedBids: string[] };
  setSelection: (isCheckoutAll: boolean, selectedBids: string[]) => void;
}

export const MyBids: React.FC<MyBidsProps> = ({
  bidItems,
  selection,
  setSelection,
}) => {
  const handleCheckoutAllChange = () => {
    if (!selection.isCheckoutAll) {
      // Check all items when selecting "Checkout All"
      setSelection(
        true,
        bidItems.map((item) => item.id)
      );
    } else {
      // Uncheck all
      setSelection(false, []);
    }
  };

  const handleItemChange = (id: string) => {
    let newSelectedBids: string[];
    if (selection.selectedBids.includes(id)) {
      // Uncheck item
      newSelectedBids = selection.selectedBids.filter((bidId) => bidId !== id);
    } else {
      // Check item
      newSelectedBids = [...selection.selectedBids, id];
    }
    // If an item is toggled, disable "Checkout All" unless all items are selected
    const isCheckoutAll = newSelectedBids.length === bidItems.length;
    setSelection(isCheckoutAll, newSelectedBids);
  };

  return (
    <div className="w-full bg-[#fefefe] shadow-md my-8 rounded-[5px]">
      <style jsx>{`
        .custom-AllRadio {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid #538e53;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
        }
        .custom-AllRadio:checked::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: #538e53;
          border-radius: 50%;
        }
        .custom-AllRadio:checked {
          border-color: #538e53;
        }
        .custom-radio {
          appearance: none;
          width: 20px;
          height: 18px;
          border: 1px solid #538e53;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
        }
        .custom-radio:checked::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: #538e53;
          border-radius: 50%;
        }
        .custom-radio:checked {
          border-color: #538e53;
        }
      `}</style>

      <div className="flex items-center gap-1 p-3.5">
        <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
          My Bids
        </p>
        <span className="font-montserrat font-normal text-[12px] text-[#fefefe] bg-[#538e53] w-[15px] h-[16px] p-[5px] flex justify-center items-center rounded-[3px]">
          {bidItems.length}
        </span>
      </div>
      <div className="w-full border-t border-dashed border-[#808080]"></div>

      <div className="flex items-center gap-4 p-3.5">
        <input
          type="radio"
          name="checkout-all"
          id="checkout-all"
          className="custom-AllRadio"
          checked={selection.isCheckoutAll}
          onChange={handleCheckoutAllChange}
        />
        <label
          htmlFor="checkout-all"
          className="font-montserrat font-normal text-[14px] text-[#2b2b2b]"
        >
          Checkout All
        </label>
      </div>
      <div className="w-full h-[1px] bg-[#808080]"></div>

      {bidItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <div className="flex items-center gap-4 w-full">
            <input
              type="radio"
              id={item.id}
              className="ml-3.5 custom-radio"
              checked={
                selection.isCheckoutAll ||
                selection.selectedBids.includes(item.id)
              }
              onChange={() => handleItemChange(item.id)}
            />
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-4 py-3.5">
                <Image
                  src={item.imageSrc}
                  alt="Bid won"
                  width={119}
                  height={129}
                />
                <div className="flex flex-col gap-9">
                  <div className="flex flex-col gap-1">
                    <p className="font-montserrat font-normal text-[12px] text-[#2b2b2b]">
                      {item.title}
                    </p>
                    <small className="font-montserrat font-normal text-[11px] text-[#808080]">
                      {item.quantity}
                    </small>
                    <div className="flex gap-2">
                      <p className="font-montserrat font-normal text-[12px] text-[#808080]">
                        Seller:{" "}
                        <span className="text-[#2b2b2b]">{item.seller}</span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <YellowStarIcon />
                        <YellowStarIcon />
                        <YellowStarIcon />
                        <YellowStarIcon />
                        <YellowStarIcon />
                      </div>
                    </div>
                  </div>
                  <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
                    ${item.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-[0.7px] h-[10rem] bg-[#808080]"></div>
                <div className="flex flex-col items-center justify-center cursor-pointer px-3.5">
                  <TrashIcon />
                  <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                    Delete
                  </span>
                </div>
              </div>
            </div>
          </div>
          {index < bidItems.length - 1 && (
            <div className="w-full h-[1px] bg-[#808080]"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
