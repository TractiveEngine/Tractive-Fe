import React from "react";

// Define the data type
interface PieData {
  name: string;
  value: number;
  color: string;
}

// Data for the pie chart (reordered: Grains, Vegetables, Legumes)
const data: PieData[] = [
  { name: "Grains", value: 30, color: "#D77F40" },
  { name: "Veg", value: 40, color: "#5198EC" },
  { name: "Legumes", value: 60, color: "#538E53" },
];

// Function to calculate SVG arc path for donut segments
const getDonutPath = (
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string => {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const outerStartX = cx + outerRadius * Math.cos(startRad);
  const outerStartY = cy + outerRadius * Math.sin(startRad);
  const outerEndX = cx + outerRadius * Math.cos(endRad);
  const outerEndY = cy + outerRadius * Math.sin(endRad);
  const innerStartX = cx + innerRadius * Math.cos(endRad);
  const innerStartY = cy + innerRadius * Math.sin(endRad);
  const innerEndX = cx + innerRadius * Math.cos(startRad);
  const innerEndY = cy + innerRadius * Math.sin(startRad);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${outerStartX} ${outerStartY}`, // Start at outer arc
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`, // Outer arc
    `L ${innerStartX} ${innerStartY}`, // Line to inner arc
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY}`, // Inner arc (reverse direction)
    "Z", // Close path
  ].join(" ");
};

export const MostSoldCategoryPieChart: React.FC = () => {
  // Normalize percentages (total = 30 + 40 + 60 = 130)
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  let startAngle = 0;

  // SVG dimensions and center (matching provided SVG)
  const width = 160;
  const height = 160;
  const cx = width / 2;
  const cy = height / 2;

  // Radii for segments
  const innerRadius = 42.6433; // Matches inner radius from provided SVG
  const outerRadii = {
    Legumes: 80.619, // Larger radius for Legumes
    Veg: 65, // Same radius for Vegetables and Grains
    Grains: 65,
  };

  return (
    <div className="w-full lg:w-[28%] bg-[#fefefe] shadow-md rounded-[6px] overflow-hidden">
      <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-medium mb-4 bg-[#E5F1E5] flex items-center justify-center w-[10rem]">
        Most Sold Categories
      </h2>
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
        >
          {data.map((entry, index) => {
            const percentage = (entry.value / total) * 360; // Calculate angle
            const endAngle = startAngle + percentage;
            const path = getDonutPath(
              cx,
              cy,
              innerRadius,
              outerRadii[entry.name as keyof typeof outerRadii],
              startAngle,
              endAngle
            );
            startAngle = endAngle; // Update start angle for next segment

            return <path key={`arc-${index}`} d={path} fill={entry.color} />;
          })}
        </svg>
      </div>
      {/* Custom Legend with Percentages */}
      <div className="flex justify-between mt-4 px-2 pb-3 w-full">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="font-montserrat text-[#2b2b2b] text-[10px]">
              {entry.name} {Math.round((entry.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
