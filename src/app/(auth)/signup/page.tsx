"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, SignupSchema } from "@/schemas/SignupSchemas";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { useEmailUser } from "@/context/userEmailContext";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setEmail } = useEmailUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    toast.loading("signing up...");

    try {
      console.log("✅ Signup Data:", data);

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const existingUsers: { email: string; [key: string]: unknown }[] = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const userExists = existingUsers.find(
        (user) => user.email === data.email
      );

      if (userExists) {
        toast.dismiss();
        toast.error("User already exists!");
        setLoading(false);
        return;
      }

      const generatedOtp = Math.floor(10000 + Math.random() * 90000).toString();

      const newUser = {
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
      };

      setEmail(newUser.email);
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      localStorage.setItem("pendingUser", JSON.stringify(newUser));
      localStorage.setItem("pendingOtp", generatedOtp);

      await emailjs.send(
        "service_m7cl6ac",
        "template_czhc5l1",
        {
          user_email: data.email,
          user_name: data.fullName,
          otp: generatedOtp,
        },
        "dlmHlpTbVPKHFCtFa"
      );

      await new Promise((res) => setTimeout(res, 2000));

      toast.dismiss();
      toast.success(`OTP sent to ${data.email}`);

      console.log("👉 Your OTP is:", generatedOtp);

      reset();

      setTimeout(() => {
        router.push("/email-confirmation");
      }, 1000);
    } catch (err) {
      console.log("signup failed. Try again.", err);

      toast.dismiss();
      toast.error("signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
        <div className="hidden lg:block w-[868px] h-screen">
          <Image
            src="/images/signinLogin.png"
            alt="signin Login"
            width={868}
            height={1080}
            className="w-[868px] h-full"
          />
        </div>

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
            <h1 className="text-[24px] lg:text-[17px] py-4 text-center font-montserrat text-[#2b2b2b] md:text-[#538e53] font-normal">
              Sign up
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 pb-10"
            >
              <div>
                <label
                  htmlFor="full-name"
                  className="font-montserrat block mb-1 text-[13px] font-normal text-[#2b2b2b]"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  {...register("fullName")}
                  className="font-montserrat w-full py-2 px-3 rounded-md border border-[#ccc] text-[12px] text-[#808080] placeholder-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                  className="font-montserrat w-full py-2 px-3 rounded-md border border-[#ccc] text-[12px] text-[#808080] placeholder-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

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
                  className="font-montserrat w-full py-2 px-3 pr-10 rounded-md border border-[#ccc] text-[12px] text-[#808080] placeholder-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
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

              <Button
                className="w-full justify-center"
                onClick={() => handleSubmit(onSubmit)()}
                text={loading ? "Signing up..." : "signup"}
                disabled={loading}
              />

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <div className="flex-grow h-px bg-[#ccc]" />
                    <span className="px-4 text-[13px] text-[#808080] font-montserrat whitespace-nowrap">
                      Or register with
                    </span>
                    <div className="flex-grow h-px bg-[#ccc]" />
                  </div>
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
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#538e53]">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
