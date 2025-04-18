"use client";
import Image from "next/image";
import React, { useState } from "react";
import { LiveChat } from "../LiveChat";
import { RiSearch2Line } from "react-icons/ri";
import { LiveChatIpad } from "../LiveChatIpad";

interface Props {
  onOpen: () => void;
}

export const CookiesAgTechLiveChatIpad = ({ onOpen }: Props) => {
  return (
    <div className="relative bg-[#538e53] w-[100%] mx-auto h-[340px] flex flex-col gap-[25px] rounded-[10px] overflow-hidden">
      <div className="flex gap-[128px] w-[100%]">
        <div className="flex flex-col ">
          <div className="flex flex-col items-start justify-start w-[100%] pl-12 py-6 z-[999]">
            <h1 className="text-[1.5rem] font-montserrat font-normal text-left bg-gradient-to-b from-[#06AD06] to-[#ffffff] bg-clip-text text-transparent">
              AGRICTECH
            </h1>
            <p className="text-[#f9f9f9] text-left font-montserrat font-normal text-[14px] leading-[25px]">
              Connecting farmers, buyers and transporters
            </p>
          </div>
          <div className="flex flex-col items-start justify-start w-[350px] absolute bottom-0 left-0 right-0">
            <Image
              src="/images/customerService.png"
              alt="Customer Service"
              width={401}
              height={271}
            />
          </div>
        </div>
        <LiveChatIpad onOpen={onOpen} />
      </div>
      <div className="flex items-center justify-center w-[100%] max-w-[500px] z-10 mx-auto pt-[1rem]">
        <input
          type="text"
          placeholder="Search here"
          className=" bg-[#fefefe] w-[100%] px-4 py-[0.7rem] rounded-tl-[5px] rounded-bl-[5px] focus:outline-none focus:border-[#538E53] placeholder:text-[#808080] placeholder:text-[14px] placeholder:font-montserrat placeholder:font-normal"
          required
        />
        <button
          type="submit"
          title="Search"
          className="bg-[#CCE5CC] flex items-center justify-center font-montserrat text-[#2b2b2b] text-[17px] font-normal py-[0.9rem] px-[1.4rem] rounded-tr-[5px] rounded-br-[5px] cursor-pointer"
        >
          <RiSearch2Line />
        </button>
      </div>
    </div>
  );
};
