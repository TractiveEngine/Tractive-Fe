import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Define the transporter data type
interface Agents {
  id: number;
  name: string;
  image: string;
  location: string;
  Revenue: string;
  Order: number;
}

// Sample transporter data with Nigerian states
const agents: Agents[] = [
  {
    id: 1,
    name: "John Doe",
    image: "/images/TopAgent.png",
    location: "Lagos",
    Revenue: "$50,000",
    Order: 120,
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "/images/TopAgent.png",
    location: "Abuja",
    Revenue: "$50,000",
    Order: 120,
  },
  {
    id: 3,
    name: "Alice Johnson",
    image: "/images/TopAgent.png",
    location: "Rivers",
    Revenue: "$50,000",
    Order: 120,
  },
  {
    id: 4,
    name: "Bob Wilson",
    image: "/images/TopAgent.png",
    location: "Kano",
    Revenue: "$50,000",
    Order: 120,
  },
  {
    id: 5,
    name: "Emma Brown",
    image: "/images/TopAgent.png",
    location: "Oyo",
    Revenue: "$50,000",
    Order: 120,
  },
];

// Framer Motion variants for table animation
const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

// Framer Motion variants for table row animation
const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const TopAgents: React.FC = () => {
  return (
    <div className="w-full bg-[#fefefe] shadow-md rounded-[6px] overflow-hidden">
      <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-medium mb-4 bg-[#EFCEB780] flex items-center justify-center w-[40%]">
        Top Agents
      </h2>
      <motion.div
        className="overflow-x-auto"
        initial="hidden"
        animate="visible"
        variants={tableVariants}
      >
        <table className="min-w-full shadow-md rounded-lg overflow-hidden">
          <thead className="border-b border-[#e2e2e2]">
            <tr>
              <th className="px-4 py-1 text-left text-[11px] font-normal font-montserrat text-[#808080] capitalize tracking-wider">
                Name
              </th>
              <th className="px-4 py-1 text-left text-[11px] font-normal font-montserrat text-[#808080] capitalize tracking-wider">
                Location
              </th>
              <th className="px-4 py-1 text-left text-[11px] font-normal font-montserrat text-[#808080] capitalize tracking-wider">
                Orders
              </th>
              <th className="px-4 py-1 text-left text-[11px] font-normal font-montserrat text-[#808080] capitalize tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <motion.tr
                key={agent.id}
                variants={rowVariants}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-1 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      width={30}
                      height={30}
                      className="h-[25px] w-[25px] rounded-full object-cover"
                    />
                    <span className="text-[10.5px] font-montserrat font-normal text-[#2b2b2b]">
                      {agent.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-1 whitespace-nowrap text-[10.5px] font-montserrat font-normal text-[#2b2b2b]">
                  {agent.location}
                </td>
                <td className="px-4 py-1 rounded-[4px] mt-1.5 mr-1.5 whitespace-nowrap text-[10.5px] font-montserrat font-normal text-[#2b2b2b]">
                  {agent.Order}
                </td>
                <td className="px-4 py-1 bg-[#f1f1f1] flex items-center justify-center rounded-[4px] mt-1.5 mr-1.5 whitespace-nowrap text-[10.5px] font-montserrat font-normal text-[#2b2b2b]">
                  {agent.Revenue}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};
