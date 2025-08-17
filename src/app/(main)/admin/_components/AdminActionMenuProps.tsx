export interface AdminActionMenuProps {
  userTypeId: string
  status?: string;
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
  handleAdminSuspended?: (id: string) => void;
  handleAdminRemoved?: (id: string) => void;
  handleReactivate?: (id: string) => void;
  handleAdminOnboarding?: (id: string) => void;
}
