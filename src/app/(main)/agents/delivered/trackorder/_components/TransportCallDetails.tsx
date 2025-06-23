import React from "react";
import Image from "next/image";
import { CopyIcon, XIcon } from "@/icons/Icon1";
import { StarIcon, YellowStarIcon } from "@/icons/Icons";


type TransportCallDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  modalDetails: {
    company: string;
    logoSrc: string;
    logoAlt: string;
    logoWidth: number;
    logoHeight: number;
    rating: number;
    phoneNumbers: string[];
  };
  copiedStates: { [key: string]: boolean };
  handleCopy: (number: string) => void;
};

export const TransportCallDetails = ({
  isOpen,
  onClose,
  modalDetails,
  copiedStates,
  handleCopy,
}: TransportCallDetailsProps) => {
  if (!isOpen) return null;

  const {
    company,
    logoSrc,
    logoAlt,
    logoWidth,
    logoHeight,
    rating,
    phoneNumbers,
  } = modalDetails;

  return (
    <div className="fixed inset-0 bg-[#2b2b2b94] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#fefefe] flex flex-col items-center justify-center gap-4 rounded-[10px] p-6 w-[90%] max-w-[400px] relative">
        <button
          className="absolute top-2 right-2 text-[#2b2b2b] text-[20px] cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <XIcon />
        </button>
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="object-cover"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
              {company}
            </p>

            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <StarIcon />
              </div>
              <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                {rating}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-8 w-full">
            {phoneNumbers.map((number) => (
              <div
                key={number}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleCopy(number)}
              >
                {copiedStates[number] ? (
                  <span className="font-montserrat font-normal text-[12px] text-[#538e53]">
                    Copied!
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <CopyIcon />
                    <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                      {number}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
