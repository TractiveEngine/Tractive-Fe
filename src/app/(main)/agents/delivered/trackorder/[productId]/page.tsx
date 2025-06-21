"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DeliveredProductData, Product } from "@/utils/ProductData"; // Adjust path as needed

export default function TrackOrderPage() {
  const { productId } = useParams(); // Get productID from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching product data (replace with actual API call if needed)
    const foundProduct = DeliveredProductData.find((p) => p.id === productId);
    setProduct(foundProduct || null);
    setLoading(false);
  }, [productId]);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center p-6 text-red-500">
        Product with ID {productId} not found.
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto p-6 bg-[#fefefe] rounded-[10px] shadow-md">
      <h1 className="text-[16px] font-montserrat font-normal mb-4">
        Track Order: {product.name}
      </h1>
      <div className="flex flex-col gap-4">
        <p>
          <strong>Product ID:</strong> {product.id}
        </p>
        <p>
          <strong>Description:</strong> {product.description}
        </p>
        <p>
          <strong>Amount:</strong> ${product.amount.toFixed(2)}
        </p>
        <p>
          <strong>Buyer:</strong> {product.buyer}
        </p>
        <p>
          <strong>Location:</strong> {product.location}
        </p>
        <p>
          <strong>Date:</strong> {product.date}
        </p>
        <p>
          <strong>Tracking Status:</strong> {product.status}
        </p>
        {/* Add more tracking details as needed */}
      </div>
    </div>
  );
}
