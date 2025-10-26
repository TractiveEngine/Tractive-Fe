"use client";
import React, { useState, useEffect } from "react";
import { ProfilePicture } from "./_components/ProfilePicture";
import { toast } from "sonner";
import { getAuthToken, getLoggedInUser } from "@/utils/loginAuth";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ProfileData {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  alternativeMobile: string;
  villageOrLocalMarket: string;
  motto: string;
}

const ProfileSetting = () => {
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    alternativeMobile: "",
    villageOrLocalMarket: "",
    motto: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        const user = getLoggedInUser();
        const finalToken = token || user?.token;

        if (!finalToken) {
          toast.error("Please login to access your profile.", {
            duration: 3000,
            position: "top-center",
          });
          router.push("/login");
          return;
        }

        console.log("Fetching profile data...");

        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${finalToken}`,
          },
        });

        console.log("Profile data received:", response.data);

        if (response.data && response.data.data) {
          const profileData = response.data.data;
          setFormData({
            name: profileData.name || profileData.fullName || "",
            businessName: profileData.businessName || "",
            email: profileData.email || user?.email || "",
            phone: profileData.phone || profileData.mobile || "",
            alternativeMobile: profileData.alternativeMobile || "",
            villageOrLocalMarket:
              profileData.villageOrLocalMarket || profileData.address || "",
            motto: profileData.motto || "",
          });
        } else {
          // If no profile data exists, pre-fill with user session data
          setFormData((prev) => ({
            ...prev,
            name: user?.name || "",
            email: user?.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.response?.status === 401) {
          toast.error("Your session has expired. Please login again.", {
            duration: 3000,
            position: "top-center",
          });
        } else if (error.response?.status === 404) {
          // Profile doesn't exist yet, which is fine for first-time setup
          const user = getLoggedInUser();
          setFormData((prev) => ({
            ...prev,
            name: user?.name || "",
            email: user?.email || "",
          }));
          console.log("No existing profile found, using session data");
        } else {
          toast.error("Failed to load profile data. Please try again.", {
            duration: 3000,
            position: "top-center",
          });
        }
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [API_URL, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const user = getLoggedInUser();
      const finalToken = token || user?.token;

      if (!finalToken) {
        toast.error("Please login to update your profile.", {
          duration: 3000,
          position: "top-center",
        });
        return;
      }

      console.log("Updating profile with data:", formData);

      // Prepare the data payload
      const updateData = {
        name: formData.name,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        alternativeMobile: formData.alternativeMobile,
        villageOrLocalMarket: formData.villageOrLocalMarket,
        motto: formData.motto,
      };

      // Try different HTTP methods and endpoints until one works
      let response;
      const endpoints = [
        { method: "put", url: `${API_URL}/api/profile` },
        { method: "patch", url: `${API_URL}/api/profile` },
        { method: "post", url: `${API_URL}/api/profile/update` },
        { method: "put", url: `${API_URL}/api/user/profile` },
      ];

      let lastError;
      for (const endpoint of endpoints) {
        try {
          console.log(
            `Trying ${endpoint.method.toUpperCase()} ${endpoint.url}...`
          );

          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${finalToken}`,
            },
          };

          if (endpoint.method === "patch") {
            response = await axios.patch(endpoint.url, updateData, config);
          } else if (endpoint.method === "put") {
            response = await axios.put(endpoint.url, updateData, config);
          } else if (endpoint.method === "post") {
            response = await axios.post(endpoint.url, updateData, config);
          }

          // If we get here, the request succeeded
          console.log(
            `✅ Success with ${endpoint.method.toUpperCase()} ${endpoint.url}`
          );
          break;
        } catch (error) {
          console.log(
            `❌ Failed with ${endpoint.method.toUpperCase()} ${endpoint.url}:`,
            error.response?.status || error.message
          );
          lastError = error;

          // If it's not a 405 (Method Not Allowed) or 404 (Not Found), throw immediately
          if (
            error.response?.status &&
            error.response.status !== 405 &&
            error.response.status !== 404
          ) {
            throw error;
          }
        }
      }

      // If none of the endpoints worked, throw the last error
      if (!response) {
        throw lastError || new Error("All API endpoints failed");
      }

      console.log("Profile update response:", response.data);

      if (
        response.data.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        toast.success("Profile updated successfully!", {
          duration: 3000,
          position: "top-center",
        });

        // Update localStorage backup
        localStorage.setItem("SaveProfile-setting", JSON.stringify(formData));

        // Update user session if name or email changed
        if (
          user &&
          (formData.name !== user.name || formData.email !== user.email)
        ) {
          const updatedSession = {
            ...user,
            name: formData.name || user.name,
            email: formData.email || user.email,
          };
          localStorage.setItem("session", JSON.stringify(updatedSession));
        }
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.", {
          duration: 4000,
          position: "top-center",
        });
      } else if (error.response?.status === 400) {
        toast.error(
          error.response.data?.message ||
            "Invalid profile data. Please check your inputs.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
      } else if (error.response?.status === 405) {
        toast.error("API method not supported. Please contact support.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update profile. Please try again.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching profile
  if (fetchingProfile) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></div>
          <span className="text-[#538e53] font-montserrat text-[14px]">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[100%] bg-[#fefefe] flex flex-col items-center shadow-md rounded-[4px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 py-6 w-[90%] max-w-[500px]"
      >
        <ProfilePicture />

        {/* Full Name */}
        <div className="w-full">
          <label
            htmlFor="name"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Business Name */}
        <div className="w-full">
          <label
            htmlFor="businessName"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter your business name"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
          />
        </div>

        {/* Email */}
        <div className="w-full">
          <label
            htmlFor="email"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Phone and Alternative Mobile */}
        <div className="w-full flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="phone"
              className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
              required
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="alternativeMobile"
              className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
            >
              Alternative Mobile
            </label>
            <input
              type="tel"
              id="alternativeMobile"
              name="alternativeMobile"
              value={formData.alternativeMobile}
              onChange={handleChange}
              placeholder="Enter alternative mobile"
              className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            />
          </div>
        </div>

        {/* Village or Local Market */}
        <div className="w-full">
          <label
            htmlFor="villageOrLocalMarket"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Village or Local Market <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="villageOrLocalMarket"
            name="villageOrLocalMarket"
            value={formData.villageOrLocalMarket}
            onChange={handleChange}
            placeholder="Enter your village or local market"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
            required
          />
        </div>

        {/* Motto */}
        <div className="w-full">
          <label
            htmlFor="motto"
            className="font-montserrat font-normal text-[13px] text-[#2b2b2b] mb-1 block"
          >
            Motto
          </label>
          <input
            type="text"
            id="motto"
            name="motto"
            value={formData.motto}
            onChange={handleChange}
            placeholder="Enter your motto"
            className="w-full p-2 rounded-[4px] border-[1px] border-[#e2e2e2] focus:outline-none focus:border-[#538E53] text-[13px] placeholder:text-[12px] font-montserrat text-[#2b2b2b]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded-[4px] w-full font-montserrat font-medium text-[13px] transition-colors ${
            loading
              ? "bg-[#a0dfa0] text-[#fefefe] cursor-not-allowed"
              : "bg-[#538E53] text-[#FEFEFE] hover:bg-[#214821]"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#fefefe] border-t-transparent rounded-full"></div>
              <span>Updating...</span>
            </div>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>

      {/* Debug Info for Development */}
      {process.env.NODE_ENV === "development" && (
        <div className="w-[90%] max-w-[500px] mb-4 p-3 bg-gray-100 rounded text-xs">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>API URL: {API_URL}</p>
          <p>Auth Token: {getAuthToken() ? "Present" : "Missing"}</p>
          <p>User Session: {getLoggedInUser()?.email || "None"}</p>
          <p>Loading: {loading ? "Yes" : "No"}</p>
          <p>Fetching: {fetchingProfile ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileSetting;
