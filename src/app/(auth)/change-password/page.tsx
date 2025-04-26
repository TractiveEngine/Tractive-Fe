"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-[100%] bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      {/* Image on the left (only visible on lg screens) */}
      <div className="hidden lg:block w-[648px] h-screen">
        <Image
          src="/images/callingWoman.png"
          alt="calling Woman"
          width={868}
          height={1080}
          className="w-[868px] h-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center lg:my-auto h-screen">
        <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
          <div className="flex flex-col mb-10">
            <h1 className='text-[22px] py-4 text-center font-montserrat text-[#2b2b2b] font-normal"'>
              Reset Password
            </h1>

            <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center">
              <Image
                src="/images/Lock.png"
                alt="Lock"
                width={127}
                height={127}
                className="w-[127px] h-[80px]"
              />
            </div>
          </div>

          <form className="flex flex-col gap-6 pb-10">
            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="font-montserrat block mb-1 text-[13px] font-normal text-[#2b2b2b]"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="xxxxxxxxx"
                className="font-montserrat w-full py-2 px-3 pr-10 rounded-md border border-[#ccc] text-[13px] text-[#808080] placeholder-[#808080] placeholder:text-[12px] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                required
              />
              <div
                className="absolute top-[36px] right-3 cursor-pointer text-[#808080]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>

            {/* ConfirmPassword */}
            <div className="relative">
              <label
                htmlFor="confirm-password"
                className="font-montserrat block mb-1 text-[13px] font-normal text-[#2b2b2b]"
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="xxxxxxxxx"
                className="font-montserrat w-full py-2 px-3 pr-10 rounded-md border border-[#ccc] text-[13px] text-[#808080] placeholder-[#808080] placeholder:text-[12px] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                required
              />
              <div
                className="absolute top-[36px] right-3 cursor-pointer text-[#808080]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            {/* Submit Button */}
            <div className="">
              <Button
                text="Done"
                onClick={() => {}}
                className="w-full justify-center"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
