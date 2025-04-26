"use client";
import Image from "next/image";
import React, { useState } from "react";
import OtpInput from "react-otp-input";

export default function AccountVerification() {
  const [otp, setOtp] = useState("");

  return (
    <div className="w-[100%] bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      {/* Image on the left (only visible on lg screens) */}
      <div className="hidden lg:block w-[668px] h-screen">
        <Image
          src="/images/Tomato.png"
          alt="tomatoCarrot"
          width={868}
          height={1080}
          className="w-[868px] h-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center lg:my-auto h-screen">
        <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
          <h1 className="text-[28px] lg:text-[23px] py-4 text-center font-montserrat text-[#2b2b2b] font-normal">
            Account Verification
          </h1>
          <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center">
            <Image
              src="/images/verificationIcon.png"
              alt="Account Verification"
              width={100}
              height={100}
              className="w-[100px] h-[80px]"
            />
          </div>

          <form className="flex flex-col gap-3 pb-10">
            <div className="mt-4">
              <p className="text-[15px] text-center font-montserrat text-[#2b2b2b] font-normal">
                Enter the code sent to
              </p>
              <p className="text-[15px] text-center font-montserrat text-[#2b2b2b] font-[500]">
                Chikeziekelvin24@gmail.com
              </p>
            </div>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={5}
              renderSeparator={<span className="mx-2"></span>}
              renderInput={(props) => <input {...props} />}
              containerStyle="flex justify-center gap-3 mt-5"
              inputStyle="!w-[50.931px] h-[50.931px] text-lg rounded-[1.769px] border border-[#808080] text-center outline-none focus:border-[#538e53] focus:ring-[0.2px] focus:ring-[#538e53] transition duration-200"
            />

            {/* Submit Button */}
            <div className="mt-3">
              <p className="text-[13px] text-center font-montserrat text-[#2b2b2b] font-normal">
                I didn't receive any code.{" "}
                <span className="text-[#538e53]">Resend</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
