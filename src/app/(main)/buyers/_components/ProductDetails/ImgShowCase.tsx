import { ArrowRightIcon } from "@/icons/Icons";
import Image from "next/image";
import React, { useState } from "react";

export const ImgShowCase = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the highlighted image index
  const images = [
    { src: "/images/videoImg.png", alt: "Corn" },
    { src: "/images/corn1.png", alt: "Corn" },
    { src: "/images/corn2.png", alt: "Corn", className: "w-[241px] h-[108px]" },
    { src: "/images/corn3.png", alt: "Corn" },
    { src: "/images/corn4.png", alt: "Corn" },
    { src: "/images/corn5.png", alt: "Corn" },
  ];

  // Handle next button click to highlight the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="flex items-center gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={`transition-all duration-300 ${
            index === currentIndex
              ? "border-2 border-[#538e53] scale-105"
              : "border-2 border-transparent"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={241}
            height={142}
            className={image.className || "w-[241px] h-[108px] object-cover"}
          />
        </div>
      ))}
      <div
        className="flex items-center justify-center w-[40px] h-[30px] bg-[#Fefefe] rounded-[100px] cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={handleNext}
      >
       <ArrowRightIcon />
      </div>
    </div>
  );
};
