"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa"; // for spinner icon

export default function OnboardingForm() {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const sendPostRequest = (role: string) => {
    console.log(`Sending request for ${role}`);
    if (role === "buyer") {
      router.push("/buyers");
    } else if (role === "transporter") {
      router.push("/transporter-dashboard");
    } else if (role === "agent") {
      router.push("/agent-dashboard");
    }
  };

  const handleContinue = async () => {
    if (!activeRole) {
      toast.error("Please select a role before continuing.");
      return;
    }

    toast.success("Role selected successfully!");
    setIsLoading(true);

    // Navigate first
    router.push("/onboarding-success");

    // Simulate sending the POST request after 7 seconds
    setTimeout(() => {
      sendPostRequest(activeRole);
      setIsLoading(false);
    }, 7000);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
                height={127}
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
              <div className="flex items-center justify-between gap-[2rem]">
                {/* Buyer */}
                <div
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                  onClick={() => setActiveRole("buyer")}
                >
                  <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                    Buyer
                  </span>
                  <div
                    className={`w-[150px] h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
                      activeRole === "buyer"
                        ? "border-[3.7px] border-[#538e53] shadow-lg"
                        : "border-[2px] border-transparent"
                    }`}
                  >
                    <Image
                      src="/images/AsABuying.png"
                      alt="As a Buyer"
                      width={203}
                      height={184}
                      className="rounded-[10px]"
                    />
                  </div>
                </div>

                {/* Transporter */}
                <div
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                  onClick={() => setActiveRole("transporter")}
                >
                  <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                    Transporter
                  </span>
                  <div
                    className={`w-[150px] h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
                      activeRole === "transporter"
                        ? "border-[3.7px] border-[#538e53] shadow-lg"
                        : "border-[2px] border-transparent"
                    }`}
                  >
                    <Image
                      src="/images/AsATransporter.png"
                      alt="As a Transporter"
                      width={203}
                      height={184}
                      className="rounded-[10px]"
                    />
                  </div>
                </div>

                {/* Agent */}
                <div
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                  onClick={() => setActiveRole("agent")}
                >
                  <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                    Agent
                  </span>
                  <div
                    className={`w-[150px] h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
                      activeRole === "agent"
                        ? "border-[3.7px] border-[#538e53] shadow-lg"
                        : "border-[2px] border-transparent"
                    }`}
                  >
                    <Image
                      src="/images/AsAAgent.png"
                      alt="As an Agent"
                      width={203}
                      height={184}
                      className="rounded-[10px]"
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
    </>
  );
}
