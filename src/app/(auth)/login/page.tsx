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
import { setUserSession } from "@/utils/loginAuth";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import { useRouter } from "next/navigation";
import axios from "axios";

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
      console.log("🚀 Attempting login with:", { email: data.email });

      const response = await axios.post(
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

      console.log("📊 Complete response:", {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      });

      if (response.status === 204) {
        throw new Error("Server returned 204 No Content - no data received");
      }

      if (!response.data) {
        throw new Error("Response body is empty");
      }

      console.log("✅ Login response received:", response.data);

      let user, token, roles, activeRole;

      if (response.data.user && response.data.token) {
        user = response.data.user;
        token = response.data.token;
        roles = user.roles || [];
        activeRole = user.activeRole || null;
      } else if (response.data.token) {
        token = response.data.token;
        user = {
          email: data.email,
          name: data.email.split("@")[0],
          roles: [],
          activeRole: null,
        };
        roles = user.roles;
        activeRole = user.activeRole;
      } else {
        throw new Error("No authentication token received from server");
      }

      console.log("🔍 User data:", user);
      console.log("🔍 Token:", token);
      console.log("🔍 Roles:", roles);
      console.log("🔍 Active Role:", activeRole);

      if (!token) {
        throw new Error("No authentication token received from server");
      }

      // Store auth data
      localStorage.setItem("authToken", token);
      setUserSession({
        email: user.email,
        name: user.name,
        token,
        roles,
        activeRole,
      });

      toast.dismiss(toastId);
      toast.success(`Welcome back, ${user.name}!`);
      reset();

      // Improved redirect logic that preserves active role
      // Replace the redirect logic in your onSubmit function with this:

      // Improved redirect logic - always go to active role if user has one
      console.log("🔍 Redirect logic:", {
        activeRole,
        roles,
      });

      let redirectPath = "/register-as";

      // If user has an active role, go directly to their dashboard
      if (activeRole) {
        localStorage.setItem("userRole", activeRole);
        redirectPath = `/${activeRole}`;
      } else if (roles && roles.length > 0) {
        // User has roles but no active role
        // Check if any role has completed onboarding to set as default
        const completedRole: string | undefined = (roles as string[]).find(
          (role: string) =>
            localStorage.getItem(`onboardingCompleted-${role}`) === "true"
        );

        if (completedRole) {
          // Set the first completed role as active and go to its dashboard
          activeRole = completedRole;
          localStorage.setItem("userRole", completedRole);

          // Update session with active role
          const currentSession = JSON.parse(
            localStorage.getItem("session") || "{}"
          );
          localStorage.setItem(
            "session",
            JSON.stringify({
              ...currentSession,
              activeRole: completedRole,
            })
          );

          redirectPath = `/${completedRole}`;
        } else {
          // User has roles but none completed - let them choose
          redirectPath = "/register-as";
        }
      } else {
        // New user with no roles
        redirectPath = "/register-as";
      }

      console.log("🎯 Redirecting to:", redirectPath);
      setTimeout(() => {
        router.replace(redirectPath);
      }, 1500);
    } catch (err: any) {
      console.error("❌ Login error:", err);
      toast.dismiss(toastId);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to login. Please try again.",
        {
          duration: 5000,
          position: "top-center",
        }
      );
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
