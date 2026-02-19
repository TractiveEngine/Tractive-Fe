import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import "../../Table.css";

export const DriverTableSkeleton = () => {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="Table_Container animate-pulse">
      <table className="Table_Style w-full">
        <thead>
          <tr className="text-left border-b border-gray-200">
            {/* Name */}
            <th className="py-3 px-4 min-w-[150px]">
              <Skeleton className="h-4 w-24 bg-gray-200" />
            </th>
             {/* Route */}
            <th className="py-3 px-4 min-w-[100px]">
              <Skeleton className="h-4 w-16 bg-gray-200" />
            </th>
             {/* Fleet */}
            <th className="py-3 px-4 min-w-[100px]">
               <Skeleton className="h-4 w-16 bg-gray-200" />
            </th>
             {/* IoT */}
            <th className="py-3 px-4 min-w-[120px]">
              <Skeleton className="h-4 w-16 bg-gray-200" />
            </th>
             {/* License Number */}
            <th className="py-3 px-4 min-w-[120px]">
              <Skeleton className="h-4 w-24 bg-gray-200" />
            </th>
             {/* Date */}
            <th className="py-3 px-4 min-w-[100px]">
              <Skeleton className="h-4 w-20 bg-gray-200" />
            </th>
             {/* Actions */}
            <th className="py-3 px-4 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={index} className="border-b border-gray-100">
              {/* Name (Image + Text) */}
              <td className="py-4 px-4 align-top">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-[35px] w-[35px] rounded-full bg-gray-200 shrink-0" />
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                </div>
              </td>
              {/* Route */}
              <td className="py-4 px-4 align-top">
                <Skeleton className="h-4 w-20 bg-gray-200 mt-2" />
              </td>
              {/* Fleet */}
              <td className="py-4 px-4 align-top">
                <Skeleton className="h-4 w-20 bg-gray-200 mt-2" />
              </td>
              {/* IoT */}
              <td className="py-4 px-4 align-top">
                 <Skeleton className="h-4 w-16 bg-gray-200 mt-2" />
              </td>
              {/* License Number */}
              <td className="py-4 px-4 align-top">
                <Skeleton className="h-4 w-24 bg-gray-200 mt-2" />
              </td>
              {/* Date */}
               <td className="py-4 px-4 align-top">
                <Skeleton className="h-4 w-20 bg-gray-200 mt-2" />
              </td>
              {/* Actions */}
              <td className="py-4 px-4 align-top">
                 <Skeleton className="h-[30px] w-[30px] rounded-full bg-gray-200 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
