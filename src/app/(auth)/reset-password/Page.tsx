"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ForgetPassword() {
        return (
          <div className="w-[100%] bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
            {/* Image on the left (only visible on lg screens) */}
            <div className="hidden lg:block w-[868px] h-screen">
              <Image
                src="/images/tomatoCarrot.png"
                alt="tomatoCarrot"
                width={868}
                height={1080}
                className="w-[868px] h-full"
              />
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center lg:my-auto h-screen">
              <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
                <h1 className='text-[28px] lg:text-[17px] py-4 text-center font-montserrat text-[#2b2b2b] md:text-[#538e53] font-normal"'>
                  Reset Password
                </h1>
                <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center">
                  <Image
                    src="/images/lock.png"
                    alt="Lock"
                    width={100}
                    height={100}
                    className="w-[100px] h-[80px]"
                  />
                </div>

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
                    {/* Submit Button */}
                    <Link href="/email-confirmation" className="mt-6">
                      <Button
                        text="Continue"
                        onClick={() => {}}
                        className="w-full justify-center mt-6"
                      />
                    </Link>
                </form>
              </div>
            </div>
          </div>
        );
}