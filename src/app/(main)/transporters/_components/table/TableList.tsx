"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../Table.css";
import { useRouter } from "next/navigation";
import { DriverActionMenuProps } from "../../_components/DriverActionMenuProps";

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

interface ListTableProps<T extends BaseData> {
  dataType: string;
  columns: ColumnConfig<T>[];
  initialData?: T[];
  fetchData?: (dataType: string) => Promise<T[]>;
  ActionMenuComponent?: React.ComponentType<DriverActionMenuProps>;
  handleEdit?: (id: string) => void;
  handleRemove?: (id: string) => void;
  handleAssignFleet?: (id: string) => void;
  handleViewBidders?: (id: string) => void;
  handleCustomerInfo?: (id: string) => void;
  handleSupport?: (id: string) => void;
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
  handleRemove,
  handleAssignFleet,
  handleViewBidders,
  handleBuyerInfo,
  handleParked,
  handleDelivered,
  handleTrackOrder,
  handleCustomerCare,
  handleCustomerInfo,
  handleSupport,
}: ListTableProps<T>): React.ReactElement => {
  const router = useRouter();
  const [data, setData] = useState<T[]>(initialData);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (fetchData) {
      fetchData(dataType).then((fetchedData) => setData(fetchedData));
    } else {
      setData(initialData);
    }
  }, [dataType, fetchData, initialData]);

  const defaultHandleEdit = (id: string) => {
    console.log(`Default handleEdit called for id: ${id}`);
    alert(`Edit ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleRemove = (id: string) => {
    console.log(`Default handleRemove called for id: ${id}`);
    alert(`Remove ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleAssignFleet = (id: string) => {
    console.log(`Default handleAssignFleet called for id: ${id}`);
    if (handleAssignFleet) {
      handleAssignFleet(id);
    } else {
      alert(`Assign fleet to ${dataType} with ID: ${id}`);
    }
    setActiveMenu(null);
  };

  const defaultHandleViewBidders = (id: string) => {
    console.log(`Default handleViewBidders called for id: ${id}`);
    alert(`View bidders for ${dataType} with ID: ${id}`);
    setActiveMenu(null);
  };

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
    router.push(`/agents/delivered/trackorder/${id}`);
    setActiveMenu(null);
  };

  const defaultHandleCustomerCare = (id: string) => {
    console.log(`Default handleCustomerCare called for id: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleCustomerInfo = (id: string) => {
    console.log(`Default handleCustomerInfo called for id: ${id}`);
    setActiveMenu(null);
  };

  const defaultHandleSupport = (id: string) => {
    console.log(`Default handleSupport called for id: ${id}`);
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
                    driverId={item.id}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    handleEdit={
                      dataType === "drivers"
                        ? handleEdit || defaultHandleEdit
                        : undefined
                    }
                    handleRemove={
                      dataType === "drivers"
                        ? handleRemove || defaultHandleRemove
                        : undefined
                    }
                    handleAssignFleet={
                      dataType === "drivers"
                        ? handleAssignFleet || defaultHandleAssignFleet
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
                      dataType === "pending"
                        ? handleCustomerCare || defaultHandleCustomerCare
                        : undefined
                    }
                    handleCustomerInfo={
                      dataType === "customers"
                        ? handleCustomerInfo || defaultHandleCustomerInfo
                        : undefined
                    }
                    handleSupport={
                      dataType === "customers"
                        ? handleSupport || defaultHandleSupport
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
