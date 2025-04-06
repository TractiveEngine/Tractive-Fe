import { AgricLog } from "@/components/Homecomponents/Home/AgricLog";
import { FarmTech } from "@/components/Homecomponents/Home/FarmTech";
import { HomeHeader } from "@/components/Homecomponents/Home/HomeHeader";
import { MTF } from "@/components/Homecomponents/Home/MTF";
import { Navbar } from "@/components/Homecomponents/Home/Navbar";
import { OpportAgric } from "@/components/Homecomponents/Home/OpportAgric";
import { RegisteredUser } from "@/components/Homecomponents/Home/RegisteredUser";

export default function Home() {
  return (
    <div className="bg-[#f1f1f1] w-full">
      <Navbar />
      <HomeHeader />
      <RegisteredUser />
      <div className="bg-[#f1f1f1]">
        <MTF />
        <OpportAgric />
        <FarmTech />
        <AgricLog />
      </div>
    </div>
  );
}
