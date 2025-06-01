"use client";
import Image from "next/image";
import React, { useState } from "react";
import { MdCheck } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { CopyIcon } from "@/icons/Icon1";

const accounts = [
  {
    bank: "Access Bank",
    image: "/images/Access.png",
    number: "1218509781",
  },
  {
    bank: "Zenith Bank",
    image: "/images/Zenith.png",
    number: "1218509781",
  },
  {
    bank: "UBA Bank",
    image: "/images/UBA.png",
    number: "1218509781",
  },
  {
    bank: "Zenith Bank",
    image: "/images/Zenith.png",
    number: "1218509781",
  },
];

export const BankAccounts = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleCopy = async (number: string, index: number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full px-4 relative">
      <div className="">
        <div className="w-full flex flex-col gap-[0.1rem] justify-center">

          <div className="flex flex-col gap-3 items-center w-[100%]">
            {accounts.map((account, index) => (
              <div
                key={account.bank}
                className="relative flex items-center w-[100%] p-3 border-[1px] border-[#2b2b2b] rounded-[4px] gap-[10px]"
              >
                <div>
                  <Image
                    src={account.image}
                    alt={account.bank}
                    width={50}
                    height={40}
                  />
                </div>

                <div className="flex justify-between items-center w-full">
                  <p className="text-[#2b2b2b] font-montserrat text-[12px] font-normal text-left">
                    Agrictech.com.ng
                  </p>

                  <div className="relative flex items-center gap-[10px]">
                    <p className="text-[#2b2b2b] font-montserrat text-[12px]">
                      {account.number}
                    </p>

                    <motion.div
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                      onClick={() => handleCopy(account.number, index)}
                      whileTap={{ scale: 1.2 }}
                      className="cursor-pointer text-[#2b2b2b] relative"
                    >
                      {/* Icon Switch */}
                      <AnimatePresence mode="wait" initial={false}>
                        {copiedIndex === index ? (
                          <motion.span
                            key="check"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <MdCheck size={16} className="text-[#538e53]" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CopyIcon />
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Copied Tooltip (above) */}
                      <AnimatePresence>
                        {copiedIndex === index && (
                          <motion.div
                            key="copied"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: -10 }}
                            exit={{ opacity: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-[#538e53] text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap"
                          >
                            Copied!
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Hover Tooltip */}
                      <AnimatePresence>
                        {hoverIndex === index && copiedIndex !== index && (
                          <motion.div
                            key="hover"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: -4 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-[#2b2b2b] text-[#f1f1f1] text-xs px-2 py-1 rounded z-10 whitespace-nowrap"
                          >
                            Copy
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
