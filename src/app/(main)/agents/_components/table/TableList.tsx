"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Added import for TickIcon
import { ActionMenuProps } from "../ActionMenuProps";
import { TickIcon } from "../../produce-list/_components/table/ProductRow";
import "../../Table.css";
interface ColumnConfig<T> {
  header: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
}

interface BaseData {
  id: string;
  checked?: boolean;
}

interface BidsListTableProps<T extends BaseData> {
  dataType: string;
  columns: ColumnConfig<T>[];
  initialData?: T[];
  fetchData?: (dataType: string) => Promise<T[]>;
  ActionMenuComponent?: React.ComponentType<ActionMenuProps>;
  handleEdit?: (id: string) => void;
  handleReport?: (id: string) => void;
  handleViewBidders?: (id: string) => void;
  handleBuyerInfo?: (id: string) => void;
  handleParked?: (id: string) => void;
  handleDelivered?: (id: string) => void;
  handleTrackOrder?: (id: string) => void;
  handleCustomerCare?: (id: string) => void;
  handleCheckboxChange?: (id: string) => void;
  handleSelectAll?: () => void;
  allChecked?: boolean;
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const TableList = <T extends BaseData>({
  dataType,
  columns,
  initialData = [],
  fetchData,
  ActionMenuComponent,
  handleEdit,
  handleReport,
  handleViewBidders,
  handleBuyerInfo,
  handleParked,
  handleDelivered,
  handleTrackOrder,
  handleCustomerCare,
  handleCheckboxChange,
  handleSelectAll,
  allChecked,
}: BidsListTableProps<T>): React.ReactElement => {
  const [data, setData] = useState<T[]>(initialData);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const isProductTable = ["new", "parked", "delivered"].includes(dataType);

  useEffect(() => {
    if (fetchData) {
      fetchData(dataType).then((fetchedData) => setData(fetchedData));
    } else {
      setData(initialData);
    }
  }, [dataType, fetchData, initialData]);

  // Default handlers for farmers and bids
  const defaultHandleEdit = (id: string) => {
    console.log(`Default handleEdit called for id: ${id}`);
    alert(`Edit ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleReport = (id: string) => {
    console.log(`Default handleReport called for id: ${id}`);
    alert(`Report ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleViewBidders = (id: string) => {
    console.log(`Default handleViewBidders called for id: ${id}`);
    alert(`View bidders for ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

  // Default no-op handlers for product actions
  const defaultHandleBuyerInfo = (id: string) => {
    console.log(`Default handleBuyerInfo called for id: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleParked = (id: string) => {
    console.log(`Default handleParked called for id: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleDelivered = (id: string) => {
    console.log(`Default handleDelivered called for id: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleTrackOrder = (id: string) => {
    console.log(`Default handleTrackOrder called for id: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleCustomerCare = (id: string) => {
    console.log(`Default handleCustomerCare called for id: ${id}`);
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
          <tr className="text-left text-[12px] font-normal font-montserrat text-[#2b2b2b] md:text-sm">
            {isProductTable && (
              <th className="py-3 pl-4 w-[50px] min-w-[50px]">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-[1px] border-gray-300 text-[#538e53] focus:ring-[#538e53] focus:ring-[1px] appearance-none checked:bg-[#538e53] checked:border-[#538e53] touch:p-2"
                  />
                  {allChecked && <TickIcon />}
                </div>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`py-1.5 px-4 font-montserrat text-[10px] sm:text-[11px] md:text-[12px] font-normal ${
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
              {isProductTable && (
                <td className="py-1.5 pl-4 whitespace-nowrap">
                  <div className="relative w-5 h-5">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange?.(item.id)}
                      className="w-5 h-5 rounded border-[1px] border-gray-300 text-[#538e53] focus:ring-[#538e53] focus:ring-[1px] appearance-none checked:bg-[#538e53] checked:border-[#538e53]"
                    />
                    {item.checked && <TickIcon />}
                  </div>
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key as string}
                  className="py-1.5 px-4 text-[10px] sm:text-[11px] md:text-[12px] font-montserrat font-normal text-[#2b2b2b]"
                >
                  {col.render ? col.render(item) : String(item[col.key])}
                </td>
              ))}
              <td className="py-1.5 px-4 relative">
                {ActionMenuComponent && (
                  <ActionMenuComponent
                    productId={item.id}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    handleEdit={
                      dataType === "farmers"
                        ? handleEdit || defaultHandleEdit
                        : undefined
                    }
                    handleReport={
                      dataType === "farmers"
                        ? handleReport || defaultHandleReport
                        : undefined
                    }
                    handleViewBidders={
                      dataType === "bids"
                        ? handleViewBidders || defaultHandleViewBidders
                        : undefined
                    }
                    handleBuyerInfo={
                      dataType === "new" ||
                      dataType === "parked" ||
                      dataType === "delivered"
                        ? handleBuyerInfo || defaultHandleBuyerInfo
                        : undefined
                    }
                    handleParked={
                      dataType === "new"
                        ? handleParked || defaultHandleParked
                        : undefined
                    }
                    handleDelivered={
                      dataType === "parked"
                        ? handleDelivered || defaultHandleDelivered
                        : undefined
                    }
                    handleTrackOrder={
                      dataType === "delivered"
                        ? handleTrackOrder || defaultHandleTrackOrder
                        : undefined
                    }
                    handleCustomerCare={
                      dataType === "new" ||
                      dataType === "parked" ||
                      dataType === "delivered"
                        ? handleCustomerCare || defaultHandleCustomerCare
                        : undefined
                    }
                  />
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
