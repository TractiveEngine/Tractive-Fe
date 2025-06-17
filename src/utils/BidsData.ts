export interface Bidder {
  id: string;
  name: string;
  bidAmount: number;
}

export interface Bids {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  bidders: string;
  leading: number;
  farmer: string;
  date: string;
  checked: boolean;
  biddersList: Bidder[]; // New field for bidder details
}

export const bidsList: Bids[] = [
  {
    id: "123456789",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 1200.5,
    bidders: "+50",
    leading: 1000.0,
    farmer: "John Adebayo",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b1", name: "Alice Smith", bidAmount: 1000.0 },
      { id: "b2", name: "Bob Johnson", bidAmount: 950.0 },
      { id: "b3", name: "Clara Brown", bidAmount: 900.0 },
      { id: "b4", name: "David Wilson", bidAmount: 850.0 },
    ],
  },
  {
    id: "678901234",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 850.75,
    bidders: "+50",
    leading: 800.0,
    farmer: "Emeka Chika",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b5", name: "Emma Davis", bidAmount: 800.0 },
      { id: "b6", name: "Frank Miller", bidAmount: 750.0 },
      { id: "b7", name: "Grace Lee", bidAmount: 700.0 },
      { id: "b8", name: "Henry Taylor", bidAmount: 650.0 },
    ],
  },
  {
    id: "543210987",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 2000.0,
    bidders: "+50",
    leading: 1000.0,
    farmer: "Emeka Musa",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b9", name: "Isabella Clark", bidAmount: 1000.0 },
      { id: "b10", name: "James White", bidAmount: 950.0 },
      { id: "b11", name: "Kelly Green", bidAmount: 900.0 },
      { id: "b12", name: "Liam Harris", bidAmount: 850.0 },
    ],
  },
  {
    id: "987654321",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 2000.0,
    bidders: "+50",
    leading: 1000.0,
    farmer: "Emeka Musa",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b13", name: "Mia Thompson", bidAmount: 1000.0 },
      { id: "b14", name: "Noah Martinez", bidAmount: 950.0 },
      { id: "b15", name: "Olivia Garcia", bidAmount: 900.0 },
      { id: "b16", name: "Peter Robinson", bidAmount: 850.0 },
    ],
  },
  {
    id: "456789123",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 2000.0,
    bidders: "+50",
    leading: 1000.0,
    farmer: "Kola Adeyemi",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b17", name: "Quinn Walker", bidAmount: 1000.0 },
      { id: "b18", name: "Rachel Young", bidAmount: 950.0 },
      { id: "b19", name: "Samuel King", bidAmount: 900.0 },
      { id: "b20", name: "Tara Scott", bidAmount: 850.0 },
    ],
  },
  {
    id: "321654987",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 2000.0,
    bidders: "+50",
    leading: 4000.0,
    farmer: "Tunde Bakare",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b21", name: "Uma Patel", bidAmount: 4000.0 },
      { id: "b22", name: "Victor Nguyen", bidAmount: 3800.0 },
      { id: "b23", name: "Wendy Lopez", bidAmount: 3600.0 },
      { id: "b24", name: "Xavier Adams", bidAmount: 3400.0 },
    ],
  },
  {
    id: "789123456",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 2000.0,
    bidders: "+50",
    leading: 4000.0,
    farmer: "Adeola Johnson",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b25", name: "Yara Evans", bidAmount: 4000.0 },
      { id: "b26", name: "Zachary Brown", bidAmount: 3800.0 },
      { id: "b27", name: "Amelia Carter", bidAmount: 3600.0 },
      { id: "b28", name: "Benjamin Diaz", bidAmount: 3400.0 },
    ],
  },
  {
    id: "654321789",
    image: "/images/yellowPepper.png",
    name: "Coco Yam",
    description: "Best of all the...",
    price: 2000.0,
    bidders: "+50",
    leading: 3000.0,
    farmer: "Kola Adeyemi",
    date: "23/09/2025",
    checked: false,
    biddersList: [
      { id: "b29", name: "Chloe Edwards", bidAmount: 3000.0 },
      { id: "b30", name: "Daniel Foster", bidAmount: 2800.0 },
      { id: "b31", name: "Ella Gray", bidAmount: 2600.0 },
      { id: "b32", name: "Finn Hall", bidAmount: 2400.0 },
    ],
  },
];