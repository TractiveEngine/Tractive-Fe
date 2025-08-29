import React from 'react'
import { AllUserOverview } from './_components/AllUserOverview'
import AllUserTypeContainer from './_components/userType/AllUserTypeContainer';

const page = () => {
  return (
    <div className="w-[95%] mx-auto flex flex-col gap-4 mb-[2rem] justify-center">
          <AllUserOverview />
          <AllUserTypeContainer />
    </div>
  );
}

export default page