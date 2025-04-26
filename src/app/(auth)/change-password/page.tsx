"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ChangePasswordFormData, ChangePasswordSchema } from "@/schemas/changePasswordSchema";

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    console.log("Password reset data:", data);
    toast.success("Password changed successfully!");
    // Handle password reset logic (e.g. API call)
  };

  return (
    <div className="w-[100%] bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      <div className="hidden lg:block w-[648px] h-screen">
        <Image
          src="/images/callingWoman.png"
          alt="calling Woman"
          width={868}
          height={1080}
          className="w-[868px] h-full"
        />
      </div>

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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 pb-10"
          >
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
                {...register("password")}
                placeholder="xxxxxxxxx"
                className="font-montserrat w-full py-2 px-3 pr-10 rounded-md border border-[#ccc] text-[13px] text-[#808080] placeholder-[#808080] placeholder:text-[12px] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
              />
              <div
                className="absolute top-[36px] right-3 cursor-pointer text-[#808080]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="font-montserrat block mb-1 text-[13px] font-normal text-[#2b2b2b]"
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="xxxxxxxxx"
                className="font-montserrat w-full py-2 px-3 pr-10 rounded-md border border-[#ccc] text-[13px] text-[#808080] placeholder-[#808080] placeholder:text-[12px] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
              />
              <div
                className="absolute top-[36px] right-3 cursor-pointer text-[#808080]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              text="Done"
              className="w-full justify-center"
              onClick={() => handleSubmit(onSubmit)()}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
