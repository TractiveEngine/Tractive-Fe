"use client";
import React from "react";

interface ButtonProps {
  icon?: React.ReactNode;
  text: React.ReactNode;
  className?: string;
  iconClass?: string;
  textClass?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = ({
  icon,
  text,
  className,
  iconClass,
  textClass,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
        ${
          disabled
            ? "bg-[#b8becd] cursor-not-allowed"
            : "bg-[#538E53] hover:bg-[#3b753b] hover:text-[#f1f1f1] text-[#f1f1f1] cursor-pointer"
        } 
        ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {icon && <span className={iconClass}>{icon}</span>}
      <span className={textClass}>{text}</span>
    </button>
  );
};
