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
import { getAuthToken, getLoggedInUser } from "@/utils/loginAuth";
import { submitOnboardingData } from "@/utils/onboardingApi";

// Helper function to decode and validate JWT token
const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    return {
      payload,
      isExpired: payload.exp < now,
      expiresAt: new Date(payload.exp * 1000),
      userId: payload.userId,
      email: payload.email,
    };
  } catch (e) {
    return null;
  }
};

// Helper function to validate if a token looks valid and not expired
const isValidToken = (token: string | null): boolean => {
  if (!token || token.length < 20) return false;

  // Check if it's not just placeholder text
  const placeholderTokens = [
    "token",
    "Token",
    "TOKEN",
    "auth_token",
    "authtoken",
  ];
  if (placeholderTokens.includes(token.toLowerCase())) return false;

  // Try to decode JWT and check expiration
  const decoded = decodeToken(token);
  if (!decoded) return false;

  if (decoded.isExpired) {
    console.log("Token expired at:", decoded.expiresAt);
    return false;
  }

  return true;
};

const interests = [
  "fish",
  "Tubers",
  "Grains",
  "Edible",
  "Livestock",
  "Vegetable",
];

export default function OnboardingForm() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Initialize form with default schema first
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<OnboardingSchemaType>({
    resolver: zodResolver(getOnboardingSchema("agent")), // Default schema
    defaultValues: {
      role: undefined,
      businessName: "",
      villageOrLocalMarket: "",
      phone: "",
      nin: "",
      interests: [],
    },
  });

  // Watch form values for debugging
  const watchedValues = watch();
  console.log("Form values:", watchedValues);
  console.log("Form errors:", errors);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Try multiple sources for token
        let token = getAuthToken() || localStorage.getItem("onboardingToken");
        const user = getLoggedInUser();

        // If no token found, try from user session
        if (!token && user?.token) {
          token = user.token;
          localStorage.setItem("authToken", token);
        }

        if (!token) {
          toast.error("Your session has expired. Please login again.", {
            duration: 3000,
            position: "top-center",
          });
          // Clear all auth data
          localStorage.removeItem("session");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("pendingRole");
          localStorage.removeItem("onboardingToken");
          router.replace("/login");
          return;
        }

        const loggedInUser = getLoggedInUser();
        const pendingRole = localStorage.getItem("pendingRole");
        const role =
          pendingRole || loggedInUser?.activeRole || localStorage.getItem("userRole");

        console.log("Role initialization:", {
          role,
          pendingRole,
          activeRole: loggedInUser?.activeRole,
          userFromStorage: localStorage.getItem("userRole"),
          tokenExists: !!token,
        });

        if (!role || !["agent", "transporter", "buyer"].includes(role)) {
          toast.error("Invalid role selected. Please choose a valid role.", {
            duration: 3000,
            position: "top-center",
          });
          router.replace("/register-as");
          return;
        }

        setUserRole(role);

        // Reset form with new schema
        const newSchema = getOnboardingSchema(role);
        console.log(newSchema),
        reset({
          role: role as any,
          businessName: "",
          villageOrLocalMarket: "",
          phone: "",
          nin: "",
          interests: [],
        });

        // Load saved data if exists
        const saved = localStorage.getItem(`onboarding-data-${role}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as OnboardingSchemaType;
            console.log("Loaded saved data:", parsed);

            // Set form values
            Object.entries(parsed).forEach(([key, value]) => {
              if (key === "interests" && Array.isArray(value)) {
                setSelectedInterests(value);
                setValue("interests", value as any);
              } else {
                setValue(key as keyof OnboardingSchemaType, value);
              }
            });
          } catch (error) {
            console.error(`Error parsing saved data:`, error);
            toast.error(
              "Failed to load saved data. Please re-enter your details."
            );
          }
        }

        // Only clear pendingRole after we've processed it
        if (pendingRole) {
          localStorage.removeItem("pendingRole");
        }
      } catch (error) {
        console.error("Form initialization error:", error);
        toast.error("Failed to initialize form. Please refresh the page.");
      }
    };

    initializeForm();
  }, [setValue, reset, router]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest];

      console.log("Updated interests:", updated);
      setValue("interests", updated as any, { shouldValidate: true });
      return updated;
    });
  };

  const isFieldRequired = (field: "businessName" | "nin") => {
    return userRole === "transporter" || userRole === "buyer";
  };

  const onSubmit = async (data: OnboardingSchemaType) => {
    console.log("Form submission started with data:", data);

    let loadingToastId: string | number | undefined; // Declare outside try/catch

    try {
      // Try multiple sources for token
      let token = getAuthToken() || localStorage.getItem("onboardingToken");
      const user = getLoggedInUser();

      // If no token found, try from user session
      if (!token && user?.token) {
        token = user.token;
        localStorage.setItem("authToken", token);
      }

      if (!token) {
        toast.error("Your session has expired. Please login again.", {
          duration: 3000,
          position: "top-center",
        });
        // Clear auth data and redirect
        localStorage.removeItem("session");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("pendingRole");
        localStorage.removeItem("onboardingToken");
        router.replace("/login");
        return;
      }

      if (selectedInterests.length === 0) {
        toast.error("Please select at least one interest.");
        return;
      }

      setLoading(true);

      const finalData = {
        role: userRole as any,
        businessName: data.businessName || "",
        villageOrLocalMarket: data.villageOrLocalMarket,
        phone: data.phone,
        nin: data.nin || "",
        interests: selectedInterests as any,
      };

      const finalToken = token; // Assign the token to finalToken

      loadingToastId = toast.loading("Submitting your details...");

      console.log("=== SUBMISSION DEBUG ===");
      console.log("Token being sent:", finalToken?.substring(0, 50) + "...");
      console.log("Data being sent:", JSON.stringify(finalData, null, 2));
      console.log(
        "API URL:",
        process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app"
      );

      const response = await submitOnboardingData(finalData, finalToken);
      console.log("API response:", response);

      // Check for success conditions
      const isSuccess =
        response.success === true ||
        (response.message &&
          (response.message.includes("Account type and info updated") ||
            response.message.includes("updated") ||
            response.message.includes("completed")));

      if (isSuccess) {
        // Update user session with potential new token
        const user = getLoggedInUser();
        if (user && !user.roles.includes(userRole!)) {
          const updatedSession = {
            ...user,
            roles: [...user.roles, userRole!],
            activeRole: userRole,
            token: response.token || user.token, // Use new token if provided
          };
          localStorage.setItem("session", JSON.stringify(updatedSession));
          localStorage.setItem("userRole", userRole!);

          // Update auth token if new one provided
          if (response.token) {
            localStorage.setItem("authToken", response.token);
          }
        }

        // Save completion status
        localStorage.setItem(
          `onboarding-data-${userRole}`,
          JSON.stringify(finalData)
        );
        localStorage.setItem(`onboardingCompleted-${userRole}`, "true");

        toast.dismiss(loadingToastId);
        toast.success(response.message || "Onboarding completed successfully!");

        router.push("/onboarding-success");
      } else {
        throw new Error(
          response.error || response.message || "Submission failed"
        );
      }
    } catch (error: any) {
        toast.dismiss(loadingToastId);
      console.error("Submission error:", error);

      const errorMessage = error.message || error.toString();

      // Handle cases where success message comes as error
      if (
        errorMessage.includes("Account type and info updated") ||
        errorMessage.includes("completed successfully")
      ) {
        const user = getLoggedInUser();
        if (user && !user.roles.includes(userRole!)) {
          const updatedSession = {
            ...user,
            roles: [...user.roles, userRole!],
            activeRole: userRole,
          };
          localStorage.setItem("session", JSON.stringify(updatedSession));
          localStorage.setItem("userRole", userRole!);
        }

        localStorage.setItem(`onboardingCompleted-${userRole}`, "true");
        toast.success("Onboarding completed successfully!");
        router.push("/onboarding-success");
        return;
      }

      // Show appropriate error message
      let displayError = "Failed to submit form. Please try again.";
      if (errorMessage.includes("Valid account type")) {
        displayError = "Invalid role selected. Please contact support.";
      } else if (errorMessage.includes("validation")) {
        displayError = "Please check your input and try again.";
      } else if (errorMessage) {
        displayError = errorMessage;
      }

      toast.error(displayError, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while role is being determined
  if (!userRole) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      <div className="hidden lg:block w-[868px] h-screen">
        <Image
          src="/images/Tomato.png"
          alt="Tomato and Carrot"
          width={868}
          height={1080}
          className="w-[868px] h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center">
        <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
          <h1 className="text-[18px] lg:text-[17px] py-4 text-center font-montserrat text-[#538e53] font-normal">
            Kudos! You are almost done!
          </h1>

          <p className="text-[14px] text-center font-montserrat text-[#666] mb-4">
            Setting up your profile as{" "}
            {userRole === "agent"
              ? "an Agent"
              : userRole === "buyer"
              ? "a Buyer"
              : "a Transporter"}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-2xl mx-auto space-y-6 p-6"
            noValidate
          >
            {/* Village or Local Market */}
            <div>
              <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                Village or Local Market <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("villageOrLocalMarket")}
                className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[13px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                placeholder="Enter village or local market"
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
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                placeholder="Eg 08123456789"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* NIN */}
            <div>
              <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                NIN{" "}
                {isFieldRequired("nin") ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-[#808080]">(optional)</span>
                )}
              </label>
              <input
                type="text"
                {...register("nin")}
                className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[13px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                placeholder="Eg 12345678901"
              />
              {errors.nin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nin.message}
                </p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                Business Name{" "}
                {isFieldRequired("businessName") ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-[#808080]">(optional)</span>
                )}
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

            {/* Interests */}
            <div className="flex flex-col gap-2">
              <label className="block text-[12px] font-montserrat font-normal text-[#808080]">
                I am interested in: <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <div
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center cursor-pointer border-[0.5px] rounded-full px-[7px] py-[4px] gap-2 text-[12.7px] font-montserrat transition-all ${
                        isSelected
                          ? "bg-[#538e53] text-[#fefefe] border-[#538e53]"
                          : "text-[#808080] border-[#808080] hover:border-[#538e53]"
                      }`}
                    >
                      <span
                        className={`w-[1.2rem] h-[1.2rem] rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "bg-[#fefefe] border-[#fefefe]"
                            : "border-[#808080]"
                        }`}
                      >
                        {isSelected && (
                          <IoIosCheckmark className="w-[1rem] h-[1rem] text-[#538e53]" />
                        )}
                      </span>
                      {interest}
                    </div>
                  );
                })}
              </div>
              {errors.interests && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.interests.message}
                </p>
              )}
              {selectedInterests.length === 0 && (
                <p className="text-[#808080] text-xs mt-1">
                  Please select at least one interest
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                text={
                  loading ? (
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="animate-spin w-4 h-4 inline-block border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></span>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Complete Profile"
                  )
                }
                className="w-full justify-center"
                type="submit"
                disabled={loading}
              />
            </div>
          </form>

          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>User Role: {userRole}</p>
              <p>Selected Interests: {selectedInterests.join(", ")}</p>
              <p>
                Form Valid: {Object.keys(errors).length === 0 ? "Yes" : "No"}
              </p>
              {Object.keys(errors).length > 0 && (
                <p>Errors: {Object.keys(errors).join(", ")}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
