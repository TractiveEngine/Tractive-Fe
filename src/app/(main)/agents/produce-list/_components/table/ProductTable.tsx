import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProductRow } from "./ProductRow";
import { TickIcon } from "./ProductRow";

// Define interfaces for type safety
export interface Product {
  id: string;
  image: string;
  name: string;
  description: string;
  revenue: number;
  sold: string;
  stock: string;
  rating: string;
  reviews: number;
  checked: boolean;
}

// Sample data with unique IDs
const initialProducts: Product[] = [
  {
    id: "123456789",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 1200.5,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "4.0",
    reviews: 200,
    checked: false,
  },
  {
    id: "678901234",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 850.75,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "4.2",
    reviews: 150,
    checked: false,
  },
  {
    id: "543210987",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 2000.0,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "3.8",
    reviews: 300,
    checked: false,
  },
  {
    id: "987654321",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 2000.0,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "3.2",
    reviews: 30,
    checked: false,
  },
  {
    id: "456789123",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 2000.0,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "4.8",
    reviews: 102,
    checked: false,
  },
  {
    id: "321654987",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 2000.0,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "1.8",
    reviews: 340,
    checked: false,
  },
  {
    id: "789123456",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 2000.0,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "3.9",
    reviews: 240,
    checked: false,
  },
  {
    id: "654321789",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    revenue: 2000.0,
    sold: "50 Bags",
    stock: "50 Bags",
    rating: "2.9",
    reviews: 310,
    checked: false,
  },
];

export const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Function to handle copy ID to clipboard
  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    alert(`Copied ID: ${id}`);
  };

  // Function to handle checkbox toggle
  const handleCheckboxChange = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, checked: !product.checked } : product
      )
    );
  };

  // Function to handle delete row
  const handleDelete = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    setActiveMenu(null);
  };

  // Function to handle edit (placeholder)
  const handleEdit = (id: string) => {
    alert(`Edit product with ID: ${id}`);
    setActiveMenu(null);
  };

  // Function to handle out of stock (placeholder)
  const handleOutOfStock = (id: string) => {
    alert(`Mark product with ID: ${id} as out of stock`);
    setActiveMenu(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-4 mx-auto p-4 overflow-x-auto"
    >
      <table className="min-w-[800px] rounded-lg table-auto">
        <thead>
          <tr className="text-left text-[13px] font-normal font-montserrat text-[#2b2b2b] md:text-sm">
            <th className="py-3 pl-4 w-[50px] min-w-[50px]">
              <div className="relative w-5 h-5">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 && products.every((p) => p.checked)
                  }
                  onChange={() => {
                    const allChecked =
                      products.length > 0 && products.every((p) => p.checked);
                    setProducts(
                      products.map((p) => ({ ...p, checked: !allChecked }))
                    );
                  }}
                  className="w-5 h-5 rounded border-[1px] border-gray-300 text-[#538e53] focus:ring-[#538e53] focus:ring-[1px] appearance-none checked:bg-[#538e53] checked:border-[#538e53] touch:p-2"
                />
                {products.length > 0 && products.every((p) => p.checked) && (
                  <TickIcon />
                )}
              </div>
            </th>
            <th className="py-1.5 px-4 min-w-[150px] font-montserrat font-normal">
              Item
            </th>
            <th className="py-1.5 px-4 min-w-[100px] hidden sm:table-cell font-montserrat font-normal">
              ID
            </th>
            <th className="py-1.5 px-4 min-w-[100px] hidden md:table-cell font-montserrat font-normal">
              Revenue
            </th>
            <th className="py-1.5 px-4 min-w-[100px] hidden lg:table-cell font-montserrat font-normal">
              Sold
            </th>
            <th className="py-1.5 px-4 min-w-[100px] hidden lg:table-cell font-montserrat font-normal">
              Stock
            </th>
            <th className="py-1.5 px-4 min-w-[100px] hidden md:table-cell font-montserrat font-normal">
              Reviews
            </th>
            <th className="py-1.5 px-4 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              copyToClipboard={copyToClipboard}
              handleCheckboxChange={handleCheckboxChange}
              handleEdit={handleEdit}
              handleOutOfStock={handleOutOfStock}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};