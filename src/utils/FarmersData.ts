export interface Farmer {
  id: string;
  name: string;
  state: string;
  address: string;
  localMarket: string;
  ninOrCac: string;
  mobile: string;
  altMobile: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  revenue: string;
  orders: string;
  date: string;
  image: string;
}

export const farmers: Farmer[] = [
  {
    id: "farmer-1",
    name: "John Adebayo",
    state: "Ogun",
    address: "123 Farm Road, Abeokuta",
    localMarket: "Lafenwa Market",
    ninOrCac: "12345678901",
    mobile: "08012345678",
    altMobile: "08123456789",
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "John Adebayo",
    revenue: "$12,500",
    orders: "45",
    date: "15/03/2025",
    image: "/images/bidder1.png",
  },
  {
    id: "farmer-2",
    name: "Aisha Bello",
    state: "Kaduna",
    address: "45 Market Street, Kaduna",
    localMarket: "Central Market",
    ninOrCac: "RC9876543",
    mobile: "08134567890",
    altMobile: "",
    bankName: "Zenith Bank",
    accountNumber: "0987654321",
    accountName: "Aisha Bello",
    revenue: "$8,750",
    orders: "30",
    date: "22/02/2025",
    image: "/images/bidder2.png",
  },
  {
    id: "farmer-3",
    name: "Chukwuma Obi",
    state: "Anambra",
    address: "78 Village Lane, Onitsha",
    localMarket: "Main Market",
    ninOrCac: "98765432109",
    mobile: "07045678901",
    altMobile: "09012345678",
    bankName: "GTBank",
    accountNumber: "1234567890",
    accountName: "Chukwuma Obi",
    revenue: "$15,000",
    orders: "60",
    date: "10/01/2025",
    image: "/images/bidder3.png",
  },
  {
    id: "farmer-4",
    name: "Fatima Yusuf",
    state: "Lagos",
    address: "12 Coastal Road, Lekki",
    localMarket: "Mile 12 Market",
    ninOrCac: "45678912345",
    mobile: "08098765432",
    altMobile: "08187654321",
    bankName: "First Bank Nigeria",
    accountNumber: "5432109876",
    accountName: "Fatima Yusuf",
    revenue: "$10,200",
    orders: "38",
    date: "05/04/2025",
    image: "/images/bidder4.png",
  },
];
