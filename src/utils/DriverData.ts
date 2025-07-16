export interface Driver {
  id: string;
  name: string;
  route: string;
  fleet: string;
  iot: string;
  mobile: string;
  date: string;
  image: string;
}

export const drivers: Driver[] = [
  {
    id: "1",
    name: "John Adebayo",
    route: "Abeokuta - Lagos",
    fleet: "Swift Trans",
    iot: "IOT12345",
    mobile: "08012345678",
    date: "15/03/2025",
    image: "/images/bidder1.png",
  },
  {
    id: "2",
    name: "Aisha Bello",
    route: "Abeokuta - Lagos",
    fleet: "North Star",
    iot: "IOT67890",
    mobile: "08134567890",
    date: "22/02/2025",
    image: "/images/bidder1.png",
  },
  {
    id: "3",
    name: "Chukwuma Obi",
    route: "Abeokuta - Lagos",
    fleet: "North Star",
    iot: "IOT54321",
    mobile: "07045678901",
    date: "10/01/2025",
    image: "/images/bidder1.png",
  },
  {
    id: "4",
    name: "Fatima Yusuf",
    route: "Abeokuta - Lagos",
    fleet: "Coastal Haul",
    iot: "IOT98765",
    mobile: "08098765432",
    date: "05/04/2025",
    image: "/images/bidder1.png",
  },
];
