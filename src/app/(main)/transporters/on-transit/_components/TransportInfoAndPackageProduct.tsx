import { AwardIcon, StarIcon, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import React, { useState } from "react";
import {
  MessageFill,
  PhoneCallFill,
} from "../../../_components/Icons/AgentIcons";
import { TransportCallDetails } from "./TransportCallDetails";
import { PackagedTable } from "./PackagedTable";

export const TransportInfoAndPackageProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({
    "09034145971": false,
    "09034145972": false,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const phoneNumbers = ["09034145971", "09034145972"];

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedStates((prev) => ({ ...prev, [number]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [number]: false }));
    }, 2000);
  };

  const modalDetails = {
    company: "GIGM Transport Company",
    logoSrc: "/images/GIGM.png",
    logoAlt: "GIGM Logo",
    logoWidth: 67,
    logoHeight: 47,
    rating: "4.0",
    phoneNumbers,
  };

  return (
    <div className="w-full flex flex-col  gap-4 rounded-[10px]">
      <div className="flex ProductTransport_Details gap-4 w-full">
        {/* Transport Information */}
        <div className="flex flex-col bg-[#fefefe] shadow-md rounded-[10px] p-3 sm:p-4 w-full xl:w-[50%]">
          <h2 className="font-montserrat font-normal text-[12px] sm:text-[14px] mb-2 text-[#2b2b2b]">
            Transporter Info
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
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <StarIcon />
              </div>
              <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
                4.0
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="border-[1px] border-[#808080] text-[#2b2b2b] font-montserrat font-medium text-[11px] sm:text-[12px] px-4 sm:px-6 py-1.5 sm:py-2 rounded-[50px]">
                Follow
              </button>
              <span className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b]">
                700 Followers
              </span>
            </div>
            <span className="font-montserrat font-normal text-[10px] sm:text-[12px] text-[#2b2b2b]">
              Abia State
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 p-2 bg-[#cce5cc] rounded-full cursor-pointer">
                <MessageFill  />
              </div>
              <div
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 p-2 bg-[#cce5cc] rounded-full cursor-pointer"
                onClick={openModal}
              >
                <PhoneCallFill />
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <AwardIcon />
              <span className="font-montserrat font-normal text-center text-[10px] sm:text-[11px] text-[#2b2b2b]">
                5 years of transportation service
              </span>
            </div>
            <span className="font-montserrat font-normal text-[10px] sm:text-[12px] text-[#2b2b2b]">
              Rating: Excellent
            </span>
          </div>
        </div>

        {/* Packaged Products Table */}
        <PackagedTable />
      </div>
      <TransportCallDetails
        isOpen={isModalOpen}
        onClose={closeModal}
        modalDetails={modalDetails}
        copiedStates={copiedStates}
        handleCopy={handleCopy}
      />
    </div>
  );
};
