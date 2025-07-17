export interface TransportActionMenuProps {
  driverId: string;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleEdit?: (id: string) => void;
  handleRemove?: (id: string) => void;
  handleReject?: (id: string) => void;
  handleAccept?: (id: string) => void;
  handleBuyerInfo?: (id: string) => void;
  handleCustomerInfo?: (id: string) => void;
  handleParked?: (id: string) => void;
  handleDelivered?: (id: string) => void;
  handleTrackOrder?: (id: string) => void;
  handleCustomerCare?: (id: string) => void;
  handleSupport?: (id: string) => void;
  handleAssignFleet?: (id: string) => void;
}
