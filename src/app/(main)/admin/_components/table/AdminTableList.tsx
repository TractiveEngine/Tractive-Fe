"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TickIcon } from "@/app/(main)/agents/produce-list/_components/table/ProductRow";
import { AdminActionMenuProps } from "../AdminActionMenuProps";
import "../../Table.css";

interface BaseData {
  id: string;
  checked?: boolean;
}

export interface ColumnConfig<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
  minWidth?: string;
}

interface ListTableProps<T extends BaseData> {
  dataType: string;
  columns: ColumnConfig<T>[];
  initialData?: T[];
  fetchData?: (dataType: string) => Promise<T[]>;
  ActionMenuComponent?: React.ComponentType<AdminActionMenuProps>;
  handleViewProfile?: (id: string) => void;
  handleProfile?: (id: string) => void;
  handleSuspended?: (id: string) => void;
  handleToggleStatus?: (id: string) => void;
  handleRefund?: (id: string) => void;
  handleApprove?: (id: string) => void;
  handleDecline?: (id: string) => void;
  handleAgentApprove?: (id: string) => void;
  handleAgentDecline?: (id: string) => void;
  handleFarmerApprove?: (id: string) => void;
  handleFarmerDecline?: (id: string) => void;
  handleCheckboxChange?: (id: string) => void;
  handleSelectAll?: () => void;
  allChecked?: boolean;
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const AdminTable = <T extends BaseData>({
  dataType,
  columns,
  initialData = [],
  fetchData,
  ActionMenuComponent,
  handleViewProfile,
  handleProfile,
  handleSuspended,
  handleToggleStatus,
  handleRefund,
  handleApprove,
  handleDecline,
  handleAgentApprove,
  handleAgentDecline,
  handleFarmerApprove,
  handleFarmerDecline,
  handleCheckboxChange,
  handleSelectAll,
  allChecked,
}: ListTableProps<T>): React.ReactElement => {
  const [data, setData] = useState<T[]>(initialData);
  // const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const isCheckboxTable = ["initialUsers", "TransactionalData", "AgentsData", "FarmersData"].includes(
    dataType
  );

  useEffect(() => {
    if (fetchData) {
      fetchData(dataType).then((fetchedData) => setData(fetchedData));
    } else {
      setData(initialData);
    }
  }, [dataType, fetchData, initialData]);

  const defaultHandleViewProfile = (id: string) => {
    console.log(`Default handleEdit called for id: ${id}`);
    alert(`Edit ${dataType} with ID: ${id}`);
  
  };

  const defaultHandleSuspended = (id: string) => {
    console.log(`Default handleRemove called for id: ${id}`);
    alert(`Remove ${dataType} with ID: ${id}`);

  };

  const defaultHandleApprove = (id: string) => {
    console.log(`Default handleApprove called for id: ${id}`);
    alert(`Approve ${dataType} with ID: ${id}`);
  };

  const defaultHandleDeclined = (id: string) => {
    console.log(`Default handleDeclined called for id: ${id}`);
    alert(`Decline ${dataType} with ID: ${id}`);
  };

  const defaultHandleRefund = (id: string) => {
    console.log(`Default handleRefund called for id: ${id}`);
    alert(`Refund ${dataType} with ID: ${id}`);

  };

  const defaultHandleAgentApprove = (id: string) => {
    console.log(`Default handleAgentApprove called for id: ${id}`);
    alert(`Approve ${dataType} with ID: ${id}`);
  };

  const defaultHandleAgentDecline = (id: string) => {
    console.log(`Default handleAgentDecline called for id: ${id}`);
    alert(`Decline ${dataType} with ID: ${id}`);
  };

  const defaultHandleFarmerApprove = (id: string) => {
    console.log(`Default handleFarmerApprove called for id: ${id}`);
    alert(`Approve ${dataType} with ID: ${id}`);
  };

  const defaultHandleFarmerDecline = (id: string) => {
    console.log(`Default handleFarmerDecline called for id: ${id}`);
    alert(`Decline ${dataType} with ID: ${id}`);
  };

  const defaultHandleProfile = (id: string) => {
    console.log(`Default handleRefund called for id: ${id}`);
    alert(`Refund ${dataType} with ID: ${id}`);

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
            {isCheckboxTable && (
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
              {isCheckboxTable && (
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
                  {col.render
                    ? col.render(item)
                    : String(item[col.key as keyof T])}
                </td>
              ))}
              <td className="py-1.5 px-4 relative">
                {ActionMenuComponent && (
                  <ActionMenuComponent
                    userTypeId={(item as any).userID}
                    handleViewProfile={
                      dataType === "initialUsers"
                        ? handleViewProfile || defaultHandleViewProfile
                        : undefined
                    }
                    handleSuspended={
                      dataType === "initialUsers"
                        ? handleSuspended || defaultHandleSuspended
                        : undefined
                    }
                    handleToggleStatus={
                      dataType === "initialUsers"
                        ? handleToggleStatus
                        : undefined
                    }
                    handleApprove={
                      dataType === "TransactionalData"
                        ? handleApprove || defaultHandleApprove
                        : undefined
                    }
                    handleDecline={
                      dataType === "TransactionalData"
                        ? handleDecline || defaultHandleDeclined
                        : undefined
                    }
                    handleRefund={
                      dataType === "TransactionalData"
                        ? handleRefund || defaultHandleRefund
                        : undefined
                    }
                    handleProfile={
                      dataType === "TransactionalData"
                        ? handleProfile || defaultHandleProfile
                        : undefined
                    }
                    handleAgentApprove={
                      dataType === "AgentsData"
                        ? handleAgentApprove || defaultHandleAgentApprove
                        : undefined
                    }
                    handleAgentDecline={
                      dataType === "AgentsData"
                        ? handleAgentDecline || defaultHandleAgentDecline
                        : undefined
                    }
                    handleFarmerApprove={
                      dataType === "FarmersData"
                        ? handleFarmerApprove || defaultHandleFarmerApprove
                        : undefined
                    }
                    handleFarmerDecline={
                      dataType === "FarmersData"
                        ? handleFarmerDecline || defaultHandleFarmerDecline
                        : undefined
                    }
                    status={(item as any).status}
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

export default AdminTable;
