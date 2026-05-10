export type TrackOrderStatus = "pending" | "picked" | "on_transit" | "delivered";

export interface TrackOrderPackage {
  id: string;
  productId: string;
  name: string;
  image: string;
  description: string;
}

export interface TrackOrder {
  id: string;
  transporter: {
    name: string;
    logo: string;
    rating: number;
    avatar: string;
    company: string;
    location: string;
    yearsOfService: number;
    followers: number;
    ratingLabel: string;
  };
  fleet: {
    name: string;
    iot: string;
    image: string;
  };
  product: {
    name: string;
    id: string;
    image: string;
  };
  status: TrackOrderStatus;
  pickedAt: string;
  onTransitAt: string;
  deliveredAt: string;
  estDeliveryDate: string;
  fromLocation: string;
  toLocation: string;
  packages: TrackOrderPackage[];
}

export const TRACK_ORDERS_DUMMY: TrackOrder[] = [
  {
    id: "ORD-1001",
    transporter: {
      name: "GIGM Transport Company",
      logo: "/images/truckcontainer.png",
      rating: 4,
      avatar: "/images/profileSettingImage.png",
      company: "Goddess corporation",
      location: "Abia state",
      yearsOfService: 5,
      followers: 700,
      ratingLabel: "Excellent",
    },
    fleet: {
      name: "Mack4567",
      iot: "5677666655",
      image: "/images/truckcontainer.png",
    },
    product: {
      name: "Tomatoes",
      id: "5677666655",
      image: "/images/tomatoes.png",
    },
    status: "on_transit",
    pickedAt: "20/04/2023",
    onTransitAt: "20/04/2023",
    deliveredAt: "—",
    estDeliveryDate: "26/04/2023",
    fromLocation: "Umuahia, Abia state",
    toLocation: "Ikorodu, Lagos state",
    packages: [
      {
        id: "PKG-001",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-002",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-003",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-004",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-005",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-006",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
    ],
  },
  {
    id: "ORD-1002",
    transporter: {
      name: "GIGM Transport Company",
      logo: "/images/truckcontainer.png",
      rating: 4,
      avatar: "/images/profileSettingImage.png",
      company: "Swift Logistics",
      location: "Lagos state",
      yearsOfService: 3,
      followers: 420,
      ratingLabel: "Good",
    },
    fleet: {
      name: "Mack4567",
      iot: "5677666655",
      image: "/images/truckcontainer.png",
    },
    product: {
      name: "Tomatoes",
      id: "5677666655",
      image: "/images/tomatoes.png",
    },
    status: "on_transit",
    pickedAt: "21/04/2023",
    onTransitAt: "22/04/2023",
    deliveredAt: "—",
    estDeliveryDate: "27/04/2023",
    fromLocation: "Aba, Abia state",
    toLocation: "Ikeja, Lagos state",
    packages: [
      {
        id: "PKG-101",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-102",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
    ],
  },
  {
    id: "ORD-1003",
    transporter: {
      name: "GIGM Transport Company",
      logo: "/images/truckcontainer.png",
      rating: 4,
      avatar: "/images/profileSettingImage.png",
      company: "Trans Nigeria",
      location: "Kano state",
      yearsOfService: 7,
      followers: 1200,
      ratingLabel: "Excellent",
    },
    fleet: {
      name: "Mack4567",
      iot: "5677666655",
      image: "/images/truckcontainer.png",
    },
    product: {
      name: "Tomatoes",
      id: "5677666655",
      image: "/images/tomatoes.png",
    },
    status: "picked",
    pickedAt: "23/04/2023",
    onTransitAt: "—",
    deliveredAt: "—",
    estDeliveryDate: "29/04/2023",
    fromLocation: "Kano, Kano state",
    toLocation: "Port Harcourt, Rivers state",
    packages: [
      {
        id: "PKG-201",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-202",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
      {
        id: "PKG-203",
        productId: "345678779",
        name: "Coco-yam",
        image: "/images/corn1.png",
        description: "Best of all the...",
      },
    ],
  },
];
