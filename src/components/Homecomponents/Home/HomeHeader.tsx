import Image from "next/image";
import Link from "next/link";
import React from "react";

export const HomeHeader = () => {
  return (
    <section className="w-[100%] h-[433px] bg-[#C3E3C34D]">
      <div className="relative mx-auto w-[90%] flex">
        <div className="relative z-10 flex flex-col w-[85%] gap-[0.6rem] pt-20">
          <p className="text-[1.3rem] w-[440px] font-medium text-[#2B2B2B] font-montserrat">
            Empowering Farmers, Buyers, and Transporters with Cutting-Edge
            Technology for a Sustainable Agricultural Ecosystem
          </p>
          <span className="text-[1.035rem] font-normal font-montserrat text-[#538e53]">
            Connect ,Grow, Strive.
          </span>
          <Link
            href="/signup"
            className="w-[217px] flex mt-[2.0625rem] p-[10px] justify-center items-center gap-[10px] rounded-[4px] border-2 border-[#f9f9f9] bg-[#538e53] transition hover:bg-[#CCE5CC] hover:text-[#538E53] text-[#f9f9f9] font-montserrat font-normal text-md"
          >
            Register For Free
          </Link>
        </div>
        <div className="w-[857px] h-auto absolute -right-10 top-5 flex justify-center items-center">
          <Image
            src="/images/homeheader.png"
            alt="home image"
            width={972}
            height={433}
            className="w-[972px] h-[433px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};
