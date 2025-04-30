"use client";
import { getAuthToken } from "@/utils/loginAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BuyerDashboard() {
const router = useRouter()
  // 🔐 Redirect unauthorized users
  useEffect(() => {
    const token = getAuthToken(); // adjust this key if needed
    if (!token) {
      toast.error("Unauthorized access. Login.", {
        duration: 3000,
        position: "top-center",
      });
      router.push("/login");
    }
  }, [router]);



  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#ffffff]">
      <div className="text-center">
        <Image
          src="/images/AgricTechCart.png" // Optional dashboard image
          alt="Dashboard"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-[#2b2b2b] mb-4 font-montserrat">
          Welcome to your Buyer Dashboard!
        </h1>
        <p className="text-lg text-[#555] font-montserrat">
          Start purchasing products, track orders, and manage your profile here.
        </p>
      </div>
    </div>
  );
}
