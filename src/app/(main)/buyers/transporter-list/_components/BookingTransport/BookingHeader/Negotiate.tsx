import React, { useState } from "react";
import { TruckItem } from "@/utils/TruckData";

interface NegotiateProps {
  selectedProducts: string[];
  item: TruckItem;
  onBack: () => void;
}

interface Product {
  id: string;
  name: string;
  weight: string;
}

const products: Product[] = [
  { id: "12346DRTDF", name: "Tomatoes, best at...", weight: "55kg" },
  { id: "12347DRTDF", name: "Tomatoes, best at...", weight: "15kg" },
  { id: "12348DRTDF", name: "Tomatoes, best at...", weight: "45kg" },
  { id: "12349DRTDF", name: "Tomatoes, best at...", weight: "85kg" },
];

export const Negotiate: React.FC<NegotiateProps> = ({
  selectedProducts,
  item,
  onBack,
}) => {
  const [negotiatedAmount, setNegotiatedAmount] = useState("");

  // Calculate total weight of selected products
  const totalWeight = selectedProducts.reduce((total, productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return total + parseFloat(product.weight.replace("kg", ""));
    }
    return total;
  }, 0);

  // Calculate total amount based on amountPerKg
  const totalAmount =
    totalWeight * parseFloat(String(item.amountPerKg).replace("$", ""));

  // Handle input change for negotiated amount
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setNegotiatedAmount(value);
    }
  };

  // Handle negotiation request submission
  const handleSubmit = () => {
    if (negotiatedAmount && parseFloat(negotiatedAmount) > 0) {
      // Placeholder for sending request to transporter
      console.log({
        truckId: item.id,
        truckName: item.truckName,
        selectedProducts,
        totalWeight: `${totalWeight}kg`,
        originalAmount: `$${totalAmount.toFixed(2)}`,
        negotiatedAmount: `$${parseFloat(negotiatedAmount).toFixed(2)}`,
      });
      // Reset input after submission
      setNegotiatedAmount("");
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 sm:px-5 py-4 ">
      <div className="flex flex-col gap-2">
        <p className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#808080] font-normal">
          Total: <span className="text-[#2b2b2b]">{totalWeight}kg</span>
        </p>
        <p className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#808080] font-normal">
          Amount:
          <span className="text-[#2b2b2b]"> ${totalAmount.toFixed(2)}</span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="negotiatedAmount"
          className="font-montserrat text-[11px] sm:text-[12px] text-[#2b2b2b] font-normal"
        >
          I want to pay
        </label>
        <input
          type="text"
          id="negotiatedAmount"
          value={negotiatedAmount}
          onChange={handleInputChange}
          className="border border-[#e2e2e2] rounded-[4px] px-3 py-1.5 w-full font-montserrat text-[12px] sm:text-[13px] text-[#2b2b2b] focus:outline-none focus:border-[#538e53]"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!negotiatedAmount || parseFloat(negotiatedAmount) <= 0}
        className={`bg-[#538e53] w-full h-9 text-[#fefefe] font-normal text-[13px] rounded-tl-[6px] rounded-br-[6px] px-4 py-2 transition duration-200 ease-in-out ${
          !negotiatedAmount || parseFloat(negotiatedAmount) <= 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#3a6b3a]"
        }`}
      >
        Send Request
      </button>
    </div>
  );
};
