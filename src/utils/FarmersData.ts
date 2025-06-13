
export interface Farmer {
    id: string;
    image: string;
    name: string;
    state: string;
    revenue: string;
    orders: number;
    mobile: string;
    date: string;
    checked: boolean;
  }
  
  export const farmers: Farmer[] = [
    {
      id: "123456789",
      image: "/images/bidder3.png",
      name: "John Adebayo",
      state: "Lagos",
      revenue: "$12,500",
      orders: 500,
      mobile: "09034453342",
      date: "23/09/2025",
      checked: false,
    },
    {
      id: "678901234",
      image: "/images/bidder1.png",
      name: "Sarah Okafor",
      state: "Ogun",
      revenue: "$8,750",
      orders: 500,
      mobile: "09034453342",
      date: "23/09/2025",
      checked: false,
    },
    {
      id: "543210987",
      image: "/images/bidder2.png",
      name: "Emeka Musa",
      state: "Kano",
      revenue: "$15,300",
      orders: 500,
      mobile: "09034453342",
      date: "23/09/2025",
      checked: false,
    },
    {
      id: "987654321",
      image: "/images/bidder3.png",
      name: "Chioma Nwosu",
      state: "Abia",
      revenue: "$10,200",
      orders: 500,
      mobile: "09034453342",
      date: "23/09/2025",
      checked: false,
    },
    {
      id: "456789123",
      image: "/images/bidder4.png",
      name: "Ahmed Bello",
      state: "Kaduna",
      revenue: "$9,400",
      orders: 500,
      mobile: "09034453342",
      date: "23/09/2025",
      checked: false,
    },
];