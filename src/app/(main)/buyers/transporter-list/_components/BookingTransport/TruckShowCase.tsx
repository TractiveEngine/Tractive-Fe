import { ArrowRightIcon } from "@/icons/Icons";
import Image from "next/image";
import React, { useState } from "react";

export const TruckShowCase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    { src: "/images/truckImage.png", alt: "truckImage" },
    { src: "/images/truckImage.png", alt: "truckImage" },
    { src: "/images/truckImage.png", alt: "truckImage" },
    { src: "/images/truckImage.png", alt: "truckImage" },
    { src: "/images/truckImage.png", alt: "truckImage" },
    { src: "/images/truckImage.png", alt: "truckImage" },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="flex items-center flex-col md:flex-row gap-2">
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? "border-2 border-[#538e53] scale-103"
                : "border-2 border-transparent"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={241}
              height={142}
              className="w-[100%] h-auto sm:w-56 sm:h-32 object-cover"
            />
          </div>
        ))}
      </div>
      <div
        className="flex items-center justify-center w-[32px] h-[30px] bg-[#fefefe] rounded-[100px] cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={handleNext}
      >
        <ArrowRightIcon className="w-4 h-4" />
      </div>
    </div>
  );
};
