import { AboutHeader } from '@/components/Homecomponents/About/AboutHeader'
import { BankAccount } from '@/components/Homecomponents/About/BankAccount'
import { FAQs } from '@/components/Homecomponents/About/FAQs'
import { LSAction } from '@/components/Homecomponents/About/LSAction'
import { Mission } from '@/components/Homecomponents/About/Mission'
import { OurLocations } from '@/components/Homecomponents/About/OurLocations'
import { Team } from '@/components/Homecomponents/About/Team'
import React from 'react'

export default function AboutUs (){
  return (
    <div className='w-full bg-[#f1f1f1]'>
      <AboutHeader />
      <Mission /> 
      <Team />
      <LSAction />
      <FAQs />
      <OurLocations />
      <BankAccount />
  </div>
  )
}
