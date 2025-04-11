"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import { BsFolder } from "react-icons/bs";
import { RiTelegram2Line } from "react-icons/ri";

const chatMessages = [
  {
    id: 1,
    direction: "left",
    image: "/images/chatImage.png",
    message: "Welcome mr kelvin, how can we be of assistant",
    msgTime: "7:00 am",
  },
  {
    id: 2,
    direction: "right",
    image: "/images/chatImage2.png",
    message: "Welcome mr kelvin, how can we be of assistant",
    msgTime: "7:00 am",
  },
  {
    id: 3,
    direction: "left",
    image: "/images/chatImage.png",
    message: "Welcome mr kelvin, how can we be of assistant",
    msgTime: "7:00 am",
  },
  {
    id: 4,
    direction: "right",
    image: "/images/chatImage2.png",
    message: "Welcome mr kelvin, how can we be of assistant",
    msgTime: "7:00 am",
  },
  {
    id: 5,
    direction: "left",
    image: "/images/chatImage.png",
    message: "Welcome mr kelvin, how can we be of assistant",
    msgTime: "7:00 am",
  },
];

interface Props {
  onClose: () => void;
}

export const CustomerRepresentativeChatBox = ({ onClose }: Props) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-[12px]">
        <div className="bg-[#538e53] w-[100%] flex items-center justify-between gap-[59.23px] px-6 py-3.5 rounded-t-[16.5px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[35px] h-[35px] flex items-center justify-center">
              <Image
                src="/images/RepProfile.png"
                alt=" Representative profile"
                width={41.18}
                height={41.18}
              />
            </div>
            <h1 className="text-[#f9f9f9] text-[13px] font-montserrat font-normal text-center">
              AgricTech Customer Service
            </h1>
          </div>
          <Button
            text="End Chat"
            onClick={onClose}
            className="bg-transparent hover:bg-transparent border-[0.823px] !px-3 !py-1.5 !rounded-[3.292px] border-[#f9f9f9] "
            textClass="text-[13px] font-montserrat font-normal text-[#f9f9f9]"
          />
        </div>

        <form className="relative w-[100%] flex flex-col items-center justify-center gap-[0.7rem]">
          <small className="font-montserrat text-[#808080] text-[8px] font-normal">
            Wed, 27, November
          </small>

          <div className=" w-[100%] flex flex-col gap-[1.2rem] rounded-[10px] pt-[5px]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.direction === "right"
                    ? "flex-row-reverse pr-[16px]"
                    : "pl-[16px]"
                } items-center gap-[20px]`}
              >
                <div className="w-[30px] h-[30px]">
                  <Image
                    src={msg.image}
                    alt="Chat Profile"
                    width={40}
                    height={40}
                  />
                </div>
                <div
                  className={`flex w-[55%] items-center px-2 py-1.5 rounded-t-[10px] ${
                    msg.direction === "right"
                      ? "rounded-bl-[10px] bg-[#538E53] text-[#fefefe]"
                      : "rounded-br-[10px] bg-[#f1f1f1] "
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      msg.direction === "right"
                        ? "items-end text-[#fefefe]"
                        : "items-start text-[#000000]"
                    } gap-[3px] w-[100%]`}
                  >
                    <p className="font-normal font-montserrat text-[10.4px] w-[100%]">
                      {msg.message}
                    </p>
                    <small className="font-normal flex items-end justify-end text-left font-montserrat text-[9px] w-[100%]">
                      {msg.msgTime}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 flex items-center justify-center gap-[1rem] w-[37%]">
            <div className="flex items-center justify-center w-[80%] max-w-[500px] z-10">
              <input
                type="text"
                placeholder="Write here"
                className=" relative bg-[#e2e2e2] w-[100%] px-4 py-[0.7rem] rounded-[79.115px] focus:outline-none focus:border-[#538E53] placeholder:text-[#808080] placeholder:text-[11px] placeholder:font-montserrat placeholder:pl-[22.232px] placeholder:font-normal"
                required
              />
              <BsFolder className="absolute left-24 text-[#808080] cursor-pointer" />
            </div>
            <button
              type="submit"
              title="Send Message"
              className="bg-[#538E53] w-[46px] h-[46px] flex items-center justify-center p-2 rounded-full cursor-pointer"
            >
              <RiTelegram2Line className="text-[#fefefe]  w-[16px] h-[16px]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
