export interface AdminControl {
  id: string;
  fullName: string;
  email: string;
  image: string;
  location: string;
  mobile: string;
  status: "Active" | "Suspended" | "Removed";
  date: string;
  checked: boolean;
}

export interface AdminMethodProps {
  data: AdminControl[];
  handleAdminSuspended?: (id: string) => void;
  handleAdminRemoved?: (id: string) => void;
  handleReactivate?: (id: string) => void;
  handleAdminOnboarding?: (id: string) => void;
  handleCheckboxChange: (id: string) => void;
  handleSelectAll: () => void;
  allChecked: boolean;
}

export const ASRDataControl: AdminControl[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    image: "/images/TopAgent.png",
    location: "Lagos",
    mobile: "123-456-7890",
    status: "Active",
    date: "2023-01-01",
    checked: false,
  },
  {
    id: "2",
    fullName: "Alice Johnson",
    email: "alice.johnson@example.com",
    image: "/images/TopAgent.png",
    location: "Abuja",
    mobile: "234-567-8901",
    status: "Active",
    date: "2023-04-15",
    checked: false,
  },
  {
    id: "3",
    fullName: "David Lee",
    email: "david.lee@example.com",
    image: "/images/TopAgent.png",
    location: "Kano",
    mobile: "345-678-9012",
    status: "Active",
    date: "2023-06-20",
    checked: false,
  },
  {
    id: "4",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    image: "/images/TopAgent.png",
    location: "Port Harcourt",
    mobile: "456-789-0123",
    status: "Suspended",
    date: "2023-02-10",
    checked: false,
  },
  {
    id: "5",
    fullName: "Emma Wilson",
    email: "emma.wilson@example.com",
    image: "/images/TopAgent.png",
    location: "Ibadan",
    mobile: "567-890-1234",
    status: "Suspended",
    date: "2023-05-25",
    checked: false,
  },
  {
    id: "6",
    fullName: "Michael Brown",
    email: "michael.brown@example.com",
    image: "/images/TopAgent.png",
    location: "Enugu",
    mobile: "678-901-2345",
    status: "Suspended",
    date: "2023-07-30",
    checked: false,
  },
  {
    id: "7",
    fullName: "Sarah Davis",
    email: "sarah.davis@example.com",
    image: "/images/TopAgent.png",
    location: "Benin City",
    mobile: "789-012-3456",
    status: "Removed",
    date: "2023-03-05",
    checked: false,
  },
  {
    id: "8",
    fullName: "James Taylor",
    email: "james.taylor@example.com",
    image: "/images/TopAgent.png",
    location: "Jos",
    mobile: "890-123-4567",
    status: "Removed",
    date: "2023-08-12",
    checked: false,
  },
  {
    id: "9",
    fullName: "Linda Martinez",
    email: "linda.martinez@example.com",
    image: "/images/TopAgent.png",
    location: "Kaduna",
    mobile: "901-234-5678",
    status: "Removed",
    date: "2023-09-18",
    checked: false,
  },
];
