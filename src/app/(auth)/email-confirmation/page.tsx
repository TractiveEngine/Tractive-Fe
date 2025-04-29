"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useEmailUser } from "@/context/userEmailContext";
// ✅ Token generator function
function generateFakeToken(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export default function EmailConfirmation() {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resending, setResending] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const { email, loading } = useEmailUser();

  useEffect(() => {
    if (otp.length === 5) {
      VerifyOtp();
    }
  });

  // useEffect(() => {
  //   if (!email) {
  //     const pendingUserRaw = localStorage.getItem("pendingUser");
  //     if (pendingUserRaw) {
  //       const pendingUser = JSON.parse(pendingUserRaw);
  //       if (pendingUser?.email) {
  //         setEmail(pendingUser.email); // from context
  //       }
  //     }
  //   }
  // }, [email, setEmail]);

  const VerifyOtp = async () => {
    setVerifying(true);
    setError(null); // Clear previous errors

    const savedOtp = localStorage.getItem("pendingOtp");

    if (!savedOtp) {
      toast.error("No OTP found. Please signup again.");
      setVerifying(false);
      return;
    }

    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    if (otp === savedOtp) {
      toast.success("OTP verified successfully!");

      // ✅ Store fake token on success
      const fakeToken = generateFakeToken();
      localStorage.setItem("authToken", fakeToken);
      console.log("👉 Generated fake token:", fakeToken);
      // Wait 1 second to show "Verifying..." then navigate
      await wait(2000);

      router.push("/onboarding");
    } else {
      setError("Invalid OTP. Please try again."); // Show error
      toast.error("Invalid OTP. Please try again.");
      await wait(2000);
      setVerifying(false);
      setShake(true);
      setOtp("");
    }
  };

  const handleResendOtp = async () => {
    setResending(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pendingUserRaw = localStorage.getItem("pendingUser");
      if (!pendingUserRaw) {
        toast.error("No pending user found.");
        return;
      }

      const pendingUser = JSON.parse(pendingUserRaw);
      const generatedOtp = Math.floor(10000 + Math.random() * 90000).toString();
      localStorage.setItem("pendingOtp", generatedOtp);

      toast.success(`New OTP sent to ${pendingUser.email}`);
      console.log("👉 Resent OTP:", generatedOtp);
    } catch (error) {
      console.error("Error resending OTP", error);
      toast.error("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-[100%] bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
      {/* Left Side Image */}
      <div className="hidden lg:block w-[868px] h-screen">
        <Image
          src="/images/tomatoCarrot.png"
          alt="tomatoCarrot"
          width={868}
          height={1080}
          className="w-[868px] h-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center lg:my-auto h-screen">
        <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
          <h1 className="text-[28px] lg:text-[23px] py-4 text-center font-montserrat text-[#2b2b2b] font-normal">
            Email Confirmation
          </h1>
          <div className="hidden lg:flex w-[80px] h-[70px] mx-auto items-center justify-center">
            <Image
              src="/images/verificationIcon.png"
              alt="Email Confirmation"
              width={100}
              height={100}
              className="w-[100px] h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-3 pb-10">
            <div className="mt-4">
              <p className="text-[15px] text-center font-montserrat text-[#2b2b2b] font-normal">
                Enter the code sent to
              </p>
              <p className="text-[15px] text-center font-montserrat text-[#2b2b2b] font-[500]">
                {loading ? (
                  <span className="animate-spin w-4 h-4 inline-block border-2 border-gray-300 border-t-[#538e53] rounded-full"></span>
                ) : (
                  email || "your email"
                )}
              </p>
            </div>

            {/* OTP Input with Shake */}
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onAnimationComplete={() => setShake(false)}
            >
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={5}
                renderSeparator={<span className="mx-2"></span>}
                renderInput={(props) => (
                  <input {...props} disabled={verifying} />
                )}
                containerStyle="flex justify-center gap-3 mt-5"
                inputStyle="!w-[50.931px] h-[50.931px] text-lg rounded-[1.769px] border border-[#808080] text-center outline-none focus:border-[#538e53] focus:ring-[0.2px] focus:ring-[#538e53] transition duration-200"
              />
            </motion.div>

            {verifying && (
              <p className="text-center text-[14px] text-[#538e53] mt-4">
                Verifying...
              </p>
            )}

            {error && !verifying && (
              <p className="text-center text-[14px] text-red-500 mt-2">
                {error}
              </p>
            )}

            <div className="mt-3 w-[100%]">
              <p className="text-[13px] text-center font-montserrat text-[#2b2b2b] font-normal flex items-center justify-center gap-1">
                I didn&apos;t receive any code.{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#538e53] cursor-pointer"
                  disabled={verifying}
                >
                  {resending ? (
                    <span className="animate-spin w-4 h-4 inline-block border-2 border-[#a0dfa0]  border-t-[#538e53] rounded-full"></span>
                  ) : (
                    "Resend"
                  )}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
