import Image from "next/image";
import React from "react";

export const OutOfStock = () => {
  return (
    <div className="w-[40%] bg-[#fefefe] shadow-md rounded-[4px]">
      <h2 className="font-montserrat text-[#2b2b2b] text-[13px] p-2 rounded-tl-[6px] rounded-br-[6px]  font-medium mb-4 bg-[#cce5cc] flex items-center justify-center w-[40%]">
        Out of stock
      </h2>

      <div className="flex flex-col gap-2.5">
        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/yellowPepper.png"
              alt="Product"
              width={83}
              height={47}
              className=""
            />
            <div className="flex flex-col gap-3">
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                Coco-yam
              </span>
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal truncate">
                Best of all the
              </span>
            </div>
          </div>
          <span className="font-montserrat text-[#538e53] text-[13px] font-medium cursor-pointer">
            Restock
          </span>
        </div>

        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/yellowPepper.png"
              alt="Product"
              width={83}
              height={47}
              className=""
            />
            <div className="flex flex-col gap-3">
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                Coco-yam
              </span>
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal truncate">
                Best of all the
              </span>
            </div>
          </div>
          <span className="font-montserrat text-[#538e53] text-[13px] font-medium cursor-pointer">
            Restock
          </span>
        </div>

        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/yellowPepper.png"
              alt="Product"
              width={83}
              height={47}
              className=""
            />
            <div className="flex flex-col gap-3">
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                Coco-yam
              </span>
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal truncate">
                Best of all the
              </span>
            </div>
          </div>
          <span className="font-montserrat text-[#538e53] text-[13px] font-medium cursor-pointer">
            Restock
          </span>
        </div>

        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/yellowPepper.png"
              alt="Product"
              width={83}
              height={47}
              className=""
            />
            <div className="flex flex-col gap-3">
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                Coco-yam
              </span>
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal truncate">
                Best of all the
              </span>
            </div>
          </div>
          <span className="font-montserrat text-[#538e53] text-[13px] font-medium cursor-pointer">
            Restock
          </span>
        </div>

        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/yellowPepper.png"
              alt="Product"
              width={83}
              height={47}
              className=""
            />
            <div className="flex flex-col gap-3">
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                Coco-yam
              </span>
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal truncate">
                Best of all the
              </span>
            </div>
          </div>
          <span className="font-montserrat text-[#538e53] text-[13px] font-medium cursor-pointer">
            Restock
          </span>
        </div>

        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/yellowPepper.png"
              alt="Product"
              width={83}
              height={47}
              className=""
            />
            <div className="flex flex-col gap-3">
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                Coco-yam
              </span>
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal truncate">
                Best of all the
              </span>
            </div>
          </div>
          <span className="font-montserrat text-[#538e53] text-[13px] font-medium cursor-pointer">
            Restock
          </span>
        </div>

        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-[5px]">
            <Image
              src="/images/yellowPepper.png"
              alt="Product"
              width={83}
              height={47}
              className=""
            />
            <div className="flex flex-col gap-3">
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal">
                Coco-yam
              </span>
              <span className="font-montserrat text-[#2b2b2b] text-[11px] font-normal truncate">
                Best of all the
              </span>
            </div>
          </div>
          <span className="font-montserrat text-[#538e53] text-[13px] font-medium cursor-pointer">
            Restock
          </span>
        </div>
      </div>
      <button className="flex items-center justify-end ml-auto mr-4 text-[13px] font-montserrat mt-[1rem] text-[#538e53]">
        See all
      </button>
    </div>
  );
};
