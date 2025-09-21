"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgetPasswordSchema,
  ForgetPasswordSchemaType,
} from "@/schemas/forgetPasswordSchema";
import { forgotPassword } from "@/utils/foegetPasswordAuth";

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgetPasswordSchemaType>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: ForgetPasswordSchemaType) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    const result = await forgotPassword(data);

    if (result.error) {
      setApiError(result.error);
    } else {
      setSuccessMessage(
        result.message || "Password reset email sent successfully!"
      );
      reset(); // Clear the form
    }

    setIsLoading(false);
  };

  return (
    <div className="w-[100%] bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      {/* Image */}
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
          <h1 className="text-[28px] lg:text-[17px] py-4 text-center font-montserrat text-[#2b2b2b] md:text-[#538e53] font-normal">
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 pb-10"
          >
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
                {...register("email")}
                placeholder="example@gmail.com"
                className={`font-montserrat w-full py-2 px-3 rounded-md border ${
                  errors.email ? "border-red-500" : "border-[#ccc]"
                } text-[12px] text-[#808080] placeholder-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.email.message}
                </p>
              )}
              {apiError && (
                <p className="text-red-500 text-[12px] mt-1">{apiError}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-[12px] mt-1">
                  {successMessage}
                </p>
              )}
            </div>

            <div className="mt-6">
              <Button
                text={isLoading ? "Sending..." : "Continue"}
                onClick={() => handleSubmit(onSubmit)()}
                className="w-full justify-center mt-6"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
