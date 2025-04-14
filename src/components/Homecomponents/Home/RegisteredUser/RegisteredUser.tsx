import Image from "next/image";
import React from "react";
import "./RegisteredUser.css";

export const RegisteredUser = () => {
  return (
    <div className="RegisteredUserContainer">
      <div className="RegisteredUserContent">
        {/* Cards Container */}
        <div className="userCardsContainer">
          {/* Farmers */}
          <div className="RegisteredUserCard">
            <div className="RegisteredUserCardIconContainer bg-[#55ACEE1A]">
              <Image
                src="/images/farmer.png"
                alt="Farmers"
                width={32}
                height={32}
                className="RegisteredUserCardIcon"
              />
            </div>
            <div className="RegisteredUserCardTextContainer">
              <h1 className="RegisteredUserCardText font-montserrat">10,000</h1>
              <p className="RegisteredUserCardSubText font-montserrat">
                Farmers
              </p>
            </div>
          </div>

          <hr className="RegisteredUserLine" />

          {/* Transporters */}
          <div className="RegisteredUserCard">
            <div className="RegisteredUserCardIconContainer bg-[#F489961A]">
              <Image
                src="/images/transporters.png"
                alt="Transporters"
                width={32}
                height={32}
                className="RegisteredUserCardIcon"
              />
            </div>
            <div className="RegisteredUserCardTextContainer">
              <h1 className="RegisteredUserCardText font-montserrat">10,000</h1>
              <p className="RegisteredUserCardSubText font-montserrat">
                Transporters
              </p>
            </div>
          </div>
          
          <hr className="RegisteredUserLine" />

          {/* Buyers */}
          <div className="RegisteredUserCard">
            <div className="RegisteredUserCardIconContainer bg-[#00BCD41A]">
              <Image
                src="/images/buyer.png"
                alt="Buyer"
                width={32}
                height={32}
                className="RegisteredUserCardIcon"
              />
            </div>
            <div className="RegisteredUserCardTextContainer">
              <h1 className="RegisteredUserCardText font-montserrat">10,000</h1>
              <p className="RegisteredUserCardSubText font-montserrat">
                Buyers
              </p>
            </div>
          </div>
        </div>

        {/* Registered Users Text */}
        <p className="RegisteredUserText font-montserrat">
          1 Million Registered Users
        </p>
      </div>
    </div>
  );
};
