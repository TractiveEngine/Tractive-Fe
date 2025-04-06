import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";

export const OpportAgric = () => {
  return (
    <section className="w-full bg-[#f1f1f1] py-6">
      <div className="w-[90%] mx-auto flex flex-col gap-20 lg:flex-row lg:items-center">
        <div className="w-[100%]">
          <Image
            src="/images/opportAgric.png"
            alt="opportunities"
            width={618}
            height={467}
          />
        </div>
        <div className="flex flex-col gap-[4px] w-[115vw]">
          <h1 className="text-black font-montserrat text-[20px] font-medium">
            Unlock Fresh Opportunities in Agriculture
          </h1>
          <p className="text-black font-montserrat text-[17px] font-medium">
            Discover a world of possibilities in agriculture. Whether you're
            looking for the finest produce or unique agricultural products, our
            platform connects you with trusted sellers, ensuring quality and
            freshness with every order.
          </p>
          <div className="flex flex-col gap-[4px] mt-[0.7rem] w-[100%]">
            <span className="text-[#2b2b2b] font-montserrat text-[15px] font-medium ">
              Key Benefits:
            </span>
            <ul
              role="list"
              className="text-[#2b2b2b] ml-[1.6rem] mr-[4rem] w-[100%] list-disc"
            >
              <li className="text-[#2b2b2b] ">
                Wide Selection: Access a diverse range of agricultural products,
                from farm-fresh produce to artisanal goods
              </li>
              <li className="text-[#2b2b2b]">
                Direct Access: Connect directly with farmers and sellers,
                eliminating middlemen and ensuring fair prices
              </li>
              <li className="text-[#2b2b2b]">
                Secure Transactions: Enjoy safe and transparent transactions,
                with payment options that suit your preferences.
              </li>
              <li className="text-[#2b2b2b]">
                Efficient Delivery: Get your orders delivered to your doorstep,
                hassle-free.
              </li>
            </ul>
          </div>
          <Link href="/signup" className="flex items-center gap-2 mt-7">
            <p className="font-montserrat text-[20px] font-normal text-[#538E53]">
              Register as a buyer
            </p>
            <span className="w-[30px] h-[30px] bg-[#CCE5CC] rounded-full flex items-center justify-center">
              <GoArrowRight className="text-[#538E53] w-[24px] h-[24px]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
