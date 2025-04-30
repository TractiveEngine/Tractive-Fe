import { toast } from "sonner";
import bcrypt from "bcryptjs";
import emailjs from "@emailjs/browser";

export type StoredUser = {
  fullName: string;
  email: string;
  password: string;
};

// Handles full registration including saving user, OTP gen, and email sending
export const registerUserWithOtp = async (
  fullName: string,
  email: string,
  password: string
): Promise<{ newUser: StoredUser | null; otpSentTo?: string }> => {
  const toastId = toast.loading("Signing you up...");

  try {
    const existingUserData = localStorage.getItem("user");

    if (existingUserData) {
      const existingUser = JSON.parse(existingUserData) as StoredUser;
      if (existingUser.email === email) {
        toast.dismiss(toastId);
        toast.error("User already exists. Please log in.");
        return { newUser: null };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: StoredUser = {
      fullName: fullName,
      email,
      password: hashedPassword,
    };

    localStorage.setItem("user", JSON.stringify(newUser));

    const generatedOtp = Math.floor(10000 + Math.random() * 90000).toString();
    localStorage.setItem("pendingOtp", generatedOtp);

    await emailjs.send(
      "service_m7cl6ac",
      "template_czhc5l1",
      {
        user_email: newUser.email,
        user_name: newUser.fullName,
        otp: generatedOtp,
      },
      "dlmHlpTbVPKHFCtFa"
    );

    toast.dismiss(toastId);
    toast.success(`OTP sent to ${newUser.email}`);

    return { newUser, otpSentTo: newUser.email };
  } catch (err) {
    toast.dismiss(toastId);
    toast.error("Signup failed. Please try again.");
    return { newUser: null };
  }
};
