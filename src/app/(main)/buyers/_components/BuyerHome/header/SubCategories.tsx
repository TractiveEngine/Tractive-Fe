"use client";

import React from "react";

interface SubCategoriesProps {
  subCategories: string[];
  category: string;
  onSubCategoryClick: (subCat: string, category: string) => void;
  variant: "hover" | "clicked";
  setSelectedSubCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SubCategories: React.FC<SubCategoriesProps> = ({
  subCategories,
  category,
  onSubCategoryClick,
  variant,
  setSelectedSubCategory,
}) => {
  const handleSubCatClick = (subCat: string) => {
    onSubCategoryClick(subCat, category);
    setSelectedSubCategory(subCat);
  };

  return (
    <div className="relative w-full">
      <ul
        className={
          variant === "hover"
            ? "absolute left-full top-0 w-48 bg-[#FEFEFE] border border-gray-200 rounded-[4px] p-2 mt-[-2px] z-10"
            : "space-y-2 w-full mt-2 pl-1.5 pr-2"
        }
      >
        {subCategories.map((subCat, subIndex) => (
          <li key={subIndex} className="py-1">
            <div
              className="flex w-[100%] items-center justify-between text-[#2B2B2B] text-[0.89rem] font-normal hover:text-[#538E53] transition cursor-pointer"
              onClick={() => handleSubCatClick(subCat)}
            >
              <span className="text-[#2B2B2B] text-[0.89rem] font-normal hover:text-[#538E53] transition cursor-pointer">
                {subCat}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2B2B2B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
