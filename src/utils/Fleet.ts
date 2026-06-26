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

  // Additional fields for View Fleet Modal
  fleetNumber?: string;
  model?: string;
  size?: string;
  priceNegotiation?: boolean;
  fleetDescription?: string;
  images?: string[];
}

// ---------------------------------------------------------------------------
// Fleet status: UI label <-> API enum.
// The API accepts `available | under_maintenance | on_transit`; the UI shows
// human labels. Canonical labels match the fleet status toggle menu
// (ActionMenu). Legacy "Active"/"Inactive" labels still map for older data.
// ---------------------------------------------------------------------------

export const FLEET_STATUS_API_TO_LABEL: Record<string, string> = {
  available: "Available",
  under_maintenance: "Under Maintenance",
  on_transit: "On Transit",
};

const FLEET_STATUS_LABEL_TO_API: Record<string, string> = {
  Available: "available",
  "Under Maintenance": "under_maintenance",
  "On Transit": "on_transit",
  // Legacy labels kept for backwards compatibility with older saved values.
  Active: "available",
  Inactive: "under_maintenance",
};

/** Form label (or legacy value) -> API enum. Defaults to `available`. */
export const fleetStatusToApi = (value?: string): string => {
  if (!value) return "available";
  if (FLEET_STATUS_LABEL_TO_API[value]) return FLEET_STATUS_LABEL_TO_API[value];
  const norm = value.toLowerCase().replace(/\s+/g, "_");
  return FLEET_STATUS_API_TO_LABEL[norm] ? norm : "available";
};

/** API enum (or label) -> form label. Defaults to `Available`. */
export const fleetStatusToLabel = (value?: string): string => {
  if (!value) return "Available";
  if (FLEET_STATUS_API_TO_LABEL[value]) return FLEET_STATUS_API_TO_LABEL[value];
  const norm = value.toLowerCase().replace(/\s+/g, "_");
  if (FLEET_STATUS_API_TO_LABEL[norm]) return FLEET_STATUS_API_TO_LABEL[norm];
  if (FLEET_STATUS_LABEL_TO_API[value]) return value; // already a known label
  return "Available";
};

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