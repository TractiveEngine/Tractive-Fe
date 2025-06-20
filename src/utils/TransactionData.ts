export interface Transaction {
    id: string;
    image: string;
    name: string;
    description: string;
    sold: number;
    commission: number;
    buyer: string;
    date: string;
    checked: boolean;
  }
  
  export const PendingData: Transaction[] = [
    {
      id: "123456789",
      image: "/images/yellowPepper.png",
      name: "Coco Yam",
      description: "Freshly harvested coco yam",
      sold: 1200.5,
      commission: 400,
      buyer: "Emeka Chika",
      date: "23/09/2025",
      checked: false,
    },
    {
      id: "987654321",
      image: "/images/yellowPepper.png",
      name: "Fresh Tomatoes",
      description: "Organic red tomatoes",
      sold: 850.75,
      commission: 200,
      buyer: "Aisha Bello",
      date: "20/09/2025",
      checked: false,
    },
    {
      id: "456789123",
      image: "/images/yellowPepper.png",
      name: "White Yam",
      description: "Premium quality yam",
      sold: 1500.0,
      commission: 300,
      buyer: "Chinedu Okeke",
      date: "19/09/2025",
      checked: false,
    },
    {
      id: "789123456",
      image: "/images/yellowPepper.png",
      name: "Green Pepper",
      description: "Fresh green peppers",
      sold: 650.25,
      commission: 150,
      buyer: "Fatima Musa",
      date: "18/09/2025",
      checked: false,
    },
    {
      id: "321654987",
      image: "/images/yellowPepper.png",
      name: "Ripe Plantain",
      description: "Sweet ripe plantains",
      sold: 900.0,
      commission: 250,
      buyer: "Oluwaseun Ade",
      date: "17/09/2025",
      checked: false,
    },
    {
      id: "654987321",
      image: "/images/yellowPepper.png",
      name: "Red Onions",
      description: "Fresh red onions",
      sold: 700.5,
      commission: 180,
      buyer: "Ngozi Eze",
      date: "16/09/2025",
      checked: false,
    },
  ];
  
  export const ApprovedData: Transaction[] = [
    {
      id: "123456789",
      image: "/images/yellowPepper.png",
      name: "Coco Yam",
      description: "Freshly harvested coco yam",
      sold: 1200.5,
      commission: 300,
      buyer: "Emeka Chika",
      date: "23/09/2025",
      checked: false,
    },
    {
      id: "258963147",
      image: "/images/yellowPepper.png",
      name: "Irish Potatoes",
      description: "Fresh Irish potatoes",
      sold: 950.0,
      commission: 220,
      buyer: "Tunde Lawal",
      date: "21/09/2025",
      checked: true,
    },
    {
      id: "369852147",
      image: "/images/yellowPepper.png",
      name: "Carrots",
      description: "Organic carrots",
      sold: 600.25,
      commission: 150,
      buyer: "Hauwa Ali",
      date: "20/09/2025",
      checked: true,
    },
    {
      id: "147258369",
      image: "/images/yellowPepper.png",
      name: "Cucumbers",
      description: "Fresh cucumbers",
      sold: 450.75,
      commission: 100,
      buyer: "Ifeoma Nwafor",
      date: "19/09/2025",
      checked: true,
    },
    {
      id: "963852741",
      image: "/images/yellowPepper.png",
      name: "Lettuce",
      description: "Crisp green lettuce",
      sold: 300.0,
      commission: 80,
      buyer: "Bola Adekunle",
      date: "18/09/2025",
      checked: true,
    },
    {
      id: "741258963",
      image: "/images/yellowPepper.png",
      name: "Spinach",
      description: "Fresh spinach leaves",
      sold: 400.5,
      commission: 120,
      buyer: "Chukwuma Obi",
      date: "17/09/2025",
      checked: true,
    },
  ];