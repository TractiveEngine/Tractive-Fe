"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { getAuthToken, getLoggedInUser } from "@/utils/loginAuth";
import axios from "axios";

export default function RegisterAs() {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized access. Login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    const user = getLoggedInUser();
    if (user && user.roles) {
      setUserRoles(user.roles);
    }

    // Pre-select role from pendingRole if set (from Agent_ProfileDropDown)
    const pendingRole = localStorage.getItem("pendingRole");
    if (
      pendingRole &&
      ["agent", "transporter", "buyer"].includes(pendingRole)
    ) {
      setActiveRole(pendingRole);
    }
  }, [router]);

  const handleRoleAction = async () => {
    if (!activeRole) {
      toast.warning("Please select a role before continuing.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized access. Login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    const loadingToastId = toast.loading(
      userRoles.includes(activeRole)
        ? `Switching to ${activeRole} role...`
        : `Adding ${activeRole} role...`,
      {
        position: "top-center",
      }
    );

    setIsLoading(true);

    try {
      // Update session regardless of whether it's a new role or existing role
      const user = getLoggedInUser();
      if (user) {
        const updatedSession = {
          ...user,
          activeRole, // Always set the active role
          roles: userRoles.includes(activeRole)
            ? user.roles
            : [...user.roles, activeRole], // Add role if new
        };
        localStorage.setItem("session", JSON.stringify(updatedSession));
        localStorage.setItem("userRole", activeRole); // Maintain legacy

        console.log("Updated session:", updatedSession);
      }

      if (userRoles.includes(activeRole)) {
        // Existing role - call API to switch
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";
        const response = await axios.post(
          `${API_URL}/api/auth/add-account`,
          { role: activeRole },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.error || "Failed to switch role.");
        }

        toast.dismiss(loadingToastId);
        toast.success(`Switched to ${activeRole} role!`, {
          duration: 2000,
          position: "top-center",
        });

        const onboardingCompleted =
          localStorage.getItem(`onboardingCompleted-${activeRole}`) === "true";
        const redirectPath = onboardingCompleted
          ? `/${activeRole}`
          : "/onboarding";

        router.push(redirectPath);
      } else {
        // New role - go directly to onboarding
        toast.dismiss(loadingToastId);
        toast.success(`Selected ${activeRole} role. Complete onboarding.`, {
          duration: 2000,
          position: "top-center",
        });
        router.push("/onboarding");
      }
    } catch (error: any) {
      console.error("Role action error:", error);
      toast.dismiss(loadingToastId);
      toast.error(error.message || "Failed to process role.", {
        duration: 3000,
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

      <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center min-h-screen">
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

            <div className="Role_selection hide-scrollbar flex gap-4">
              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] md:min-w-[160px] snap-center"
                onClick={() => setActiveRole("buyer")}
              >
                <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                  Buyer {userRoles.includes("buyer") && "(Added)"}
                </span>
                <div
                  className={`w-[120px] h-[108px] sm:w-[150px] sm:h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
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
                    className="rounded-[10px] object-cover w-full h-full"
                  />
                </div>
              </div>

              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] md:min-w-[160px] snap-center"
                onClick={() => setActiveRole("transporter")}
              >
                <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                  Transporter {userRoles.includes("transporter") && "(Added)"}
                </span>
                <div
                  className={`w-[120px] h-[108px] sm:w-[150px] sm:h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
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
                    className="rounded-[10px] object-cover w-full h-full"
                  />
                </div>
              </div>

              <div
                className="flex flex-col items-center justify-center gap-1 cursor-pointer min-w-[120px] md:min-w-[160px] snap-center"
                onClick={() => setActiveRole("agent")}
              >
                <span className="text-[14px] text-center font-montserrat text-[#2b2b2b] font-normal">
                  Agent {userRoles.includes("agent") && "(Added)"}
                </span>
                <div
                  className={`w-[120px] h-[108px] sm:w-[150px] sm:h-[136px] overflow-hidden rounded-[10px] transition-all duration-300 ${
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
                    className="rounded-[10px] object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {activeRole && (
              <div className="text-center px-4">
                {activeRole === "agent" && (
                  <p className="text-[13px] text-[#666] font-montserrat">
                    As an agent, CAC registration and business name are optional
                    fields in your profile.
                  </p>
                )}
                {(activeRole === "buyer" || activeRole === "transporter") && (
                  <p className="text-[13px] text-[#666] font-montserrat">
                    As a {activeRole}, you'll need to provide CAC registration
                    and business name details.
                  </p>
                )}
              </div>
            )}

            <Button
              text={
                isLoading ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Loading...
                  </span>
                ) : userRoles.includes(activeRole || "") ? (
                  "Switch Role"
                ) : (
                  "Add Role"
                )
              }
              onClick={handleRoleAction}
              className="justify-center mx-auto w-[85%] !rounded-[4px]"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
