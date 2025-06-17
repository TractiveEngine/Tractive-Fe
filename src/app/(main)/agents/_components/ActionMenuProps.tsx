export interface ActionMenuProps {
  productId: string;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleEdit?: (id: string) => void;
  handleReport?: (id: string) => void;
  handleViewBidders?: (id: string) => void;
}