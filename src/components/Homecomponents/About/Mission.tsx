import Image from "next/image";
import React from "react";

export const Mission = () => {
  return (
    <div className="w-full bg-[#fefefe] py-[50px]">
      <div className="w-[90%] mx-auto flex items-center justify-center gap-[72px]">
        <div className="w-[100%] flex items-center justify-center">
          <Image
            src="/images/missionImg.png"
            alt="Mission"
            width={315.5}
            height={315.5}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-[20px]">
          <h1 className="text-[#538e53] text-[1.5rem] font-montserrat font-normal text-center">
            Mission
          </h1>
          <p className="text-[#000000] text-left font-montserrat font-normal text-[15.3px] leading-[25px]">
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
      </div>
    </div>
  );
};
