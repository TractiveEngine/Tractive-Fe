import Image from "next/image";
import React from "react";

export const AboutHeader = () => {
  return (
    <div className="bg-[#D9D9D994] w-full">
      <div className="w-[90%] mx-auto py-10 pb-16 flex flex-col gap-[25px] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-[#538e53] text-[1.5rem] font-montserrat font-normal text-center">
            About Us
          </h1>
          <p className="text-[#000000] text-center font-montserrat font-normal text-[15.3px] leading-[25px]">
            Discover a world of possibilities in agriculture. Whether you're
            looking for the finest produce or unique agricultural products, our
            platform connects you with trusted sellers, ensuring quality and
            freshness with every order.,Discover a world of possibilities in
            agriculture. Whether you're looking for the finest produce or unique
            agricultural products, our platform connects you with trusted
            sellers, ensuring quality and freshness with every order., Discover
            a world of possibilities in agriculture. Whether you're looking for
            the finest produce or unique agricultural products, our platform
            connects you with trusted sellers, ensuring quality and freshness
            with every order.
          </p>
        </div>
        <div className="relative w-full flex flex-col items-center">
          <Image
            src="/images/aboutimage.png"
            alt="About Us"
            width={1591}
            height={408}
          />
          <Image
            src="/images/playimage.png"
            alt=""
            width={46}
            height={46}
            className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
