import Image from "next/image";
import React from "react";

export const HowToRegisterASATransporter = () => {
  return (
    <div className="w-full py-10">
      <div className="w-[90%] mx-auto">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="w-full">
            <Image
              src="/images/transporterReg.png"
              alt="Register as a Transporter"
              width={352}
              height={182}
              className="w-full object-cover"
            />
          </div>

          <div className="text-[#2b2b2b] text-[14px] font-montserrat font-normal">
            <p>
              Payments and Orders on Agrictech <br /> At Agrictech, we ensure a
              seamless payment and ordering process. Choose from various secure
              payment options and complete transactions easily. Browse products,
              add them to your cart, and review your order before checkout.
              Track your order's progress and reach out to our customer support
              for assistance. Trust Agrictech for safe and convenient payments
              and orders. The Agrictech Team
            </p>
            <p className="mt-[2.5rem]">The Agrictech Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};
