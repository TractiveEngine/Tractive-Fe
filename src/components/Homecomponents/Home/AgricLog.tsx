import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";

export const AgricLog = () => {
  return (
    <section className="w-full bg-[#f1f1f1] py-6">
      <div className="w-[90%] mx-auto flex flex-col gap-20 lg:flex-row lg:items-center">
        <div className="w-[100%] bg-[#F7E6DA4D] p-12">
          <Image
            src="/images/AgricLog.png"
            alt="opportunities"
            width={620}
            height={398.264}
          />
        </div>
        <div className="flex flex-col gap-[4px] w-[100%]">
          <h1 className="text-black font-montserrat text-[20px] font-medium">
            Drive the Future of Agricultural Logistics
          </h1>
          <p className="text-black font-montserrat text-[13px] leading-8 font-medium">
            Join the vanguard of efficient and sustainable agricultural
            logistics. Our platform offers you the opportunity to connect with
            farmers and buyers, unlocking a world of transportation
            possibilities.
          </p>
          <div className="flex flex-col gap-[4px] mt-[0.7rem] w-[100%]">
            <span className="text-[#2b2b2b] font-montserrat text-[15px] font-medium ">
              Key Benefits:
            </span>
            <ul
              role="list"
              className="text-[#2b2b2b] ml-[1.6rem] mr-[7rem] w-[92%] list-disc"
            >
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Transport Opportunities: Find transport jobs, from local
                deliveries to regional hauls.
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Secure Transactions: Enjoy safe and transparent payment methods.
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Reliable Partners: Connect with farmers and buyers in need of
                your services.
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Support and Community: Be part of a thriving community, sharing
                experiences and insights.
              </li>
            </ul>
          </div>
          <Link href="/signup" className="flex items-center gap-2 mt-7">
            <p className="font-montserrat text-[20px] font-normal text-[#538E53]">
              Register as a buyer
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
