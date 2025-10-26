"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getAuthToken,
  getLoggedInUser,
  setUserSession,
} from "../../../utils/loginAuth";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface RoleOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const roles: RoleOption[] = [
  {
    id: "buyer",
    label: "Buyer",
    description: "Purchase quality produce",
    icon: "/images/buyer-icon.png",
  },
  {
    id: "agent",
    label: "Agent",
    description: "Connect farmers and buyers",
    icon: "/images/agent-icon.png",
  },
  {
    id: "transporter",
    label: "Transporter",
    description: "Deliver agricultural products",
    icon: "/images/transporter-icon.png",
  },
];

export default function RegisterAs() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeRoleSelection = async () => {
      const token = getAuthToken();

      if (!token) {
        toast.error("Unauthorized access. Please login.", {
          duration: 3000,
          position: "top-center",
        });
        router.replace("/login");
        return;
      }

      try {
        console.log("🔍 Step 1: Fetching user profile from /api/profile...");

        // Fetch user profile to get existing roles and activeRole
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

        console.log("✅ Step 2: Profile data received:", profileResponse.data);

        const { user: userData } = profileResponse.data;
        setUser(userData);

        // If user already has an active role, redirect to onboarding or dashboard
        if (userData.activeRole) {
          console.log("✅ User has activeRole:", userData.activeRole);

          const onboardingCompleted =
            localStorage.getItem(
              `${userData.activeRole}OnboardingCompleted`
            ) === "true";

          if (onboardingCompleted) {
            console.log("✅ Onboarding completed, redirecting to dashboard");
            router.replace(`/${userData.activeRole}`);
          } else {
            console.log("✅ Redirecting to onboarding");
            router.replace("/onboarding");
          }
          return;
        }

        // Update session with fresh profile data
        const currentUser = getLoggedInUser();
        if (currentUser) {
          setUserSession({
            email: userData.email || currentUser.email,
            name: userData.name || currentUser.name,
            token: currentUser.authToken || token,
            role: Array.isArray(userData.roles) ? userData.roles : [],
            activeRole: null, // No active role yet
          });
        }

        console.log("✅ Step 3: User ready for role selection");
      } catch (error: any) {
        console.error("❌ Error fetching profile:", error);

        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.", {
            duration: 3000,
            position: "top-center",
          });
          localStorage.removeItem("authToken");
          localStorage.removeItem("session");
          router.replace("/login");
        } else {
          toast.error("Failed to load your profile. Please try again.", {
            duration: 3000,
            position: "top-center",
          });
        }
      }
    };

    initializeRoleSelection();
  }, [router]);

  const handleRoleSelect = async (roleId: string) => {
    if (loading) return;

    const token = getAuthToken();
    if (!token) {
      toast.error("Session expired. Please login again.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(`Setting up your ${roleId} account...`);

    try {
      console.log("🚀 Step 1: Setting selected role to:", roleId);

      setSelectedRole(roleId);

      // Optional: You might want to call an endpoint to set active role
      // or this might be handled during onboarding with /api/auth/add-account
      // For now, we'll just update local state and proceed to onboarding

      // Update session with selected role
      const currentUser = getLoggedInUser();
      if (currentUser) {
        setUserSession({
          email: currentUser.email,
          name: currentUser.name,
          token: currentUser.authToken || token,
          role: currentUser.role,
          activeRole: roleId, // Set the selected role as active
        });

        console.log("✅ Step 2: Session updated with activeRole:", roleId);
      }

      // Save to localStorage for reference
      localStorage.setItem("userRole", roleId);

      toast.dismiss(toastId);
      toast.success(`Great! Let's set up your ${roleId} profile.`);

      console.log(`🎯 Step 3: Redirecting to onboarding for ${roleId}`);

      // Redirect to onboarding form
      setTimeout(() => {
        router.push("/onboarding");
      }, 1500);
    } catch (error: any) {
      console.error("❌ Error selecting role:", error);
      toast.dismiss(toastId);

      let errorMessage = "Failed to select role. Please try again.";

      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });

      setSelectedRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#f1f1f1] md:bg-[#fefefe] lg:flex min-h-screen">
      <div className="hidden lg:block w-[868px] h-screen">
        <Image
          src="/images/signinLogin.png"
          alt="Register as"
          width={868}
          height={1080}
          className="w-[868px] h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center py-10">
        <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
          <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center mb-6">
            <Image
              src="/images/signinloginlogo.png"
              alt="Tractive Logo"
              width={127}
              height={127}
              className="w-[127px] h-[80px]"
            />
          </div>

          <h1 className="text-[24px] lg:text-[20px] py-4 text-center font-montserrat text-[#2b2b2b] md:text-[#538e53] font-normal mb-2">
            How would you like to use Tractive?
          </h1>

          <p className="text-center text-[13px] text-[#808080] mb-8 font-montserrat">
            Select a role to get started
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                disabled={loading}
                className={`p-6 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                  selectedRole === role.id
                    ? "border-[#538e53] bg-[#538e53] text-white"
                    : "border-[#e0e0e0] bg-white hover:border-[#538e53]"
                } ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center">
                  <Image
                    src={role.icon}
                    alt={role.label}
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                </div>

                <h3 className="font-montserrat font-semibold text-[16px]">
                  {role.label}
                </h3>

                <p
                  className={`text-center text-[12px] font-montserrat ${
                    selectedRole === role.id
                      ? "text-[#fefefe]"
                      : "text-[#808080]"
                  }`}
                >
                  {role.description}
                </p>

                {selectedRole === role.id && (
                  <div className="mt-2 text-[12px] font-montserrat">
                    {loading ? "Setting up..." : "Selected ✓"}
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-center text-[12px] text-[#808080] font-montserrat">
            Want to change your role later?{" "}
            <Link
              href="/account-settings"
              className="text-[#538e53] hover:underline"
            >
              Go to settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
