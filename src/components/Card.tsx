import React from "react";

interface CardProps {
  image: string; // Required
  title: string; // Required
  description?: string;
  amount?: string;
  discountPrice?: string;
  quantity?: string;
  className?: string;
  imageClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  amountClass?: string;
  discountPriceClass?: string;
  quantityClass?: string;
}

export default function Card({
  image,
  title,
  description,
  amount,
  discountPrice,
  quantity,
  className = "",
  imageClass = "",
  titleClass = "",
  descriptionClass = "",
  amountClass = "",
  discountPriceClass = "",
  quantityClass = "",
}: CardProps) {
  return (
    <div className={`p-4 border rounded-lg shadow-md ${className}`}>
      {/* Image */}
      <img
        src={image}
        alt={title}
        className={`w-[284px] object-cover rounded-md ${imageClass}`}
      />

      {/* Title */}
      <h2 className={`mt-2 text-lg font-semibold ${titleClass}`}>{title}</h2>

      {/* Optional Fields */}

      <p className={`text-gray-600 ${descriptionClass}`}>{description}</p>
      <div className="flex items-center gap-4 mt-2">
        <p className={`text-blue-500 font-bold ${amountClass}`}>{amount}</p>
        <p className={`text-green-600 font-semibold ${discountPriceClass}`}>
          {discountPrice}
        </p>
      </div>

      <p className={`text-sm text-gray-500 ${quantityClass}`}>{quantity}</p>
    </div>
  );
}
