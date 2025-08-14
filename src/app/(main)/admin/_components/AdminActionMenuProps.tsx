export interface AdminActionMenuProps {
  userTypeId: string;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleViewProfile?: (id: string) => void;
  handleSuspended?: (id: string) => void;
  handleToggleStatus?: (id: string) => void;
   status?: string;
}
