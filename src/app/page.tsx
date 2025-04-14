import { AgricLog } from "@/components/Homecomponents/Home/AgricLog";
import { FarmTech } from "@/components/Homecomponents/Home/FramTech/FarmTech";
import { HomeHeader } from "@/components/Homecomponents/Home/HomeHeader/HomeHeader";
import { MTF } from "@/components/Homecomponents/Home/MTF";
import { OpportAgric } from "@/components/Homecomponents/Home/OpportAgric/OpportAgric";
import { RegisteredUser } from "@/components/Homecomponents/Home/RegisteredUser/RegisteredUser";

export default function Home() {
  return (
    <div className="bg-[#f1f1f1] w-full">
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
