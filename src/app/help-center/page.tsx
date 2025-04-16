import { BankAccount } from '@/components/Homecomponents/HelpCenter/BankAccount'
import { FAQs } from '@/components/Homecomponents/HelpCenter/FAQs'
import { HelpCenterHead } from '@/components/Homecomponents/HelpCenter/HelpCenterHead'
import { HowTo } from '@/components/Homecomponents/HelpCenter/HowTo'
import { LiveChatAndHotLine } from '@/components/Homecomponents/HelpCenter/LiveChatAndHotLine'
import { OurLocations } from '@/components/Homecomponents/HelpCenter/OurLocations'
import React from 'react'

export default function page() {
  return (
    <div className='w-full bg-[#fefefe]'>
      <HelpCenterHead />
      <LiveChatAndHotLine />
      <HowTo />
      <FAQs />
      <BankAccount />
      <OurLocations />
    </div>
  )
}
