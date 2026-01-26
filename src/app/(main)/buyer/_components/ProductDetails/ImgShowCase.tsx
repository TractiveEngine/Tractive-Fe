import { ArrowRightIcon } from "@/icons/Icons";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface ImgShowCaseProps {
  images?: string[];
}

export const ImgShowCase: React.FC<ImgShowCaseProps> = ({
  images: propImages,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use passed images or fallback defaults for dev/demo
  const defaultImages = [
    "/images/videoImg.png",
    "/images/corn1.png",
    "/images/corn2.png",
    "/images/corn3.png",
  ];

  const displayImages =
    propImages && propImages.length > 0 ? propImages : defaultImages;

  // Handle next and previous button clicks
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % displayImages.length;
      if (scrollContainerRef.current) {
        const child = scrollContainerRef.current.children[
          nextIndex
        ] as HTMLElement;
        if (child) {
          const scrollAmount = child.offsetLeft;
          scrollContainerRef.current.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
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
          {displayImages.map((src, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-[150px] sm:w-[200px] md:w-[220px] lg:w-[241px] snap-start transition-all duration-200 ${
                index === currentIndex
                  ? "border-2 border-[#538e53] scale-[1]"
                  : "border-2 border-transparent"
              }`}
            >
              <Image
                src={src}
                alt={`Product Image ${index + 1}`}
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
