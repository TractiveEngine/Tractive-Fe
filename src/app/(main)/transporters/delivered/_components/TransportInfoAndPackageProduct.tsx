import Image from "next/image";
import React from "react";
import { PackagedTable } from "./PackagedTable";
import { PhoneCall } from "../../_components/Icons/TransporterIcons";

export const TransportInfoAndPackageProduct = () => {
  return (
    <div className="w-full flex flex-col  gap-4 rounded-[8px]">
      <div className="flex ProductBuyer_Details gap-4 w-full">
        {/* Buyer Information */}
        <div className="flex flex-col bg-[#fefefe] shadow-md rounded-[10px] p-3 sm:p-4 w-full">
          <h2 className="font-montserrat font-normal text-[12px] sm:text-[14px] mb-2 text-[#2b2b2b]">
            Buyers Information
          </h2>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Image
              src="/images/profileSettingImage.png"
              alt="transporter Image"
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10 sm:w-12 sm:h-12"
            />
            <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
              Goodness corporation
            </span>
            <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
              Abia State
            </span>
            <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#538e53] text-center">
              New Customer
            </span>

            <div className="flex items-center gap-2">
              <PhoneCall className="w-[15px] h-[15px]" />
              <span className="font-montserrat font-normal text-center text-[14px] text-[#2b2b2b]">
                09034145971
              </span>
            </div>
            <span className="font-montserrat font-normal text-[13px] sm:text-[14px] text-[#2b2b2b] text-center">
              No 24 umuahia street off loko road
            </span>
          </div>
        </div>

        {/* Packaged Products Table */}
        <PackagedTable />
      </div>
    </div>
  );
};
