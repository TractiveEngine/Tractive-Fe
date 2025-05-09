import Image from "next/image";
import Link from "next/link";
import React from "react";

export const OfficialStore = () => {
  return (
    <div className="shadow-md rounded-[10px] bg-[#F1F8F1B2]">
      <Link href="/official-store" className="mt-6 rounded-[5px] shadow-md">
        <div className="flex items-center justify-center w-full gap-2 rounded-tr-[7px] rounded-tl-[7px] bg-[#F1F8F1B2] py-4 px-4">
          <p className="text-[#000] text-[15px] text-center font-montserrat font-normal">
            Official Store
          </p>
          <div>
            <Image
              src="/images/verifiedIcon.png"
              alt="verified"
              width={18}
              height={18}
            />
          </div>
        </div>
        <div className="rounded-br-[5px] rounded-bl-[5px]">
          <Image
            src="/images/officialStore.png"
            alt="Official Store"
            width={300}
            height={301}
            className="rounded-br-[7px] rounded-bl-[7px]"
          />
        </div>
      </Link>
    </div>
  );
};
