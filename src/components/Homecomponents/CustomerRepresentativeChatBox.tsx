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
      <div className="flex flex-col h-[500px] w-[100%] max-w-[100%] md:max-w-[100%] mx-auto md:mx-0 rounded-[16.5px] overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-[#538e53] flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <Image
              src="/images/RepProfile.png"
              alt="Representative profile"
              width={35}
              height={35}
            />
            <h1 className="text-white text-[13px] font-montserrat">
              AgricTech Customer Service
            </h1>
          </div>
          <Button
            text="End Chat"
            onClick={onClose}
            className="bg-transparent border border-white text-white text-[13px] px-3 py-1.5 rounded"
          />
        </div>

        {/* Chat Messages (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-white">
          <small className="text-[#808080] text-[8px] font-montserrat block text-center mb-2">
            Wed, 27, November
          </small>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.direction === "right" ? "flex-row-reverse pr-4" : "pl-4"
              } items-start gap-3`}
            >
              <Image
                src={msg.image}
                alt="Chat Profile"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div
                className={`w-[55%] px-3 py-2 rounded-t-[10px] ${
                  msg.direction === "right"
                    ? "rounded-bl-[10px] bg-[#538E53] text-white"
                    : "rounded-br-[10px] bg-[#f1f1f1] text-black"
                }`}
              >
                <p className="text-[10.4px] font-montserrat">{msg.message}</p>
                <small className="text-[9px] block text-right font-montserrat">
                  {msg.msgTime}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Input Area */}
        <form className="bg-[#fefefe] px-4 py-3 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Write here"
              className="w-full pl-10 pr-4 py-4 bg-[#e2e2e2] text-[11px] rounded-full focus:outline-none text-[#808080] placeholder:text-[#808080] placeholder:font-montserrat"
              required
            />
            <BsFolder className="absolute top-[1.1rem] left-3 text-[#808080]" />
          </div>
          <button
            type="submit"
            title="Send Message"
            className="w-[46px] h-[46px] bg-[#538E53] flex items-center justify-center rounded-full cursor-pointer"
          >
            <RiTelegram2Line className="text-white w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
