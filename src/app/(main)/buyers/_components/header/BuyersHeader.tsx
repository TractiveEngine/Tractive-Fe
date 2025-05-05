"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, YellowStarIcon } from "@/icons/Icons";
import { Button } from "@/components/Button";

// Placeholder images (replace with actual image paths)
const sliderImages = [
  "/images/buyer1.png", // Replace with actual image
  "/images/buyer2.png",
  "/images/buyer3.png",
  "/images/buyer4.png",
];

// Data for the right div (Top Sellers)
const topSellers = [
  {
    name: "Kelvin Chikezie",
    image: "/images/sellersProfiles.png",
    rating: 4,
    storeLink: "/store/kelvin",
  },
  {
    name: "Aisha Bello",
    image: "/images/sellersProfiles.png",
    rating: 5,
    storeLink: "/store/aisha",
  },
  {
    name: "Emeka Okonkwo",
    image: "/images/sellersProfiles.png",
    rating: 3,
    storeLink: "/store/emeka",
  },
  {
    name: "Fatima Musa",
    image: "/images/sellersProfiles.png",
    rating: 4,
    storeLink: "/store/fatima",
  },
];

export const BuyersHeader: React.FC = () => {
  // State for the image slider
  const [currentSlide, setCurrentSlide] = useState(0);

  // State for the active dropdown category
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Categories and their subcategories
  const categories = [
    "Grains",
    "Fish",
    "Tubers",
    "legumes",
    "livestocks",
    "Vegetables",
  ] as const;

  const subCategories: Record<(typeof categories)[number], string[]> = {
    Grains: ["Rice", "Maize", "Wheat", "Barley"],
    Fish: ["Rice", "Maize", "Wheat", "Barley"], // Add subcategories if needed
    Tubers: ["Rice", "Maize", "Wheat", "Barley"], // Add subcategories if needed
    legumes: ["Rice", "Maize", "Wheat", "Barley"], // Add subcategories if needed
    livestocks: ["Rice", "Maize", "Wheat", "Barley"], // Add subcategories if needed
    Vegetables: ["Rice", "Maize", "Wheat", "Barley"], // Add subcategories if needed
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Slider navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Handle dropdown toggle on hover and click
  const handleCategoryHover = (category: string) => {
    setActiveDropdown(category);
  };

  const handleCategoryLeave = () => {
    setActiveDropdown(null);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? <YellowStarIcon key={i} /> : <StarIcon key={i} />
      );
    }
    return stars;
  };

  return (
    <div className="w-[90%] mx-auto py-6 font-montserrat">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Div: Categories */}
        <div className="w-full md:w-1/5 bg-[#FEFEFE] rounded-tl-[7px] rounded-bl-[7px] rounded-tr-[0] rounded-br-[0]">
          <p className="text-[#2B2B2B] bg-[#CCE5CC80] px-[1rem] py-[0.7rem] rounded-tl-[7px] rounded-br-[7px] text-[0.89rem] w-[7rem] font-normal">
            Category
          </p>
          <div className="w-full flex justify-between p-4">
            <ul
              className="space-y-2 relative w-full"
              onMouseLeave={handleCategoryLeave}
            >
              {categories.map((category, index) => (
                <li key={index} className="relative w-[100%] flex justify-between">
                  <div
                    onMouseEnter={() => handleCategoryHover(category)}
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === category ? null : category
                      )
                    }
                    className="flex w-[100%] items-center justify-between text-[#2B2B2B] text-[0.89rem] font-normal hover:text-[#538E53] transition cursor-pointer"
                  >
                    <Link
                      href={`/buyers/category/${category.toLowerCase()}`}
                      className="flex-1"
                    >
                      {category}
                    </Link>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={
                        activeDropdown === category || activeDropdown === null
                          ? "#2B2B2B"
                          : "#538E53"
                      }
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {activeDropdown === category &&
                    subCategories[category].length > 0 && (
                      <ul className="absolute left-full top-0 w-48 bg-[#FEFEFE] border border-gray-200 rounded-[4px] p-2 mt-[-2px] z-10">
                        {subCategories[category].map((subCat, subIndex) => (
                          <li key={subIndex} className="py-1">
                            <Link
                              href={`/buyers/category/${category.toLowerCase()}/${subCat.toLowerCase()}`}
                              className="text-[#2B2B2B] text-[0.89rem] font-normal hover:text-[#538E53] transition"
                            >
                              {subCat}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Div: Image Slider */}
        <div className="w-full md:w-[60%] relative">
          <div className="relative w-full h-[350px] rounded-[4px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={sliderImages[currentSlide]}
                  alt={`Slider Image ${currentSlide + 1}`}
                  width={800}
                  height={350}
                  className="rounded-[4px] h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Slider Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  currentSlide === index ? "bg-[#2B2B2B]" : "bg-[#F1F1F1]"
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <Link
            href="/bid"
            className="text-[#2B2B2B] flex items-center justify-center absolute bottom-[0] left-[0] bg-[#FEFEFE] px-[1.4rem] py-[0.9rem] text-[0.89rem] w-[9rem] font-normal"
          >
            Bid Now
          </Link>
        </div>

        {/* Right Div: Promotional Section */}
        <div className="w-full md:w-1/4 bg-[#FEFEFE] rounded-[4px] flex flex-col gap-[1rem]">
          <p className="text-[#2B2B2B] bg-[#CCE5CC80] px-[1rem] py-[0.7rem] rounded-tl-[7px] rounded-br-[7px] text-[0.89rem] w-[7rem] font-normal">
            Top Sellers
          </p>
          <div className="flex flex-col gap-4 mx-auto w-[90%]">
            {topSellers.map((seller, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-1.5"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      src={seller.image}
                      alt={`Top Seller ${seller.name}`}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.7rem] text-[#2B2B2B] font-normal">
                      {seller.name}
                    </span>
                    <div className="flex items-center gap-[0.2rem]">
                      {renderStars(seller.rating)}
                    </div>
                  </div>
                </div>
                <Button
                  text="Visit Store"
                  onClick={() => {}}
                  className="bg-transparent border-[#538E53] border-[2px] text-[#2B2B2B] !rounded-[4px] !px-[0.5rem] !py-[0.55rem] text-[0.8rem] font-normal"
                  textClass="text-[#538E53] text-[0.8rem] font-normal"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
