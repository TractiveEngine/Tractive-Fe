import Image from "next/image";
import Link from "next/link";
import React from "react";
import "./HomeHeader.css";

export const HomeHeader = () => {
  return (
    <section className="sectionHeader">
      <div className="HeaderContainer">
        <div className="HeaderTextContainer">
          <p className="HeaderTitle font-normal font-montserrat">
            Empowering Farmers, Buyers, and Transporters with Cutting-Edge
            Technology for a Sustainable Agricultural Ecosystem
          </p>
          <span className="HeaderDescription font-montserrat font-medium">
            Connect, Grow, Strive.
          </span>
          <Link href="/signup" className="MobileHeaderButton font-montserrat">
            Get Started
          </Link>
          <Link href="/signup" className="HeaderButton font-montserrat">
            Register For Free
          </Link>
        </div>
        <div className="HeaderImageContainer">
          <Image
            src="/images/homeheader.png"
            alt="home image"
            width={972}
            height={433}
            className="HeaderImage"
          />
        </div>
      </div>
    </section>
  );
};
