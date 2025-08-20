export interface OrderData {
    id: string;
    image: string;
    title: string;
    description: string;
    buyerName: string;
    sellerName: string;
    amount: string;
    date: string;
    checked: boolean;
}

export interface orderDataProps {
  order: OrderData[];
  handleBuyerInfo: (id: string) => void;
  handleSellerInfo: (id: string) => void;
  handleCheckboxChange: (id: string) => void;
  handleSelectAll: () => void;
  allChecked: boolean;
}

export const TrackAgentData: OrderData[] = [
  {
    id: "1458372044",
    image: "/images/yellowPepper.png",
    title: "Yellow Pepper",
    description: "Fresh yellow bell",
    buyerName: "John Doe",
    sellerName: "Jane Smith",
    amount: "$1500",
    date: "2023-10-01",
    checked: false,
  },
  {
    id: "2458372045",
    image: "/images/yellowPepper.png",
    title: "Yellow Pepper",
    description: "Fresh yellow bell",
    buyerName: "Alice Brown",
    sellerName: "Bob Johnson",
    amount: "$800",
    date: "2023-10-02",
    checked: false,
  },
  {
    id: "3458372046",
    image: "/images/yellowPepper.png",
    title: "Yellow Pepper",
    description: "Crisp yellow bell",
    buyerName: "Emma Wilson",
    sellerName: "Tom Davis",
    amount: "$600",
    date: "2023-10-03",
    checked: false,
  },
  {
    id: "4458372047",
    image: "/images/yellowPepper.png",
    title: "Yellow Pepper",
    description: "Organic yellow bell",
    buyerName: "Liam Taylor",
    sellerName: "Sarah Miller",
    amount: "$1200",
    date: "2023-10-04",
    checked: false,
  },
  {
    id: "5458372048",
    image: "/images/yellowPepper.png",
    title: "Yellow Pepper",
    description: "Fresh yellow bell",
    buyerName: "Olivia Lee",
    sellerName: "Michael Chen",
    amount: "$2000",
    date: "2023-10-05",
    checked: false,
  },
  {
    id: "6458372049",
    image: "/images/yellowPepper.png",
    title: "Yellow Pepper",
    description: "Sweet yellow bell",
    buyerName: "Noah Clark",
    sellerName: "Emily Adams",
    amount: "$1800",
    date: "2023-10-06",
    checked: false,
  },
  {
    id: "7458372050",
    image: "/images/yellowPepper.png",
    title: "Yellow Pepper",
    description: "Ripe yellow bell",
    buyerName: "Sophia Harris",
    sellerName: "David Walker",
    amount: "$900",
    date: "2023-10-07",
    checked: false,
  },
];