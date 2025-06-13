"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FarmerActionMenu } from "../../farmers/_components/FarmerActionMenu";
import "../../Table.css";

interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
}

interface BaseData {
  id: string;
}

interface ProfileListTableProps<T extends BaseData> {
  dataType: string;
  columns: ColumnConfig<T>[];
  initialData?: T[];
  fetchData?: (dataType: string) => Promise<T[]>;
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const ProfileListTable = <T extends BaseData>({
  dataType,
  columns,
  initialData = [],
  fetchData,
}: ProfileListTableProps<T>): React.ReactElement => {
  const [data, setData] = useState<T[]>(initialData);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (fetchData) {
      fetchData(dataType).then((fetchedData) => setData(fetchedData));
    }
  }, [dataType, fetchData]);

  const handleEdit = (id: string) => {
    alert(`Edit profile for ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

  const handleReport = (id: string) => {
    alert(`Report ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="Table_Container"
    >
      <table className="Table_Style">
        <thead>
          <tr className="text-left text-[13px] font-normal font-montserrat text-[#2b2b2b] md:text-sm">
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`py-1.5 px-4 font-montserrat font-normal ${
                  col.minWidth || "min-w-[100px]"
                } sm:table-cell`}
              >
                {col.header}
              </th>
            ))}
            <th className="py-1.5 px-4 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={item.id}
              className="border-gray-200 border-b-[1px] py-1.5 px-4 relative"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              {columns.map((col) => (
                <td
                  key={col.key as string}
                  className="py-1.5 px-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-montserrat font-normal text-[#2b2b2b]"
                >
                  {col.render ? col.render(item) : String(item[col.key])}
                </td>
              ))}
              <td className="py-1.5 px-4 relative">
                <FarmerActionMenu
                  productId={item.id}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  handleEdit={handleEdit}
                  handleReport={handleReport}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
