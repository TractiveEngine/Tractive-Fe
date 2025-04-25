import React from "react";

export const Cookies = () => {
  return (
    <div className="w-{100%] pt-4 pb-16">
      <div className="w-[90%] flex flex-col mx-auto gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[17px] font-montserrat text-[#2b2b2b] font-medium">
            Cookies
          </h1>
          <p className="text-[12.6px] font-montserrat text-[#2b2b2b] font-normal">
            In AgricTech, we use cookies to enhance your browsing experience and
            provide personalized services. Here$apos;s how we use cookies on our
            platform.
          </p>
        </div>

        <div className="text-[#2b2b2b] text-[14px] font-montserrat font-normal">
          <ol
            role="list"
            className="text-[#2b2b2b] space-y-2 ml-[1.3rem] flex flex-col gap-2 w-[100%] list-decimal"
          >
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Essential Cookies: These cookies are necessary for the basic
              functioning of our website. They enable features such as user
              authentication, account management, and secure transactions.
              Without these cookies, you may not be able to access certain parts
              of our platform or use its core functionalities.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Analytical Cookies: We utilize analytical cookies to gather
              information about how users interact with our platform. These
              cookies help us understand user behavior, identify areas for
              improvement, and optimize our website$apos;s performance. The data
              collected is aggregated and anonymized, ensuring your privacy is
              protected.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Functional cookies enhance your user experience by remembering
              your preferences and settings. They allow us to personalize your
              visit, such as remembering your language preference or displaying
              relevant content based on your previous interactions with our
              platform.
            </li>
            <li className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
              Third-Party Cookies: We may also use third-party cookies from
              trusted partners, such as analytics providers or advertising
              networks. These cookies help us analyze website traffic, measure
              the effectiveness of our marketing campaigns, and deliver targeted
              advertisements based on your interests.
            </li>
          </ol>
        </div>
        <p className="text-[#2b2b2b] font-montserrat text-[12.6px] font-normal">
          By using our platform, you consent to the use of cookies as described
          above. You have the option to manage or disable cookies through your
          browser settings. However, please note that disabling certain cookies
          may limit your access to certain features or functionalities of
          AgricTech.
          <br /> We respect your privacy and ensure that any personal
          information collected through cookies is handled in accordance with
          our Privacy Policy. For more information about how we handle s data,
          please refer to our Privacy Policy.
          <br /> If you have any further questions or concerns about our use of
          cookies, please don$apos;t hesitate to contact our support team.
        </p>
      </div>
    </div>
  );
};
