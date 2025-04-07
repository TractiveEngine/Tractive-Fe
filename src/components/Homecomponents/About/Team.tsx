import Image from "next/image";
import React from "react";

export const Team = () => {
  return (
    <div className="w-full bg-[#e9ece9]">
      <div className="w-[90%] mx-auto flex flex-col gap-10 py-[50px] pb-16 items-center justify-between lg:flex-row-reverse lg:gap-[72px]">
        {/* Image */}
        <div className="w-full flex justify-center">
          <Image
            src="/images/TeamImage.png"
            alt="Team"
            width={503}
            height={424}
            className="h-auto"
          />
        </div>
        {/* Text */}
        <div className="flex flex-col items-center lg:items-center justify-center gap-[20px]">
          <h1 className="text-[#538e53] text-[1.5rem] font-montserrat font-normal text-center lg:text-center">
            Team
          </h1>
          <p className="text-[#000000] text-center lg:text-left font-montserrat font-normal text-[15.3px] leading-[25px] lg:w-[670px]">
            Discover a world of possibilities in agriculture. Whether you're
            looking for the finest produce or unique agricultural products, our
            platform connects you with trusted sellers, ensuring quality and
            freshness with every order. Discover a world of possibilities in
            agriculture. Whether you're looking for the finest produce or unique
            agricultural products, our platform connects you with trusted
            sellers, ensuring quality and freshness with every order. Discover a
            world of possibilities in agriculture. Whether you're looking for
            the finest produce or unique agricultural products, our platform
            connects you with trusted sellers, ensuring quality and freshness
            with every order.
          </p>
        </div>
      </div>
    </div>
  );
};
