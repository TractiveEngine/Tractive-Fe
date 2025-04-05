import { HomeHeader } from "@/components/Homecomponents/Home/HomeHeader";
import { MTF } from "@/components/Homecomponents/Home/MTF";
import { Navbar } from "@/components/Homecomponents/Home/Navbar";
import { RegisteredUser } from "@/components/Homecomponents/Home/RegisteredUser";

export default function Home() {
  return (
    <div className="bg-[#f1f1f1] w-full h-screen">
      <Navbar />
      <HomeHeader />
      <RegisteredUser />
      <div className="bg-[#f1f1f1]">
        <MTF />
      </div>
    </div>
  );
}
