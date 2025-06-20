export interface Customer {
  id: string;
  name: string;
  state: string;
  mobile: string;
  revenue: number | string;
  orders: string;
  date: string;
  image: string;
}

export const customers: Customer[] = [
  {
    id: "customer-1",
    name: "John Adebayo",
    state: "Ogun",
    mobile: "08012345678",
    revenue: "$12,500",
    orders: "45",
    date: "15/03/2025",
    image: "/images/bidder1.png",
  },
  {
    id: "customer-2",
    name: "Aisha Bello",
    state: "Kaduna",
    mobile: "08134567890",
    revenue: "$8,750",
    orders: "30",
    date: "22/02/2025",
    image: "/images/bidder2.png",
  },
  {
    id: "customer-3",
    name: "Chukwuma Obi",
    state: "Anambra",
    mobile: "07045678901",
    revenue: "$15,000",
    orders: "60",
    date: "10/01/2025",
    image: "/images/bidder3.png",
  },
  {
    id: "customer-4",
    name: "Fatima Yusuf",
    state: "Lagos",
    mobile: "08098765432",
    revenue: "$10,200",
    orders: "38",
    date: "05/04/2025",
    image: "/images/bidder4.png",
  },
];
