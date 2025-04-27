"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

// Role data
export const onboardingRoles = [
  {
    id: "buyer",
    title: "Buyer",
    image: "/images/AsABuying.png",
    description: "Register as a Buyer to purchase products.",
    dashboardLink: "/buyers",
  },
  {
    id: "transporter",
    title: "Transporter",
    image: "/images/AsATransporter.png",
    description: "Register as a Transporter to deliver goods.",
    dashboardLink: "/transporter/dashboard",
  },
  {
    id: "agent",
    title: "Agent",
    image: "/images/AsAAgent.png",
    description: "Register as an Agent to facilitate transactions.",
    dashboardLink: "/agent/dashboard",
  },
];

export default function OnboardingForm() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedRole) {
      alert("Please select a role before continuing.");
      return;
    }

    const roleData = onboardingRoles.find((role) => role.id === selectedRole);
    if (!roleData) return;

    // Step 1: Navigate to success page first
    router.push("/onboarding-success");

    // Step 2: After a short delay, simulate sending request and redirect
    setTimeout(async () => {
      try {
        console.log(`Sending registration for: ${selectedRole}`);
        // Simulate API request here (later replace with real API call)
        // await fetch('/api/register', {
        //   method: 'POST',
        //   body: JSON.stringify({ role: selectedRole }),
        //   headers: { 'Content-Type': 'application/json' }
        // });

        // Step 3: Redirect to the dashboard
        router.push(roleData.dashboardLink);
      } catch (error) {
        console.error("Error during registration", error);
      }
    }, 7000); // Wait 2 seconds before redirecting
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
          {/* Logo */}
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
            {/* Instructions */}
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] sm:text-[14px] md:text-[15px] text-center font-montserrat text-[#000] font-normal">
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

            {/* Role Selection */}
            <div className="flex items-center justify-between gap-[2rem]">
              {onboardingRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="text-[12px] sm:text-[13px] md:text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                    {role.title}
                  </span>
                  <div
                    className={`w-[100%] sm:w-[90%] h-auto overflow-hidden rounded-[10px] border-[3.7px] ${
                      selectedRole === role.id
                        ? "border-[#538e53]"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={role.image}
                      alt={`As a ${role.title}`}
                      width={203}
                      height={184}
                      className="rounded-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <Button
              text="Continue"
              onClick={handleContinue}
              className="justify-center mx-auto w-[85%] !rounded-[4px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
