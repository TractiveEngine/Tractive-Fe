"use client";
import { Button } from "@/components/Button";
import Card from "@/components/Card";
import { ManageUserTable } from "@/components/tables/ManageUserTable";
import Image from "next/image";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";

const tableContent = [
  {
    id: "1",
    fullName: "John Doe",
    email: "johndoe@example.com",
    image: "/images/Ellipse 118.png",
    location: "California",
    profession: "Agent" as "Agent" | "Farmer",
    mobileNumber: "+1 234 567 890",
    status: "Active" as "Active" | "Suspended" | "All",
    date: "23/12/2023",
    actionIcon: <BiDotsVerticalRounded />,
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "janesmith@example.com",
    image: "/images/Ellipse 118.png",
    location: "Texas",
    profession: "Farmer" as "Agent" | "Farmer",
    mobileNumber: "+1 987 654 321",
    status: "Suspended" as "Active" | "Suspended" | "All",
    date: "24/12/2023",
    actionIcon: <BiDotsVerticalRounded />,
  },
  // Other data...
];
export default function Home() {
  return (
    <div>
      <h1>Hello Agric Tech</h1>
      <Button
        icon={<FaPlus />}
        text="Custom Button"
        iconClass="text-md text-white"
        textClass="font-bold text-lg"
        onClick={() => alert("Button clicked!")}
        disabled={false}
      />
      <Card
        image="/images/Rectangle 19.png"
        title="Corn"
        description="Introducing the humble and delig..."
        amount="₦5,000"
        discountPrice="₦3,800"
        quantity="Moq: 50 Bags"
        className="bg-gray-100 p-6"
        imageClass="rounded-lg shadow"
        titleClass="text-xl text-red-500"
        descriptionClass="text-sm italic"
        discountPriceClass="!text-gray-700 text-lg font-bold"
        amountClass="text-gray-400"
        quantityClass="text-blue-400"
      />
      <div className="p-8">
        {/* Replace `<` with the correct component name, e.g., `ManageUserTable` */}
        <ManageUserTable
          data={tableContent}
          className="border-collapse"
          checkboxClassName="px-4 py-2"
          imageClassName="border-2 border-gray-300"
          nameClassName="text-xl font-bold"
          emailClassName="text-sm text-gray-500"
          locationClassName="text-gray-700"
          professionClassName="font-semibold"
          mobileClassName="text-blue-500"
          statusClassName="text-green-500"
          dateClassName="text-gray-400"
          actionClassName="text-gray-600 cursor-pointer"
        />
      </div>
    </div>
  );
}
