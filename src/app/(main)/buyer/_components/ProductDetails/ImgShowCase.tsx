import { ArrowRightIcon } from "@/icons/Icons";
import Image from "next/image";
import React, { useRef, useState } from "react";

export const ImgShowCase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const images = [
    { src: "/images/videoImg.png", alt: "Corn" },
    { src: "/images/corn1.png", alt: "Corn" },
    { src: "/images/corn2.png", alt: "Corn" },
    { src: "/images/corn3.png", alt: "Corn" },
    { src: "/images/corn4.png", alt: "Corn" },
    { src: "/images/corn5.png", alt: "Corn" },
  ];

  // Handle next and previous button clicks
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % images.length;
      if (scrollContainerRef.current) {
        const scrollAmount = (
          scrollContainerRef.current.children[nextIndex] as HTMLElement
        ).offsetLeft;
        scrollContainerRef.current.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
      return nextIndex;
    });
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto py-4 flex items-center gap-4">
        <div
          className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-3 md:gap-4 scrollbar-thin scrollbar-thumb-[#538e53] scrollbar-track-[#f5f5f5]"
          ref={scrollContainerRef}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-[150px] sm:w-[200px] md:w-[220px] lg:w-[241px] snap-start transition-all duration-200 ${
                index === currentIndex
                  ? "border-2 border-[#538e53] scale-[1]"
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
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#fefefe] rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          onClick={handleNext}
          aria-label="Next product image"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
