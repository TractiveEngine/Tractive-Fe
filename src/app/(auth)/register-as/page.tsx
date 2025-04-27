"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingForm() {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const router = useRouter();

  // Placeholder function to simulate sending a POST request
  const sendPostRequest = (role: string) => {
    console.log(`Sending request for ${role}`);
    // Here you would make the actual API call, e.g.:
    // fetch('/api/role', { method: 'POST', body: JSON.stringify({ role }) });

    // After the API request, redirect to the corresponding dashboard
    if (role === "buyer") {
      router.push("/buyers");
    } else if (role === "transporter") {
      router.push("/transporter-dashboard");
    } else if (role === "agent") {
      router.push("/agent-dashboard");
    }
  };

  const handleContinue = async () => {
    if (!activeRole) return; // Ensure a role is selected

    // First, navigate to success page
    router.push("/success");

    // Simulate sending the POST request after a brief delay
    setTimeout(() => {
      sendPostRequest(activeRole);
    }, 7000); // This delay simulates a brief wait before sending the request
  };

  return (
    <>
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

              <div className="flex items-center justify-between gap-[2rem]">
                {/* Buyer */}
                <div
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    activeRole === "buyer"
                      ? "border-[3.7px] border-[#538e53]"
                      : ""
                  }`}
                  onClick={() => setActiveRole("buyer")}
                >
                  <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                    Buyer
                  </span>
                  <div className="w-[150px] h-[136px] overflow-hidden rounded-[10px]">
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
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    activeRole === "transporter"
                      ? "border-[3.7px] border-[#538e53]"
                      : ""
                  }`}
                  onClick={() => setActiveRole("transporter")}
                >
                  <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                    Transporter
                  </span>
                  <div className="w-[150px] h-[136px] overflow-hidden rounded-[10px]">
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
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    activeRole === "agent"
                      ? "border-[3.7px] border-[#538e53]"
                      : ""
                  }`}
                  onClick={() => setActiveRole("agent")}
                >
                  <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                    Agent
                  </span>
                  <div className="w-[150px] h-[136px] overflow-hidden rounded-[10px]">
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

              <Button
                text="Continue"
                onClick={handleContinue}
                className="justify-center mx-auto w-[85%] !rounded-[4px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
