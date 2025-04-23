import { ReportForm } from '@/components/Homecomponents/Report/ReportForm'
import { ReportGuidelines } from '@/components/Homecomponents/Report/ReportGuidelines'
import React from 'react'

export default function Report(){
  return (
    <div className="bg-[#f1f1f1] w-[100%]">
      <ReportGuidelines />
      <ReportForm />
    </div>
  );
}
