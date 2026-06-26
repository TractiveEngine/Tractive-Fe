import api from "@/lib/axios";

export type FleetTripStatus =
  | "planned"
  | "pending" // legacy alias for older trips — normalised to "planned" in the UI
  | "picked"
  | "on_transit"
  | "delivered"
  | "cancelled";

export interface FleetTripBuyer {
  _id?: string;
  id?: string;
  name?: string;
  businessName?: string | null;
  email?: string;
  phone?: string;
  avatar?: string;
  image?: string | null;
  address?: string;
  state?: string;
}

export interface FleetTripPackage {
  _id?: string;
  id?: string;
  productId?: string;
  name?: string;
  image?: string;
  description?: string;
  quantity?: number;
  unit?: string;
  unitWeightKg?: number;
  loadWeightKg?: number;
}

export interface FleetTripRoute {
  fromState?: string;
  toState?: string;
}

export interface FleetTripFleet {
  _id?: string;
  id?: string;
  fleetName?: string;
  fleetNumber?: string;
  plateNumber?: string;
  model?: string;
  iot?: string;
  image?: string;
  images?: string[];
  capacity?: string;
  capacityKg?: number;
  route?: FleetTripRoute;
}

export interface FleetTripTransporter {
  _id?: string;
  id?: string;
  name?: string;
  businessName?: string | null;
  phone?: string;
  email?: string;
  address?: string;
  state?: string;
  image?: string | null;
  avatar?: string;
  company?: string;
}

export interface FleetTripDriver {
  _id?: string;
  id?: string;
  name?: string;
  phone?: string;
  licenseNumber?: string;
  image?: string | null;
}

export interface FleetTripCoords {
  lat?: number;
  lng?: number;
  label?: string;
}

export interface FleetTripSummary {
  _id?: string;
  id?: string;
  /** `/tracking` exposes the trip id under `tripId` instead of `_id`. */
  tripId?: string;
  status?: FleetTripStatus;
  fleet?: FleetTripFleet | string;
  fleetId?: string;
  transporter?: FleetTripTransporter;
  driver?: FleetTripDriver | null;
  buyers?: FleetTripBuyer[];
  packages?: FleetTripPackage[];
  bookingIds?: unknown[];
  orderIds?: unknown[];
  paymentIds?: unknown[];
  trackingCode?: string;
  fromLocation?: string;
  toLocation?: string;
  origin?: string | null;
  destination?: string | null;
  currentLocation?: FleetTripCoords | string | null;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  pickedAt?: string | null;
  onTransitAt?: string | null;
  deliveredAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  estDeliveryDate?: string;
  loadWeightKg?: number;
  loadWeightTonnes?: number;
  totalLoadKg?: number;
  capacityKg?: number;
  wholeTruckOnly?: boolean;
  packageCount?: number;
  buyerCount?: number;
  orderCount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FleetTripTimelineEvent {
  status: FleetTripStatus | string;
  /** Newer responses use `timestamp`; older ones use `at`. Read both. */
  at?: string;
  timestamp?: string;
  note?: string;
  location?: string;
}

/**
 * Detailed tracking payload from GET /fleet-trips/{id}/tracking.
 * It carries every summary field plus a status timeline; some backends
 * also nest the trip under `trip`, so consumers should merge defensively.
 */
export interface FleetTripTracking extends FleetTripSummary {
  trip?: FleetTripSummary;
  timeline?: FleetTripTimelineEvent[];
}

export interface GetFleetTripsParams {
  status?: FleetTripStatus;
  fleetId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateFleetTripPayload {
  fleetId: string;
  bookingIds: string[];
}

/** PATCH /fleet-trips/{id}/status — supports status, location label and lat/lng. */
export interface UpdateFleetTripStatusPayload {
  status: FleetTripStatus;
  note?: string;
  location?: string;
  lat?: number;
  lng?: number;
}

const unwrap = <T>(body: unknown): T => {
  if (body && typeof body === "object" && "data" in (body as Record<string, unknown>)) {
    return (body as { data: T }).data;
  }
  return body as T;
};

export const fleetTripService = {
  /**
   * GET /api/transporters/fleet-trips
   * Lists tracking trips for the transporter/admin tracking board.
   */
  getFleetTrips: async (
    params?: GetFleetTripsParams,
  ): Promise<FleetTripSummary[]> => {
    try {
      const response = await api.get("/api/transporters/fleet-trips", { params });
      const payload = unwrap<unknown>(response.data);
      if (Array.isArray(payload)) return payload as FleetTripSummary[];
      if (payload && typeof payload === "object") {
        const maybe = payload as { trips?: FleetTripSummary[] };
        if (Array.isArray(maybe.trips)) return maybe.trips;
      }
      return [];
    } catch (error) {
      console.error("[FleetTripService] getFleetTrips error:", error);
      throw error;
    }
  },

  /**
   * POST /api/transporters/fleet-trips
   * Manually creates a tracking trip from selected confirmed bookingIds on a fleet.
   */
  createFleetTrip: async (
    payload: CreateFleetTripPayload,
  ): Promise<FleetTripSummary> => {
    try {
      const response = await api.post("/api/transporters/fleet-trips", payload);
      return unwrap<FleetTripSummary>(response.data);
    } catch (error) {
      console.error("[FleetTripService] createFleetTrip error:", error);
      throw error;
    }
  },

  /**
   * GET /api/transporters/fleet-trips/{tripId}
   */
  getFleetTrip: async (tripId: string): Promise<FleetTripSummary> => {
    try {
      const response = await api.get(`/api/transporters/fleet-trips/${tripId}`);
      return unwrap<FleetTripSummary>(response.data);
    } catch (error) {
      console.error(`[FleetTripService] getFleetTrip ${tripId} error:`, error);
      throw error;
    }
  },

  /**
   * GET /api/transporters/fleet-trips/{tripId}/tracking
   */
  getFleetTripTracking: async (tripId: string): Promise<FleetTripTracking> => {
    try {
      const response = await api.get(
        `/api/transporters/fleet-trips/${tripId}/tracking`,
      );
      return unwrap<FleetTripTracking>(response.data);
    } catch (error) {
      console.error(
        `[FleetTripService] getFleetTripTracking ${tripId} error:`,
        error,
      );
      throw error;
    }
  },

  /**
   * PATCH /api/transporters/fleet-trips/{tripId}/status
   */
  updateFleetTripStatus: async (
    tripId: string,
    payload: UpdateFleetTripStatusPayload,
  ): Promise<FleetTripSummary> => {
    try {
      const response = await api.patch(
        `/api/transporters/fleet-trips/${tripId}/status`,
        payload,
      );
      return unwrap<FleetTripSummary>(response.data);
    } catch (error) {
      console.error(
        `[FleetTripService] updateFleetTripStatus ${tripId} error:`,
        error,
      );
      throw error;
    }
  },
};
