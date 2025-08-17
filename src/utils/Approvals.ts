export interface AgentsProps {
  id: string;
  fullname: string;
  email: string;
  image: string;
  location: string;
  profession: string;
  mobile: string;
  NiN: string;
  date: string;
  checked: boolean;
}

export interface FarmersProps {
  id: string;
  fullname: string;
  email: string;
  image: string;
  location: string;
  onboardedBy: string;
  mobile: string;
  marketName: string;
  date: string;
  checked: boolean;
}


export interface ApprovalsAgentsProps {
  data: AgentsProps[];
  handleAgentApprove: (id: string) => void;
  handleAgentDecline: (id: string) => void;
  handleCheckboxChange: (id: string) => void;
  handleSelectAll: () => void;
  allChecked: boolean;
}

// Props interface for ApprovalFarmers
export interface ApprovalsFarmersProps {
  data: FarmersProps[];
  handleFarmerApprove: (id: string) => void;
  handleFarmerDecline: (id: string) => void;
  handleCheckboxChange: (id: string) => void;
  handleSelectAll: () => void;
  allChecked: boolean;
}



export const AgentsData: AgentsProps[] = [
  {
    id: "1",
    fullname: "John Doe",
    email: "john.doe@example.com",
    image: "/images/TopAgent.png",
    location: "Lagos",
    profession: "Agent",
    mobile: "123-456-7890",
    NiN: "NIN123456",
    date: "2023-01-01",
    checked: false,
  },
  {
    id: "2",
    fullname: "Jane Smith",
    email: "jane.smith@example.com",
    image: "/images/TopAgent.png",
    location: "Abuja",
    profession: "Agent",
    mobile: "987-654-3210",
    NiN: "NIN654321",
    date: "2023-02-01",
    checked: false,
  },
  {
    id: "3",
    fullname: "Michael Brown",
    email: "michael.brown@example.com",
    image: "/images/TopAgent.png",
    location: "Port Harcourt",
    profession: "Agent",
    mobile: "555-123-4567",
    NiN: "NIN789123",
    date: "2023-03-01",
    checked: false,
  },
  {
    id: "4",
    fullname: "Sarah Davis",
    email: "sarah.davis@example.com",
    image: "/images/TopAgent.png",
    location: "Enugu",
    profession: "Agent",
    mobile: "444-987-6543",
    NiN: "NIN456789",
    date: "2023-04-01",
    checked: false,
  },
  {
    id: "5",
    fullname: "David Wilson",
    email: "david.wilson@example.com",
    image: "/images/TopAgent.png",
    location: "Kaduna",
    profession: "Agent",
    mobile: "333-456-7890",
    NiN: "NIN321654",
    date: "2023-05-01",
    checked: false,
  },
];

export const FarmersData: FarmersProps[] = [
  {
    id: "1",
    fullname: "Alice Johnson",
    email: "alice.johnson@example.com",
    image: "/images/TopFarmer.png",
    location: "Kano",
    onboardedBy: "John Doe",
    mobile: "123-456-7890",
    marketName: "Kano Market",
    date: "2023-01-01",
    checked: false,
  },
  {
    id: "2",
    fullname: "Bob Williams",
    email: "bob.williams@example.com",
    image: "/images/TopFarmer.png",
    location: "Ibadan",
    onboardedBy: "Jane Smith",
    mobile: "987-654-3210",
    marketName: "Ibadan Market",
    date: "2023-02-01",
    checked: false,
  },
  {
    id: "3",
    fullname: "Emma Thompson",
    email: "emma.thompson@example.com",
    image: "/images/TopFarmer.png",
    location: "Ogun",
    onboardedBy: "Michael Brown",
    mobile: "555-321-4567",
    marketName: "Ogun Market",
    date: "2023-03-01",
    checked: false,
  },
  {
    id: "4",
    fullname: "James Lee",
    email: "james.lee@example.com",
    image: "/images/TopFarmer.png",
    location: "Jos",
    onboardedBy: "Sarah Davis",
    mobile: "444-654-9870",
    marketName: "Jos Market",
    date: "2023-04-01",
    checked: false,
  },
  {
    id: "5",
    fullname: "Grace Taylor",
    email: "grace.taylor@example.com",
    image: "/images/TopFarmer.png",
    location: "Benin",
    onboardedBy: "David Wilson",
    mobile: "333-789-1234",
    marketName: "Benin Market",
    date: "2023-05-01",
    checked: false,
  },
];
