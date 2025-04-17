import Image from "next/image";
import React from "react";

export const HowToSellOnAgricTech = () => {
  return (
    <div className="w-full py-10">
      <div className="w-[90%] mx-auto">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="w-full">
            <Image
              src="/images/sellingImagepersonal.png"
              alt="How To Sell On AgricTech"
              width={352}
              height={182}
              className="w-full object-cover"
            />
          </div>

          <div className="text-[#2b2b2b] text-[12px] md:text-[13px] lg:text-[14px] font-montserrat font-normal">
            <p className="leading-5">
              Welcome to Agrictech! <br /> To join our platform, you can register
              either through email and password or quickly sign up using your
              social media accounts. Once registered, your account will be
              pending approval by our admin team to ensure a safe and trusted
              community. Please allow some time for the approval process. Once
              approved, you will receive a notification to activate your account
              and gain full access to Agrictech's features. Thank you for
              choosing Agrictech, where we connect farmers, buyers, and a
              thriving agricultural community. Happy farming!
            </p>
            <p className="mt-[2.5rem]">The Agrictech Team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
