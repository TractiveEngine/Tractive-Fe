"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginSchema, LoginSchemaType } from "../../../schemas/LoginSchema";
import { setUserSession } from "../../../utils/loginAuth";
import { Button } from "../../../components/Button";

const Spinner = () => (
  <div className="w-4 h-4 border-4 border-b-2 border-[#a0dfa0] border-t-[#538e53] rounded-full animate-spin" />
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      console.log("🚀 Step 1: Attempting login with:", { email: data.email });

      // Step 1: Login and get token
      const loginResponse = await axios.post(
        "https://tractive-be.vercel.app/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("✅ Step 2: Login successful, received token");

      if (!loginResponse.data.token) {
        throw new Error("No authentication token received from server");
      }

      const { token } = loginResponse.data;

      // Store token immediately for the next API call
      localStorage.setItem("authToken", token);

      console.log("🔍 Step 3: Fetching user profile with token...");

      // Step 2: Get user profile and roles
      const profileResponse = await axios.get(
        "https://tractive-be.vercel.app/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("✅ Step 4: Profile data received:", profileResponse.data);

      const { user } = profileResponse.data;

      if (!user) {
        throw new Error("No user data received from profile endpoint");
      }

      // Extract user information from profile API
      const userEmail = user.email || data.email;
      const userName = user.name || user.email?.split("@")[0] || "User";
      const userRoles: string[] = Array.isArray(user.roles) ? user.roles : [];
      const activeRole: string | null = user.activeRole || null;

      console.log("📋 User profile:", {
        email: userEmail,
        name: userName,
        roles: userRoles,
        activeRole: activeRole,
      });

      // Step 3: Store complete session data
      setUserSession({
        email: userEmail,
        name: userName,
        token,
        role: userRoles,
        activeRole,
      });

      toast.dismiss(toastId);
      toast.success(`Welcome back, ${userName}!`);
      reset();

      // Step 4: Determine redirect path based on profile data
      console.log("🔍 Determining redirect path...");

      let redirectPath = "/register-as"; // Default for users with no roles

      if (activeRole) {
        // User has an active role selected
        const onboardingCompleted =
          localStorage.getItem(`${activeRole}OnboardingCompleted`) === "true";

        if (onboardingCompleted) {
          // Go directly to dashboard
          localStorage.setItem("userRole", activeRole);
          redirectPath = `/${activeRole}`;
          console.log(`✅ Redirecting to dashboard: ${redirectPath}`);
        } else {
          // Complete onboarding for this role
          redirectPath = "/onboarding";
          console.log("✅ Redirecting to onboarding");
        }
      } else if (userRoles.length > 0) {
        // User has roles but no active role - let them select
        redirectPath = "/register-as";
        console.log(
          "✅ User has roles but no active role, redirecting to role selection"
        );
      } else {
        // New user with no roles
        redirectPath = "/register-as";
        console.log("✅ New user, redirecting to role registration");
      }

      console.log("🎯 Final redirect:", redirectPath);

      setTimeout(() => {
        router.replace(redirectPath);
      }, 1500);
    } catch (err: any) {
      console.error("❌ Login error:", err);
      toast.dismiss(toastId);

      let errorMessage = "Failed to login. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Clear any partial session data on error
      localStorage.removeItem("authToken");
      localStorage.removeItem("session");

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
              href="/forget-password"
              className="flex justify-end text-[#538e53] text-[12px]"
            >
              Forget password
            </Link>

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
  );
}
