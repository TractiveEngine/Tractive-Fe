"use client";
import React from "react";
import { useAgentMostSoldCategories } from "@/hooks/queries/useAgentDashboardQueries";

// Palette cycled across however many categories the backend returns.
const PALETTE = ["#538E53", "#5198EC", "#D77F40", "#7912FF", "#E0B341", "#C0504D"];

// Function to calculate SVG arc path for donut segments
const getDonutPath = (
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
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
  const { data, isLoading, isError } = useAgentMostSoldCategories();

  const categories = data ?? [];
  // Use raw value for slice size; fall back to the percentage the backend sends.
  const slices = categories.map((c, i) => ({
    name: c.category,
    weight: c.value || c.percentage,
    percentage: c.percentage,
    color: PALETTE[i % PALETTE.length],
  }));
  const total = slices.reduce((sum, s) => sum + s.weight, 0);

  // SVG dimensions and center
  const width = 160;
  const height = 160;
  const cx = width / 2;
  const cy = height / 2;
  const innerRadius = 42.6433;
  const outerRadius = 75;

  // Prefer the backend percentage; otherwise derive it from the weights.
  const pct = (s: (typeof slices)[number]) =>
    s.percentage || (total > 0 ? (s.weight / total) * 100 : 0);

  let startAngle = 0;

  return (
    <div className="w-full bg-[#fefefe] shadow-md rounded-[6px] overflow-hidden">
      <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-medium mb-4 bg-[#E5F1E5] flex items-center justify-center w-[10rem]">
        Most Sold Categories
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="h-[160px] w-[160px] rounded-full bg-[#f1f1f1] animate-pulse" />
        </div>
      ) : isError || !slices.length || total <= 0 ? (
        <p className="px-2 py-10 text-center text-[11px] font-montserrat text-[#808080]">
          {isError ? "Couldn't load categories." : "No category sales yet."}
        </p>
      ) : (
        <>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              fill="none"
            >
              {slices.map((entry, index) => {
                const sweep = (entry.weight / total) * 360;
                const endAngle = startAngle + sweep;
                const path = getDonutPath(
                  cx,
                  cy,
                  innerRadius,
                  outerRadius,
                  startAngle,
                  endAngle,
                );
                startAngle = endAngle;
                return <path key={`arc-${index}`} d={path} fill={entry.color} />;
              })}
            </svg>
          </div>
          {/* Custom Legend with Percentages */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 px-2 pb-3 w-full">
            {slices.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="font-montserrat text-[#2b2b2b] text-[10px]">
                  {entry.name} {Math.round(pct(entry))}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
