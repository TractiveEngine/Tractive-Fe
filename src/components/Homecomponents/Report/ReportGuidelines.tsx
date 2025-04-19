import Image from "next/image";
import React from "react";

export const ReportGuidelines = () => {
  return (
    <div className="w-[100%] bg-[#f1f1f1] pt-4 pb-16">
      <div className="w-[90%] mx-auto bg-[#fefefe] rounded-[10px]">
        <div className="flex flex-col items-center justify-center py-[20px]">
          <h2 className="text-[17px] font-montserrat text-[#2b2b2b] font-normal">
            Report Guidelines
          </h2>
          <div>
            <Image
              src="/images/reportImage.png"
              alt="Report Form"
              width={150}
              height={150}
            />
          </div>
        </div>

        <div className="text-[#2b2b2b] text-[14px] font-montserrat font-normal px-[70px] py-10">
          <ol
            role="list"
            className="text-[#2b2b2b] space-y-2 ml-[1.3rem] flex flex-col gap-2 w-[100%] list-decimal"
          >
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Provide Accurate Information: Ensure that the information you
              provide in the report is accurate and truthful. False or
              misleading reports can hinder the resolution process and may have
              consequences.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Be Clear and Specific: Clearly describe the issue or reason for
              the report in a specific and concise manner. Include relevant
              details such as usernames, item names, dates, and any other
              pertinent information that can help in the investigation.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Include Supporting Evidence: Whenever possible, provide supporting
              evidence to strengthen your report. This may include screenshots,
              photos, chat logs, or any other documentation that can
              substantiate your claim.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Use Appropriate Language: Use respectful and professional language
              when submitting your report. Avoid using offensive or derogatory
              terms, as it can undermine the credibility of your report.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Respect Privacy: Avoid sharing personal or sensitive information
              of other individuals unless it is directly related to the report
              and necessary for the investigation.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Follow Platform Guidelines: Familiarize yourself with the
              platform's specific guidelines and policies regarding reporting.
              Ensure that your report aligns with these guidelines to maximize
              its effectiveness.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Submit Only Relevant Reports: Report items or users that violate
              the platform's policies or terms of service. Avoid reporting based
              on personal disputes or unrelated matters that do not align with
              the reporting criteria.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Report in a Timely Manner: Submit your report as soon as possible
              after encountering an issue. Timely reporting can help in
              addressing the problem promptly and efficiently.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Maintain Communication: If the platform provides a means for
              communication or follow-up regarding your report, make sure to
              check for any updates or requests for additional information.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Use Reporting Channels: Utilize the designated reporting channels
              provided by the platform. This ensures that your report reaches
              the appropriate team or department responsible for handling such
              matters.
            </li>
          </ol>
        </div>
      </div>
      div
    </div>
  );
};
