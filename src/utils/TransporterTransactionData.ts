import type { TransporterTransactionApi } from "@/services/transporterService";

export interface TransporterTransaction {
  id: string;
  IOT: string;
  image: string;
  name: string;
  description: string;
  Payment: number;
  KG: number;
  Seller: string;
  date: string;
  checked: boolean;
  status?: string;
}

const formatDate = (value?: string): string => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const resolvePayerName = (tx: TransporterTransactionApi): string => {
  const payer =
    typeof tx.payer === "object" && tx.payer ? tx.payer : undefined;
  const buyer =
    typeof tx.buyer === "object" && tx.buyer ? tx.buyer : undefined;
  const source = payer ?? buyer;
  if (!source) return "";
  if (source.name) return source.name;
  if (source.fullName) return source.fullName;
  const first = source.firstName ?? "";
  const last = source.lastName ?? "";
  return `${first} ${last}`.trim();
};

const resolveOrder = (tx: TransporterTransactionApi) =>
  typeof tx.order === "object" && tx.order ? tx.order : undefined;

const resolveFleet = (tx: TransporterTransactionApi) => {
  const order = resolveOrder(tx);
  if (!order) return undefined;
  const fleet =
    typeof order.fleet === "object" && order.fleet ? order.fleet : undefined;
  const truck =
    typeof order.truck === "object" && order.truck ? order.truck : undefined;
  return fleet ?? truck;
};

export const mapTransporterTransaction = (
  tx: TransporterTransactionApi,
): TransporterTransaction => {
  const order = resolveOrder(tx);
  const fleet = resolveFleet(tx);
  const id = tx._id ?? tx.id ?? "";
  const iot =
    (order && typeof order.iot === "string" ? order.iot : "") ||
    (typeof order === "object" && order?._id ? order._id.slice(-9) : "") ||
    id.slice(-9);
  const image =
    fleet?.image ||
    (Array.isArray(fleet?.images) && fleet?.images?.[0]) ||
    "/images/truckcontainer.png";
  const name = fleet?.fleetName || fleet?.name || "Fleet";
  const description = fleet?.description || fleet?.plateNumber || "";
  const weight =
    (order && typeof order.weightKg === "number" ? order.weightKg : undefined) ??
    (order && typeof order.weight === "number" ? order.weight : undefined) ??
    0;

  return {
    id,
    IOT: iot,
    image,
    name,
    description,
    Payment: typeof tx.amount === "number" ? tx.amount : 0,
    KG: weight,
    Seller: resolvePayerName(tx),
    date: formatDate(tx.createdAt),
    checked: tx.status === "approved",
    status: typeof tx.status === "string" ? tx.status : undefined,
  };
};

export const TransporterPendingData: TransporterTransaction[] = [
  {
    id: "123456789",
    IOT: "123456789",
    image: "/images/truckcontainer.png",
    name: "FreightMaster",
    description: "Heavy-duty container truck",
    Payment: 1200.5,
    KG: 400,
    Seller: "Emeka Chika",
    date: "23/09/2025",
    checked: false,
  },
  {
    id: "723456001",
    IOT: "723456001",
    image: "/images/truckcontainer.png",
    name: "SwiftFreight",
    description: "Medium cargo van",
    Payment: 750.0,
    KG: 700,
    Seller: "Aisha Bello",
    date: "25/09/2025",
    checked: false,
  },
  {
    id: "987654321",
    IOT: "987654321",
    image: "/images/truckcontainer.png",
    name: "MegaTrans",
    description: "Long-haul container carrier",
    Payment: 2700.75,
    KG: 1000,
    Seller: "Chidi Okonkwo",
    date: "26/09/2025",
    checked: false,
  },
  {
    id: "700123456",
    IOT: "700123456",
    image: "/images/truckcontainer.png",
    name: "BulkMover",
    description: "Bulk cargo transport truck",
    Payment: 4500.0,
    KG: 2000,
    Seller: "Fatima Adeyemi",
    date: "27/09/2025",
    checked: false,
  },
  {
    id: "712345003",
    IOT: "712345003",
    image: "/images/truckcontainer.png",
    name: "QuickFreight",
    description: "Light delivery van",
    Payment: 1700.0,
    KG: 500,
    Seller: "Kemi Adeola",
    date: "28/09/2025",
    checked: false,
  },
  {
    id: "700543210",
    IOT: "700543210",
    image: "/images/truckcontainer.png",
    name: "HeavyDuty",
    description: "Reinforced cargo truck",
    Payment: 3700.5,
    KG: 800,
    Seller: "Sani Abubakar",
    date: "29/09/2025",
    checked: false,
  },
  {
    id: "777123456",
    IOT: "777123456",
    image: "/images/truckcontainer.png",
    name: "FleetStar",
    description: "Multi-purpose transport vehicle",
    Payment: 2700.0,
    KG: 700,
    Seller: "Esther Obi",
    date: "30/09/2025",
    checked: false,
  },
];

export const TransporterApprovedData: TransporterTransaction[] = [
  {
    id: "123456789",
    IOT: "123456789",
    image: "/images/truckcontainer.png",
    name: "FreightMaster",
    description: "Heavy-duty container truck",
    Payment: 1200.5,
    KG: 400,
    Seller: "Emeka Chika",
    date: "23/09/2025",
    checked: true,
  },
  {
    id: "712345002",
    IOT: "712345002",
    image: "/images/truckcontainer.png",
    name: "CargoKing",
    description: "High-capacity cargo hauler",
    Payment: 1800.7,
    KG: 600,
    Seller: "Tunde Lawal",
    date: "20/09/2025",
    checked: true,
  },
  {
    id: "456789123",
    IOT: "456789123",
    image: "/images/truckcontainer.png",
    name: "Transatron",
    description: "Specialized freight transporter",
    Payment: 3000.0,
    KG: 1500,
    Seller: "Ngozi Eze",
    date: "21/09/2025",
    checked: true,
  },
  {
    id: "700987654",
    IOT: "700987654",
    image: "/images/truckcontainer.png",
    name: "BulkFreight",
    description: "Bulk goods transport vehicle",
    Payment: 2200.0,
    KG: 700,
    Seller: "Ibrahim Musa",
    date: "22/09/2025",
    checked: true,
  },
  {
    id: "777654321",
    IOT: "777654321",
    image: "/images/truckcontainer.png",
    name: "SpeedFreight",
    description: "Fast cargo delivery truck",
    Payment: 2500.0,
    KG: 900,
    Seller: "Hassan Yusuf",
    date: "19/09/2025",
    checked: true,
  },
  {
    id: "700321987",
    IOT: "700321987",
    image: "/images/truckcontainer.png",
    name: "EcoTrans",
    description: "Eco-friendly transport van",
    Payment: 1700.0,
    KG: 300,
    Seller: "Chioma Nwosu",
    date: "18/09/2025",
    checked: true,
  },
  {
    id: "723456007",
    IOT: "723456007",
    image: "/images/truckcontainer.png",
    name: "MegaFreight",
    description: "Heavy-duty freight carrier",
    Payment: 4700.0,
    KG: 700,
    Seller: "Musa Danjuma",
    date: "17/09/2025",
    checked: true,
  },
];