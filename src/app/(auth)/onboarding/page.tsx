"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getOnboardingSchema,
  OnboardingSchemaType,
} from "@/schemas/onboardingSchema";
import Image from "next/image";
import { Button } from "@/components/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosCheckmark } from "react-icons/io";
import { toast } from "sonner";
import {
  getAuthToken,
  getLoggedInUser,
  setUserSession,
} from "@/utils/loginAuth";
import axios from "axios";

const interests = [
  "fish",
  "Tubers",
  "Grains",
  "Edible",
  "Livestock",
  "Vegetable",
] as const;

type InterestType = (typeof interests)[number];

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    []
  );
  const router = useRouter();

  // Get the appropriate schema based on user role
  const schema = getOnboardingSchema(userRole);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      interests: [] as unknown as [InterestType, ...InterestType[]],
    },
  });

  // Register the interests field
  useEffect(() => {
    register("interests");
  }, [register]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized access. Please login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    // Get user role from localStorage or session
    const user = getLoggedInUser();
    const role = user?.activeRole || localStorage.getItem("userRole");

    if (!role) {
      toast.error("Please select a role first.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/register-as");
      return;
    }

    setUserRole(role);
    setValue("role", role as any);

    // Load saved onboarding data if exists
    const saved = localStorage.getItem(`onboarding-data-${role}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as OnboardingSchemaType;

        // Restore form values
        Object.keys(parsed).forEach((key) => {
          if (
            key === "interests" &&
            Array.isArray(parsed[key as keyof OnboardingSchemaType])
          ) {
            const interests = parsed[
              key as keyof OnboardingSchemaType
            ] as InterestType[];
            setSelectedInterests(interests);
            setValue(
              "interests",
              interests as [InterestType, ...InterestType[]],
              {
                shouldValidate: true,
              }
            );
          } else {
            setValue(
              key as keyof OnboardingSchemaType,
              parsed[key as keyof OnboardingSchemaType]
            );
          }
        });
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [setValue, router, register]);

  const toggleInterest = (interest: InterestType) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((item) => item !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(updated);

    // Type assertion to handle Zod's tuple requirement
    setValue("interests", updated as [InterestType, ...InterestType[]], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: OnboardingSchemaType) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized access. Please login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    // Use the data from the form instead of separate state
    if (!data.interests || data.interests.length === 0) {
      toast.error("Please select at least one interest.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Completing your profile...");

    try {
      const finalData = {
        ...data,
        role: userRole,
      };

      console.log("🚀 Submitting onboarding data:", finalData);

      // Call add-account API to update user profile with onboarding data
      const response = await axios.post(
        "https://tractive-be.vercel.app/api/auth/add-account",
        {
          role: userRole,
          businessName: finalData.businessName || undefined,
          villageOrLocalMarket: finalData.villageOrLocalMarket,
          phone: finalData.phone,
          nin: finalData.nin || undefined,
          interests: finalData.interests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      console.log("✅ Onboarding response:", response.data);

      // Update local session with role information since backend returns user data
      if (response.data.user) {
        const currentUser = getLoggedInUser();
        if (currentUser) {
          setUserSession({
            email: currentUser.email,
            name: currentUser.name,
            token: currentUser.authToken || token,
            role: response.data.user.role || [userRole],
            activeRole: response.data.user.activeRole || userRole,
          });
        }
      } else {
        // Fallback: update session with role info manually
        const currentUser = getLoggedInUser();
        if (currentUser) {
          let updatedRoles: string[] = currentUser.role;
          if (userRole && typeof userRole === "string") {
            updatedRoles = currentUser.role.includes(userRole)
              ? currentUser.role
              : [...currentUser.role, userRole];
          }

          const filteredRoles = updatedRoles.filter(
            (role): role is string => typeof role === "string" && role !== null
          );

          setUserSession({
            email: currentUser.email,
            name: currentUser.name,
            token: currentUser.authToken || token,
            role: filteredRoles,
            activeRole: userRole,
          });
        }
      }

      // Save completion status
      localStorage.setItem(`${userRole}OnboardingCompleted`, "true");
      localStorage.setItem(
        `onboarding-data-${userRole}`,
        JSON.stringify(finalData)
      );

      toast.dismiss(toastId);
      toast.success("Profile completed successfully!");

      // Redirect to user's dashboard
      setTimeout(() => {
        router.push(`/${userRole}`);
      }, 1500);
    } catch (error: any) {
      console.error("❌ Onboarding error:", error);
      toast.dismiss(toastId);

      let errorMessage = "Failed to complete profile. Please try again.";

      if (error.response?.data?.error) {
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
    } finally {
      setLoading(false);
    }
  };

  const isFieldRequired = (field: string): boolean => {
    if (userRole === "agent") {
      return !["businessName", "nin"].includes(field);
    }
    return true;
  };

  return (
    <>
      <div className="w-full bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
        <div className="hidden lg:block w-[868px] h-screen">
          <Image
            src="/images/Tomato.png"
            alt="tomatoCarrot"
            width={868}
            height={1080}
            className="w-[868px] h-full"
          />
        </div>

        <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center">
          <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
            <h1 className="text-[18px] lg:text-[17px] py-4 text-center font-montserrat text-[#538e53] font-normal">
              Complete your {userRole} profile!
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-2xl mx-auto space-y-6 p-6"
            >
              {/* Village/Local Market */}
              <div>
                <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                  Village / Local Market *
                </label>
                <input
                  type="text"
                  {...register("villageOrLocalMarket")}
                  className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[13px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                  placeholder="Enter your village or local market"
                />
                {errors.villageOrLocalMarket && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.villageOrLocalMarket.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                  placeholder="08012345678"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Business Name - Required for buyers and transporters, optional for agents */}
              <div>
                <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                  Business Name{" "}
                  {isFieldRequired("businessName") ? "*" : "(optional)"}
                </label>
                <input
                  type="text"
                  {...register("businessName")}
                  className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                  placeholder="Enter business name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              {/* NIN - Required for buyers and transporters, optional for agents */}
              <div>
                <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                  NIN {isFieldRequired("nin") ? "*" : "(optional)"}
                </label>
                <input
                  type="text"
                  {...register("nin")}
                  className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                  placeholder="12345678901"
                  maxLength={11}
                />
                {errors.nin && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nin.message}
                  </p>
                )}
              </div>

              {/* Interests (Toggle Radio) */}
              <div className="flex flex-col gap-2">
                <label className="block text-[12px] font-montserrat font-normal text-[#808080]">
                  I am interested in: *
                </label>
                <div className="flex flex-wrap gap-4">
                  {interests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <label
                        key={interest}
                        className={`flex items-center cursor-pointer border-[0.5px] rounded-full px-[7px] py-[4px] gap-2 text-[12.7px] font-montserrat transition-all ${
                          isSelected
                            ? "bg-[#538e53] text-[#fefefe]"
                            : "text-[#808080] border-[#808080]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={interest}
                          checked={isSelected}
                          onChange={() => toggleInterest(interest)}
                          className="hidden"
                        />
                        <span
                          className={`w-[1.2rem] h-[1.2rem] rounded-full border flex items-center justify-center ${
                            isSelected ? "bg-[#fefefe]" : "border-[#808080]"
                          }`}
                        >
                          {isSelected && (
                            <IoIosCheckmark className="w-[2rem] h-[2rem] text-[#538e53] rounded-full" />
                          )}
                        </span>
                        {interest}
                      </label>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.interests.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div>
                <Button
                  text={
                    loading ? (
                      <div className="flex items-center justify-center gap-2.5">
                        <span className="animate-spin w-4 h-4 inline-block border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></span>
                        <span>Completing profile...</span>
                      </div>
                    ) : (
                      "Complete Profile"
                    )
                  }
                  className="w-[100%] justify-center"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
