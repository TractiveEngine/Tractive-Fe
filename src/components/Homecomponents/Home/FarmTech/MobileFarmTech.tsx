import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import "./FarmTech.css";

export const MobileFarmTech = () => {
  return (
    <section className="w-full bg-[#f1f1f1] py-6">
      <div className="relative z-[999] w-[90%] mx-auto flex flex-col gap-20 lg:flex-row lg:items-center">
        <div className=" ContentDirection overflow-hidden z-[999] flex items-center flex-row-reverse bg-[#FDCED980] px-[26px] pt-[52px] rounded-[64px] justify-between gap-[26px] w-[100%]">
          <div className="relative top-[1rem] PhoneImageContainer">
            <Image
              src="/images/Home (1).png"
              alt="opportunities"
              width={118.956}
              height={257}
              className="w-[727.956px] h-[257px] PhoneImage"
            />
          </div>
          <div>
            <h1 className=" OpportAgricTitle text-black font-montserrat text-center text-[17px] font-medium">
              Supercharge Your Farming with Technology
            </h1>
            <p className="text-black font-montserrat text-[13px] leading-6 font-normal">
              Take your farming operations to the next level. Our platform
              empowers you with cutting-edge tools and a thriving marketplace to
              showcase your produce to a wide audience.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[4px] w-[100%]">
          <div className="flex flex-col gap-[4px] mt-[0.7rem] w-[100%]">
            <span className="text-[#2b2b2b] font-montserrat text-[15px] font-medium ">
              Key Benefits:
            </span>
            <ul
              role="list"
              className="gap-3 text-[#2b2b2b] ml-[1.6rem] mr-[0rem] w-[94%] list-disc"
            >
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Farm Management: Monitor crops and livestock, receive weather
                alerts, and optimize your operations.
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Market Reach: List your products in our marketplace, attracting
                buyers from far and wide.
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Transportation Made Simple: Secure reliable transporters for
                safe and timely deliveries of your goods
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Community and Support: Connect with fellow farmers and experts,
                gaining knowledge and insights.
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="flex items-center justify-end gap-2 mt-7"
          >
            <p className="font-montserrat text-[20px] font-normal text-[#538E53]">
              Register as a Buyer
            </p>
            <span className="w-[24px] h-[24px] bg-[#CCE5CC] rounded-full flex items-center justify-center">
              <GoArrowRight className="text-[#538E53] w-[24px] h-[24px]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
