"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getStoredUser, setUserSession, getAuthToken } from "@/utils/loginAuth";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
// import { ClipLoader } from "react-spinners"; // Import spinner
import bcrypt from "bcryptjs"; // ✅ Imported bcrypt
import { useRouter } from "next/navigation";


// ✅ Token generator function
function generateFakeToken(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}


// Simple spinner component to show when loading
const Spinner = () => (
  <div className="w-4 h-4 border-4 border-b-2 border-[#a0dfa0] border-t-[#538e53]  rounded-full animate-spin" />
);
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const StoredUser = getStoredUser();
      console.log(StoredUser);

      console.log("Stored Email:", StoredUser?.email);
      console.log("Input Email:", data.email);
      console.log(
        "Match Email:",
        data.email.trim().toLowerCase() ===
          StoredUser?.email.trim().toLowerCase()
      );

      console.log("Stored Password:", StoredUser?.password);
      console.log("Input Password:", data.password);
      console.log(
        "Match Password:",
        data.password.trim() === StoredUser?.password.trim()
      );

      if (!StoredUser) {
        toast.dismiss(toastId); // Dismiss the loading toast
        toast.error("No account found. Please sign up.");
        setLoading(false);
        return;
      }

      const emailMatch =
        data.email.trim().toLowerCase() ===
        StoredUser.email.trim().toLowerCase();

      const passwordMatch = await bcrypt.compare(
        data.password,
        StoredUser.password
      );

      if (!emailMatch || !passwordMatch) {
        toast.dismiss(toastId);
        toast.error("Incorrect email or password.");
        setLoading(false);
        return;
      }
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
      // Assuming the token is returned from the backend on successful login
      // const fakeToken = generateFakeToken(); // Replace this with the actual token from your API

      // ✅ Store fake token on success
      const fakeToken = generateFakeToken();
      localStorage.setItem("authToken", fakeToken);
      console.log("👉 Generated fake token:", fakeToken);
      // Wait 1 second to show "Verifying..." then navigate
      await wait(2000);

      setUserSession({
        email: StoredUser.email,
        password: StoredUser.password,
        fullName: StoredUser.fullName,
        token: fakeToken, // Include the token
      });

      toast.dismiss(toastId); // Dismiss the loading toast
      await new Promise((res) => setTimeout(res, 2000));
      toast.success(`Welcome back, ${StoredUser.fullName}!`);
      reset();

      // ✅ Check onboarding progress
      const onboardingCompleted =
        localStorage.getItem("onboardingCompleted") === "true";
      const userRole = localStorage.getItem("userRole");

      setTimeout(() => {
        if (!onboardingCompleted) {
          router.push("/onboarding");
        } else if (!userRole) {
          router.push("/register-as");
        } else {
          router.push(`/${userRole}`);
        }
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      toast.dismiss(toastId); // Dismiss the loading toast
      toast.error("Login failed. Try again.");
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

        <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center h-screen">
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
              Login
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 pb-10"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-montserrat text-[#2b2b2b] mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="example@gmail.com"
                  className="w-full py-2 px-3 rounded-md border border-[#ccc] text-[12px] text-[#808080] placeholder-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-[13px] font-montserrat text-[#2b2b2b] mb-1"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  placeholder="xxxxxxxxx"
                  className="w-full py-2 px-3 pr-10 rounded-md border border-[#ccc] text-[12px] text-[#808080] placeholder-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
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

              <Link
                href="/reset-password"
                className="flex justify-end text-[#538e53] text-[12px]"
              >
                Forget password
              </Link>

              {/* Submit Button */}
              <div>
                <Button
                  onClick={() => handleSubmit(onSubmit)()}
                  text={
                    loading ? (
                      <div className="flex items-center justify-center gap-2.5">
                        <Spinner />
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Login"
                    )
                  }
                  disabled={loading}
                  className="w-full justify-center"
                />
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {/* OR */}
                <div className="flex items-center">
                  <div className="flex-grow h-px bg-[#ccc]" />
                  <span className="px-4 text-[13px] text-[#808080] font-montserrat whitespace-nowrap">
                    Or Login with
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

                <div className="mt-2 mb-10">
                  <p className="font-montserrat text-[13px] text-center text-[#2b2b2b]">
                    Don&apos;t have an account?{" "}
                    <Link className="text-[#538e53]" href="/signup">
                      Sign up
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
