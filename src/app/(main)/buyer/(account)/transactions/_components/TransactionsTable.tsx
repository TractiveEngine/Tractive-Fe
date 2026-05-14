"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TransactionRowMenu } from "./TransactionRowMenu";
import type { BuyerTransactionRow } from "./transactionsData";

interface Props {
  rows: BuyerTransactionRow[];
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const TransactionsTable: React.FC<Props> = ({ rows }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <div className="py-12 text-center font-montserrat text-sm text-[#808080]">
        No transactions to display.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2 min-w-[760px]">
        <thead>
          <tr className="text-left font-montserrat text-[12px] text-[#808080]">
            <th className="py-2 px-4 font-normal">Item</th>
            <th className="py-2 px-4 font-normal">Quantity</th>
            <th className="py-2 px-4 font-normal">Amount</th>
            <th className="py-2 px-4 font-normal">Sellers</th>
            <th className="py-2 px-4 font-normal">method</th>
            <th className="py-2 px-4 font-normal">Date</th>
            <th className="py-2 px-4 w-[50px]" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.id}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.04 }}
              className="bg-[#fefefe]"
            >
              <td className="py-3 px-4 border-y border-l border-[#eeeeee] rounded-l-[6px]">
                <div className="flex items-center gap-2">
                  <div className="w-[44px] h-[34px] rounded-[4px] overflow-hidden bg-[#f1f1f1] flex-shrink-0">
                    <Image
                      src={row.image}
                      alt={row.item}
                      width={44}
                      height={34}
                      className="object-cover w-[44px] h-[34px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-montserrat text-[12px] text-[#2b2b2b]">
                      {row.item}
                    </span>
                    <span className="font-montserrat text-[10px] text-[#808080]">
                      ID:{row.productId.slice(0, 5)}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 border-y border-[#eeeeee] font-montserrat text-[12px] text-[#2b2b2b]">
                {row.quantity}
              </td>
              <td className="py-3 px-4 border-y border-[#eeeeee] font-montserrat text-[12px] text-[#2b2b2b]">
                ₦{row.amount.toLocaleString()}
              </td>
              <td className="py-3 px-4 border-y border-[#eeeeee] font-montserrat text-[12px] text-[#2b2b2b]">
                {row.seller}
              </td>
              <td className="py-3 px-4 border-y border-[#eeeeee] font-montserrat text-[12px] text-[#2b2b2b]">
                {row.method}
              </td>
              <td className="py-3 px-4 border-y border-[#eeeeee] font-montserrat text-[12px] text-[#2b2b2b]">
                {row.date}
              </td>
              <td className="py-3 px-4 border-y border-r border-[#eeeeee] rounded-r-[6px] relative">
                <TransactionRowMenu
                  rowId={row.id}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
