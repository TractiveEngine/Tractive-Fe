"use client";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DeliveredProductData, Product } from "@/utils/ProductData";

export default function TrackOrderPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof productId === "string") {
      const foundProduct = DeliveredProductData.find((p) => p.id === productId);
      if (!foundProduct) {
        notFound();
      }
      setProduct(foundProduct || null);
    }
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <motion.div
          className="w-12 h-12 border-4 border-t-[#538e53] border-gray-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          role="status"
          aria-label="Loading product details"
        />
      </div>
    );
  }

  if (!product) {
    return notFound();
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
      </div>
    </div>
  );
}
