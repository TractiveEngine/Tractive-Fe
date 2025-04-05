import { HomeHeader } from "@/components/Homecomponents/Home/HomeHeader";
import { Navbar } from "@/components/Homecomponents/Home/Navbar";
import { RegisteredUser } from "@/components/Homecomponents/Home/RegisteredUser";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHeader />
      <RegisteredUser />
    </>
  );
};
