export interface ActionMenuProps {
  productId: string;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleEdit?: (id: string) => void;
  handleReport?: (id: string) => void;
  handleViewBidders?: (id: string) => void;
  handleBuyerInfo?: (id: string) => void;
  handleParked?: (id: string) => void;
  handleDelivered?: (id: string) => void;
  handleTrackOrder?: (id: string) => void;
  handleCustomerCare?: (id: string) => void;
}
