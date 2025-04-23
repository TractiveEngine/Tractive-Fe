"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-[100%] bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      {/* Image on the left (only visible on lg screens) */}
      <div className="hidden lg:block w-[868px] h-screen">
        <Image
          src="/images/signinLogin.png"
          alt="signin Login"
          width={868}
          height={1080}
          className="w-[868px] h-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center lg:my-auto h-screen">
        <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
          <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center">
            <Image
              src="/images/signinloginlogo.png"
              alt="signin Login"
              width={127}
              height={127}
              className="w-[127px] h-[80px]"
            />
          </div>
          <h1 className='text-[24px] lg:text-[17px] py-4 text-center font-montserrat text-[#2b2b2b] md:text-[#538e53] font-normal"'>
            Login
          </h1>

          <form className="flex flex-col gap-3 pb-10">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="font-montserrat block mb-1 text-[13px] font-normal text-[#2b2b2b]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                className="font-montserrat w-full py-2 px-3 rounded-md  border border-[#ccc] text-[12px] text-[#808080] placeholder-[#808080] placeholder:text-[12px] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                required
              />
            </div>

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
                className="font-montserrat w-full py-2 px-3 pr-10 rounded-md border border-[#ccc] text-[12px] text-[#808080] placeholder-[#808080] placeholder:text-[12px] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                required
              />
              <div
                className="absolute top-[36px] right-3 cursor-pointer text-[#808080]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <Link href="/reset-password" className="flex justify-end-safe w-[100%] text-[#538e53] font-montserrat font-normal text-[12px]">Forget password</Link>
            {/* Submit Button */}
            <div className="">
              <Button
                text="Login"
                onClick={() => {}}
                className="w-full justify-center"
              />
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-3">
                {/* OR register with */}
                <div className="flex items-center">
                  <div className="flex-grow h-px bg-[#ccc]" />
                  <span className="px-4 text-[13px] text-[#808080] font-montserrat whitespace-nowrap">
                    Or Login with
                  </span>
                  <div className="flex-grow h-px bg-[#ccc]" />
                </div>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-6 mt-2 text-[24px]">
                  <FaFacebook
                    size={37}
                    className="cursor-pointer text-[#1877F2]"
                  />
                  <FcGoogle size={37} className="cursor-pointer" />
                </div>
              </div>

              <div className="mt-2 mb-10">
                <p className="font-montserrat text-[13px] text-center text-[#2b2b2b]">
                  Don$apos;t have an account?{" "}
                  <Link
                    className="font-montserrat text-[#538e53]"
                    href="/signup"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
