"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import {
  getAuthToken,
  getLoggedInUser,
  setUserSession,
} from "@/utils/loginAuth";
import axios from "axios";

type UserRole = "buyers" | "transporters" | "agents";

export default function RegisterAs() {
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized access. Please login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
    }
  }, [router]);

  const handleContinue = async () => {
    if (!activeRole) {
      toast.warning("Please select a role before continuing.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication required. Please login again.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    setIsLoading(true);
    const loadingToastId = toast.loading("Setting up your account...", {
      position: "top-center",
    });

    try {
      // Convert role from plural to singular for API
      const apiRole =
        activeRole === "buyers"
          ? "buyer"
          : activeRole === "transporters"
          ? "transporter"
          : "agent";

      console.log("🚀 Adding account role:", apiRole);

      // Call add-account API to set user role
      const response = await axios.post(
        "https://tractive-be.vercel.app/api/auth/add-account",
        { role: apiRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("✅ Add account response:", response.data);

      if (response.data.user) {
        const { user } = response.data;

        // Update local session with new role information
        const currentUser = getLoggedInUser();
        if (currentUser) {
          setUserSession({
            email: currentUser.email,
            name: currentUser.name,
            token: currentUser.authToken || token,
            role: user.role || [apiRole],
            activeRole: user.activeRole || apiRole,
          });
        }

        // Store the selected role locally
        localStorage.setItem("userRole", apiRole);

        toast.dismiss(loadingToastId);
        toast.success("Role selected successfully!", {
          duration: 3000,
          position: "top-center",
        });

        // Redirect based on role
        setTimeout(() => {
          // For agents and admins, they can skip onboarding or have optional fields
          // For buyers and transporters, onboarding is required
          if (apiRole === "agent") {
            router.push("/onboarding"); // Optional onboarding for agents
          } else {
            router.push("/onboarding"); // Required onboarding for buyers/transporters
          }
        }, 1500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("❌ Role selection error:", error);
      toast.dismiss(loadingToastId);

      let errorMessage = "Failed to set up your account. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#f1f1f1] md:bg-[#fefefe] lg:flex min-h-screen">
      <div className="hidden lg:block w-[868px] h-screen">
        <Image
          src="/images/signinLogin.png"
          alt="signin Login"
          width={668}
          height={1080}
          className="w-[668px] h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-[70%] lg:mx-auto flex pt-[3rem] items-center justify-center min-h-screen">
        <div className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto flex flex-col">
          <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center">
            <Image
              src="/images/signinloginlogo.png"
              alt="signin Login"
              width={127}
              height={80}
              className="w-[127px] h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-[50px] justify-center items-center">
            <div className="flex flex-col gap-0.5">
              <p className="text-[15px] text-center font-montserrat text-[#000] font-normal">
                Register either as a transporter, buyer, or agent
              </p>
              <p className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                Want more clarification?
                <Link
                  href="/help-center"
                  className="text-[#538e53] font-medium"
                >
                  {" "}
                  Click here
                </Link>
              </p>
            </div>

            {/* Role selection */}
            <div className="Role_selection hide-scrollbar flex gap-8 justify-center items-center">
              {/* Buyer */}
              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] md:min-w-[160px] snap-center"
                onClick={() => setActiveRole("buyers")}
              >
                <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                  Buyer
                </span>
                <div
                  className={`w-[120px] h-[108px] sm:w-[150px] sm:h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
                    activeRole === "buyers"
                      ? "border-[3.7px] border-[#538e53] shadow-lg"
                      : "border-[2px] border-transparent"
                  }`}
                >
                  <Image
                    src="/images/AsABuying.png"
                    alt="As a Buyer"
                    width={203}
                    height={184}
                    className="rounded-[10px] object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Transporter */}
              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] md:min-w-[160px] snap-center"
                onClick={() => setActiveRole("transporters")}
              >
                <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                  Transporter
                </span>
                <div
                  className={`w-[120px] h-[108px] sm:w-[150px] sm:h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
                    activeRole === "transporters"
                      ? "border-[3.7px] border-[#538e53] shadow-lg"
                      : "border-[2px] border-transparent"
                  }`}
                >
                  <Image
                    src="/images/AsATransporter.png"
                    alt="As a Transporter"
                    width={203}
                    height={184}
                    className="rounded-[10px] object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Agent */}
              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] md:min-w-[160px] snap-center"
                onClick={() => setActiveRole("agents")}
              >
                <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                  Agent
                </span>
                <div
                  className={`w-[120px] h-[108px] sm:w-[150px] sm:h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
                    activeRole === "agents"
                      ? "border-[3.7px] border-[#538e53] shadow-lg"
                      : "border-[2px] border-transparent"
                  }`}
                >
                  <Image
                    src="/images/AsAAgent.png"
                    alt="As an Agent"
                    width={203}
                    height={184}
                    className="rounded-[10px] object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              text={
                isLoading ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Setting up account...
                  </span>
                ) : (
                  "Continue"
                )
              }
              onClick={handleContinue}
              className="justify-center mx-auto w-[85%] !rounded-[4px]"
              disabled={isLoading || !activeRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
