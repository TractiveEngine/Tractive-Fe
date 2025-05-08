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
    <ul
      className={
        variant === "hover"
          ? "absolute left-full top-0 w-48 bg-[#FEFEFE] border border-gray-200 rounded-[4px] p-2 mt-[-2px] z-10"
          : "space-y-2 w-full mt-2 pl-4"
      }
    >
      {subCategories.map((subCat, subIndex) => (
        <li key={subIndex} className="py-1">
          <span
            className="text-[#2B2B2B] text-[0.89rem] font-normal hover:text-[#538E53] transition cursor-pointer"
            onClick={() => handleSubCatClick(subCat)}
          >
            {subCat}
          </span>
        </li>
      ))}
    </ul>
  );
};
