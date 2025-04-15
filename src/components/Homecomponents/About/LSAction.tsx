import Link from "next/link";
import React from "react";

export const LSAction = () => {
  return (
    <div className="w-full bg-[#f1f1f1] py-10">
      <hr className="text-[#e2e2e2]" />
      <div className="w-[90%] max-w-[1200px] mx-auto">
        <div className="w-[90%] flex flex-wrap items-center py-[3rem] justify-start gap-[14px]">
          <Link
            href="/login"
            className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px] flex justify-center items-center gap-[10px] border-[1px] border-[#538e53] rounded-[4px] p-[10px] font-montserrat text-center text-[14px] font-medium text-[#538e53] hover:bg-[#cce5cc] hover:text-[#254f25]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px] flex justify-center items-center gap-[10px] bg-[#538e53] rounded-[4px] p-[10px] font-montserrat text-center text-[14px] font-medium text-[#f1f1f1] hover:bg-[#cce5cc] hover:text-[#538e53]"
          >
            SignUp
          </Link>
        </div>
      </div>
      <hr className="text-[#e2e2e2]" />
    </div>
  );
};
