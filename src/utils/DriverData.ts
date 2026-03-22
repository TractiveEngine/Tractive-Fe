export interface Driver {
  id: string;
  name: string;
  route: string;
  fleet: string;
  iot: string;
  phone: string; // Changed from mobile to phone to match PATCH payload key, or I can map it. Let's use phone to match payload.
  mobile?: string; // Keeping for backward compatibility if needed, or I'll replace it.
  licenseNumber?: string;
  date: string;
  image: string;
  assignedTruck?: {
    _id: string;
    plateNumber: string;
    fleetName: string;
    fleetNumber: string;
    iot: string;
    images?: string[];
    route: {
      fromState: string;
      toState: string;
    };
    [key: string]: unknown;
  };
}

export const drivers: Driver[] = [
  {
    id: "1",
    name: "John Adebayo",
    route: "Abeokuta - Lagos",
    fleet: "Swift Trans",
    iot: "IOT12345",
    phone: "08012345678",
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
    phone: "08134567890",
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
    phone: "07045678901",
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
    phone: "08098765432",
    mobile: "08098765432",
    date: "05/04/2025",
    image: "/images/bidder1.png",
  },
];
