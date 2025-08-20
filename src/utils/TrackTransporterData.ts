export interface TransporterData {
  id: string;
  IOT: string;
  image: string;
  title: string;
  description: string;
  buyerName: string;
  transporterName: string;
  amount: string;
  date: string;
  checked: boolean;
}

export interface transporterDataProps {
  transport: TransporterData[];
  handleTBuyerInfo: (id: string) => void;
  handleTransporterInfo: (id: string) => void;
  handleTrackOrder: (id: string) => void;
  handleCheckboxChange: (id: string) => void;
  handleSelectAll: () => void;
  allChecked: boolean;
}

export const TrackTransporterData: TransporterData[] = [
  {
    id: "1458372044",
    IOT: "1458372044",
    image: "/images/truckcontainer.png",
    title: "Big Truck",
    description: "40 fit container",
    buyerName: "John Doe",
    transporterName: "Jane Smith",
    amount: "$1500",
    date: "2023-10-01",
    checked: false,
  },
  {
    id: "2458372045",
    IOT: "2458372045",
    image: "/images/truckcontainer.png",
    title: "Big Truck",
    description: "40 fit container",
    buyerName: "Alice Brown",
    transporterName: "Bob Johnson",
    amount: "$800",
    date: "2023-10-02",
    checked: false,
  },
  {
    id: "3458372046",
    IOT: "3458372046",
    image: "/images/truckcontainer.png",
    title: "Big Truck",
    description: "40 fit container",
    buyerName: "Emma Wilson",
    transporterName: "Tom Davis",
    amount: "$600",
    date: "2023-10-03",
    checked: false,
  },
  {
    id: "4458372047",
    IOT: "4458372047",
    image: "/images/truckcontainer.png",
    title: "Big Truck",
    description: "40 fit container",
    buyerName: "Liam Taylor",
    transporterName: "Sarah Miller",
    amount: "$1200",
    date: "2023-10-04",
    checked: false,
  },
  {
    id: "5458372048",
    IOT: "5458372048",
    image: "/images/truckcontainer.png",
    title: "Big Truck",
    description: "40 fit container",
    buyerName: "Olivia Lee",
    transporterName: "Michael Chen",
    amount: "$2000",
    date: "2023-10-05",
    checked: false,
  },
  {
    id: "6458372049",
    IOT: "6458372049",
    image: "/images/truckcontainer.png",
    title: "Big Truck",
    description: "40 fit container",
    buyerName: "Noah Clark",
    transporterName: "Emily Adams",
    amount: "$1800",
    date: "2023-10-06",
    checked: false,
  },
  {
    id: "7458372050",
    IOT: "7458372050",
    image: "/images/truckcontainer.png",
    title: "Big Truck",
    description: "40 fit container",
    buyerName: "Sophia Harris",
    transporterName: "David Walker",
    amount: "$900",
    date: "2023-10-07",
    checked: false,
  },
];
