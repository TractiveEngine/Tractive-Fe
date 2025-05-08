"use client";

import React from "react";
import { SubCategories } from "./SubCategories";
import { FilterStore } from "./FilterStore";

interface CategoriesProps {
  categories: readonly string[];
  subCategories: Record<string, string[]>;
  activeDropdown: string | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSubCategory: string | null;
  setSelectedSubCategory: React.Dispatch<React.SetStateAction<string | null>>;
  handleCategoryClick: (category: string) => void;
  handleSubCategoryClick: (subCat: string, category: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  subCategories,
  activeDropdown,
  setActiveDropdown,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  handleCategoryClick,
  handleSubCategoryClick,
}) => {
  // Handle dropdown toggle on hover and click
  const handleCategoryHover = (category: string) => {
    setActiveDropdown(category);
  };

  const handleCategoryLeave = () => {
    setActiveDropdown(null);
  };

  // Determine the header text
  const headerText = selectedSubCategory
    ? "Filter"
    : selectedCategory || "Category";

  return (
    <div className="w-full md:w-1/5 bg-[#FEFEFE] rounded-tl-[7px] rounded-bl-[7px] rounded-tr-[0] rounded-br-[0]">
      <p className="flex items-center text-[#2B2B2B] bg-[#CCE5CC80] px-[1rem] py-[0.7rem] rounded-tl-[7px] rounded-br-[7px] text-[0.89rem] w-[7rem] font-normal">
        {headerText}
      </p>
      <div className="w-full flex justify-between p-4">
        <div className="w-full">
          {selectedSubCategory ? (
            <FilterStore />
          ) : selectedCategory ? (
            // Only show subcategories when a category is selected
            <SubCategories
              subCategories={subCategories[selectedCategory]}
              category={selectedCategory}
              onSubCategoryClick={handleSubCategoryClick}
              variant="clicked"
              setSelectedSubCategory={setSelectedSubCategory}
            />
          ) : (
            // Show all categories when none is selected
            <ul
              className="space-y-2 relative w-full"
              onMouseLeave={handleCategoryLeave}
            >
              {categories.map((category, index) => (
                <li key={index} className="relative w-[100%]">
                  <div
                    onMouseEnter={() => handleCategoryHover(category)}
                    onClick={() => handleCategoryClick(category)}
                    className="flex w-[100%] items-center justify-between text-[#2B2B2B] text-[0.89rem] font-normal hover:text-[#538E53] transition cursor-pointer"
                  >
                    <span className="flex-1">{category}</span>
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
                  {/* Hover Subcategories (appears to the side on hover) */}
                  {activeDropdown === category &&
                    subCategories[category].length > 0 && (
                      <SubCategories
                        key={`hover-${category}`}
                        subCategories={subCategories[category]}
                        category={category}
                        onSubCategoryClick={handleSubCategoryClick}
                        variant="hover"
                        setSelectedSubCategory={setSelectedSubCategory}
                      />
                    )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
