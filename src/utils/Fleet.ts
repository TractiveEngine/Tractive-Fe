// Define interfaces for type safety
export interface Fleet {
  id: string;
  image: string;
  name: string;
  IOT: string;
  route: string;
  status: string;
  price: number;
  date: string;
  checked: boolean;
}

// Sample data with unique IDs and varied fleet information
export const initialFleets: Fleet[] = [
  {
    id: "123456789",
    image: "/images/truckcontainer.png",
    name: "Cyber Truck",
    IOT: "CYB123456",
    route: "Abia - Lagos",
    status: "Under maintenance",
    price: 5000,
    date: "02/23/2025",
    checked: false,
  },
  {
    id: "987654321",
    image: "/images/truckcontainer.png",
    name: "Freight Liner",
    IOT: "FRT987654",
    route: "Lagos - Kano",
    status: "Available",
    price: 7500,
    date: "03/15/2025",
    checked: false,
  },
  {
    id: "456789123",
    image: "/images/truckcontainer.png",
    name: "Road Master",
    IOT: "RDM456789",
    route: "Port Harcourt - Abuja",
    status: "On transit",
    price: 6200,
    date: "04/01/2025",
    checked: false,
  },
  {
    id: "789123456",
    image: "/images/truckcontainer.png",
    name: "Heavy Duty",
    IOT: "HDY789123",
    route: "Enugu - Ibadan",
    status: "Available",
    price: 4800,
    date: "05/10/2025",
    checked: false,
  },
  {
    id: "321654987",
    image: "/images/truckcontainer.png",
    name: "Mega Freight",
    IOT: "MGF321654",
    route: "Kaduna - Onitsha",
    status: "Under maintenance",
    price: 8900,
    date: "06/20/2025",
    checked: false,
  },
];