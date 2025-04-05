import Image from 'next/image'
import React from 'react'

export const RegisteredUser = () => {
  return (
    <div className="w-full bg-[#538e53]">
      <div className='flex items-center justify-between w-[90%] gap-12 mx-auto py-3'>
        <div className="flex items-center gap-2.5">
          <div className="w-[77px] h-[57px] bg-[#fefefe] flex items-center justify-center rounded-[4px] ">
            <Image
              src="/images/farmer.png"
              alt="Farmers"
              width={32}
              height={32}
              className=""
            />
          </div>
          <div className="flex justify-center gap-0.5 flex-col">
            <h1 className="text-[#f9f9f9] text-[2rem] font-montserrat ">
              10,000
            </h1>
            <p className="text-[#f9f9f9] text-[1.25rem] font-montserrat font-normal ">
              Farmers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-[77px] h-[57px] bg-[#fefefe] flex items-center justify-center rounded-[4px] ">
            <Image
              src="/images/transporters.png"
              alt="Transporters"
              width={32}
              height={32}
              className=""
            />
          </div>
          <div className="flex justify-center gap-0.5 flex-col">
            <h1 className="text-[#f9f9f9] text-[2rem] font-montserrat ">
              10,000
            </h1>
            <p className="text-[#f9f9f9] text-[1.25rem] font-montserrat font-normal ">
              Transporters
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-[77px] h-[57px] bg-[#fefefe] flex items-center justify-center rounded-[4px] ">
            <Image
              src="/images/buyer.png"
              alt="Buyer"
              width={32}
              height={32}
              className=""
            />
          </div>
          <div className="flex justify-center gap-0.5 flex-col">
            <h1 className="text-[#f9f9f9] text-[2rem] font-montserrat ">
              10,000
            </h1>
            <p className="text-[#f9f9f9] text-[1.25rem] font-montserrat font-normal ">
              Buyers
            </p>
          </div>
        </div>
        <p className='text-[#f9f9f9] font-montserrat font-light text-[3rem]'>1 Million Registered Users</p>
      </div>
    </div>
  );
}
