import { AboutHeader } from '@/components/Homecomponents/About/AboutHeader'
import { Mission } from '@/components/Homecomponents/About/Mission'
import React from 'react'

export default function page (){
  return (
    <div className='w-full bg-[#f1f1f1]'>
      <AboutHeader />
      <Mission /> 
  </div>
  )
}
