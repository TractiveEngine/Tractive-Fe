import React from "react";

export const ProductTableSkeleton = () => {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="Table_Container animate-pulse">
      <table className="Table_Style w-full">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="py-3 pl-4 w-[50px]">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </th>
            <th className="py-3 px-4 min-w-[150px]">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </th>
            <th className="py-3 px-4 min-w-[100px]">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </th>
            <th className="py-3 px-4 min-w-[100px]">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </th>
            <th className="py-3 px-4 min-w-[100px]">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </th>
            <th className="py-3 px-4 min-w-[100px]">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </th>
            <th className="py-3 px-4 w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={index} className="border-b border-gray-100">
              {/* Checkbox */}
              <td className="py-4 pl-4 align-top">
                <div className="h-5 w-5 bg-gray-200 rounded mt-1"></div>
              </td>
              {/* Item */}
              <td className="py-4 px-4 align-top">
                <div className="flex items-start gap-3">
                  <div className="h-[47px] w-[87px] bg-gray-200 rounded shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </td>
              {/* ID */}
              <td className="py-4 px-4 align-top">
                <div className="h-3 w-20 bg-gray-200 rounded mt-2"></div>
              </td>
              {/* Price */}
              <td className="py-4 px-4 align-top">
                <div className="h-3 w-16 bg-gray-200 rounded mt-2"></div>
              </td>
              {/* Stock */}
              <td className="py-4 px-4 align-top">
                <div className="h-3 w-12 bg-gray-200 rounded mt-2"></div>
              </td>
              {/* Categories */}
              <td className="py-4 px-4 align-top">
                <div className="flex gap-1 flex-wrap mt-1">
                  <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                </div>
              </td>
              {/* Action */}
              <td className="py-4 px-4 align-top">
                <div className="h-6 w-0 bg-gray-200 rounded-full mt-1 ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
