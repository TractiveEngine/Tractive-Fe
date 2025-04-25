import Image from "next/image";
import React from "react";

export const HowToBuyOnAgricTech = () => {
  return (
    <div className="w-full py-2">
      <div className="w-[90%] mx-auto">
        <div className="flex gap-4 flex-col md:flex-row">
          <div>
            <Image
              src="/images/AgricTechCart.png"
              alt="Register as a Transporter"
              width={352}
              height={182}
              className="w-full object-cover"
            />
          </div>

          <div className="text-[#2b2b2b] text-[14px] font-montserrat font-normal">
            <ol className="list-decimal list-inside space-y-2 w-[100%] flex flex-col gap-2 text-[#2b2b2b]">
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                Explore products and find what you need.
              </li>
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                pricing, and options. Add desired items to your cart.
              </li>
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                Review your cart and make any necessary adjustments.
              </li>
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                Proceed to checkout and provide shipping information.
              </li>
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                {" "}
                Choose a payment method and complete the transaction.
              </li>
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                Receive an order confirmation with details.
              </li>
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                Track your order$apos;s progress if available.
              </li>
              <li className="text-[#2b2b2b] font-montserrat text-[13px] font-normal">
                Receive your purchased items and enjoy!
              </li>
            </ol>
            <p className="text-[#2b2b2b] font-montserrat text-[13px] font-normal leading-5 mt-2">
              Happy buying on Agrictech!
              <br />
              The Agrictech Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
