import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import "./OpportAgric.css"

export const MobileOpportAgric = () => {
  return (
    <section className="w-full bg-[#f1f1f1] py-6">
      <div className="relative z-[999] w-[90%] mx-auto flex flex-col lg:flex-row lg:items-center">
        <div className="relative top-[2rem] left-[0rem] flex items-center justify-center CurveContainerImage">
          <Image
            src="/images/curve.png"
            alt="opportunities"
            width={276}
            height={203.983}
            className="w-[345px] h-[145.983px] CurveImage"
          />
        </div>
        <div className=" ContentDirection overflow-hidden z-[999] flex items-center bg-[#cce5cc] px-[26px] pt-[52px] rounded-[64px] justify-between gap-[26px] w-[100%]">
          <div className="relative top-[1rem] PhoneImageContainer">
            <Image
              src="/images/Home.png"
              alt="opportunities"
              width={118.956}
              height={257}
              className="w-[720.956px] h-[230px] PhoneImage"
            />
          </div>
          <div>
            <h1 className=" OpportAgricTitle text-black font-montserrat text-center text-[17px] font-medium">
              Unlock Fresh Opportunities in Agriculture
            </h1>
            <p className="text-black font-montserrat text-[13px] leading-6 font-normal">
              Discover a world of possibilities in agriculture. Whether
              you$apos;re looking for the finest produce or unique agricultural
              products, our platform connects you with trusted sellers, ensuring
              quality and freshness with every order.
            </p>
          </div>
        </div>

        <div className="flex flex-col mt-4 gap-[4px] w-[100%]">
          <div className="flex flex-col gap-[4px] mt-[0.7rem] w-[100%]">
            <span className="text-[#2b2b2b] font-montserrat text-[15px] font-medium ">
              Key Benefits:
            </span>
            <ul
              role="list"
              className="text-[#2b2b2b] ml-[1.6rem] mr-[0rem] w-[94%] list-disc"
            >
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Wide Selection: Access a diverse range of agricultural products,
                from farm-fresh produce to artisanal goods
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Direct Access: Connect directly with farmers and sellers,
                eliminating middlemen and ensuring fair prices
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Secure Transactions: Enjoy safe and transparent transactions,
                with payment options that suit your preferences.
              </li>
              <li className="text-[#2b2b2b] text-[14px] leading-6">
                Efficient Delivery: Get your orders delivered to your doorstep,
                hassle-free.
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 mt-7"
          >
            <p className="font-montserrat text-[15px] font-normal text-[#538E53]">
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
