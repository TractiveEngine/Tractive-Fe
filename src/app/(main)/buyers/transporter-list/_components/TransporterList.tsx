"use client";
import React from "react";
import { TransporterCard } from "./TransporterCard";
interface SellerListProps {
  selectedRatings: number[];
  selectedLocations: string[];
  selectedYears: string[];
}

export const TransporterList: React.FC<SellerListProps> = ({
  selectedRatings,
  selectedLocations,
  selectedYears,
}) => {
  const Transporters = [
    {
      id: "TransporterTGO1",
      image: "/images/GoLogistics.png",
      transporterName: "GO Logistics",
      rating: 4.0,
      rateStatus: "Excellent",
      transporterYear: "10",
      customerNumber: 300,
      transporterBio: "Given you the best ride ever than you can imagine.",
      locationFrom: "kano",
      locationTo: "Delta",
    },
    {
      id: "TransporterTGO2",
      image: "/images/GoLogistics.png",
      transporterName: "GO Logistics",
      rating: 5.0,
      rateStatus: "Good",
      transporterYear: "8",
      customerNumber: 300,
      transporterBio: "Given you the best ride ever than you can imagine.",
      locationFrom: "kwara",
      locationTo: "Borno",
    },
    {
      id: "TransporterTGO3",
      image: "/images/GoLogistics.png",
      transporterName: "GO Logistics",
      rating: 3.0,
      rateStatus: "Good",
      transporterYear: "5",
      customerNumber: 300,
      transporterBio: "Given you the best ride ever than you can imagine.",
      locationFrom: "Ebonyi",
      locationTo: "Lagos",
    },
    {
      id: "TransporterTGO4",
      image: "/images/GoLogistics.png",
      transporterName: "GO Logistics",
      rating: 5.0,
      rateStatus: "Fair",
      transporterYear: "3",
      customerNumber: 300,
      transporterBio: "Given you the best ride ever than you can imagine.",
      locationFrom: "Kaduna",
      locationTo: "Jigawa",
    },
  ];

  const filteredTransporters = Transporters.filter((transporter) => {
    const matchesRating =
      selectedRatings.length === 0 || selectedRatings.includes(transporter.rating);
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(transporter.locationFrom);
    const matchesYears =
      selectedYears.length === 0 ||
      selectedYears.includes(
        parseInt(transporter.transporterYear) <= 5 ? "1-5 Years" : "6-10 Years"
      );
    return matchesRating && matchesLocation && matchesYears;
  });

  return (
    <div className="flex flex-col w-full lg:w-[95%] gap-4 bg-[#fefefe] h-auto rounded-[7px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col justify-center gap-4 w-full px-4 pt-6 bg-[#fefefe]">
        <input
          type="text"
          placeholder="Search for transporters"
          className="w-full max-w-none sm:max-w-[400px] p-2 border border-[#808080] rounded-md text-[#2b2b2b] placeholder-[#808080] focus:outline-none focus:ring-[1px] focus:ring-[#538e53] focus:border-transparent text-[12px] sm:text-[14px]"
        />
        <p className="mt-2 text-[14px] sm:text-[17px] font-normal font-montserrat text-[#808080]">
          Connect with Sellers
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4">
        {filteredTransporters.map((transporter) => (
          <TransporterCard
            key={transporter.id}
            id={transporter.id}
            image={transporter.image}
            transporterName={transporter.transporterName}
            rating={transporter.rating}
            rateStatus={transporter.rateStatus}
            transporterYear={transporter.transporterYear}
            customerNumber={transporter.customerNumber}
            transporterBio={transporter.transporterBio}
          />
        ))}
      </div>
    </div>
  );
};
