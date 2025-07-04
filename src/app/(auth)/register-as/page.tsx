"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { getAuthToken } from "@/utils/loginAuth";

export default function OnboardingForm() {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 🔐 Redirect unauthorized users
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized access. Login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
    }
  }, [router]);

  const sendPostRequest = (role: string) => {
    console.log(`Sending request for ${role}`);
    if (role === "buyers") {
      router.push("/buyers");
    } else if (role === "transporters") {
      router.push("/transporters");
    } else if (role === "agents") {
      router.push("/agents");
    }
  };

  const handleContinue = async () => {
    if (!activeRole) {
      toast.warning("Please select a role before continuing.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    localStorage.setItem("userRole", activeRole);
    const loadingToastId = toast.loading("⏳ Preparing your dashboard...", {
      position: "top-center",
    });

    setIsLoading(true);
    router.push("/onboarding-success");

    setTimeout(() => {
      toast.dismiss(loadingToastId);
      toast.success("Role selected successfully!", {
        duration: 3000,
        position: "top-center",
      });
      sendPostRequest(activeRole);
      setIsLoading(false);
    }, 7000);
  };

  return (
    <div className="w-full bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      <div className="hidden lg:block w-[868px] h-screen">
        <Image
          src="/images/signinLogin.png"
          alt="signin Login"
          width={668}
          height={1080}
          className="w-[668px] h-full"
        />
      </div>

      <div className="w-full lg:w-[70%] lg:mx-auto flex pt-[3rem] justify-center h-screen">
        <div className="w-[90%] md:w-[80%] mx-auto flex flex-col">
          <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center">
            <Image
              src="/images/signinloginlogo.png"
              alt="signin Login"
              width={127}
              height={80}
              className="w-[127px] h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-[50px] justify-center">
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
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:justify-between">
              {/* Buyer */}
              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] snap-center"
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
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] snap-center"
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
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] snap-center"
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
                    Loading...
                  </span>
                ) : (
                  "Continue"
                )
              }
              onClick={handleContinue}
              className="justify-center mx-auto w-[85%] !rounded-[4px]"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
