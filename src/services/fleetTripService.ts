import api from "@/lib/axios";

export type FleetTripStatus =
  | "pending"
  | "picked"
  | "on_transit"
  | "delivered"
  | "cancelled";

export interface FleetTripBuyer {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: string;
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
}

export interface FleetTripFleet {
  _id?: string;
  id?: string;
  fleetName?: string;
  plateNumber?: string;
  iot?: string;
  image?: string;
  images?: string[];
  capacity?: string;
  capacityKg?: number;
}

export interface FleetTripSummary {
  _id?: string;
  id?: string;
  status?: FleetTripStatus;
  fleet?: FleetTripFleet | string;
  fleetId?: string;
  buyers?: FleetTripBuyer[];
  packages?: FleetTripPackage[];
  bookingIds?: string[];
  orderIds?: string[];
  fromLocation?: string;
  toLocation?: string;
  pickedAt?: string;
  onTransitAt?: string;
  deliveredAt?: string;
  estDeliveryDate?: string;
  totalLoadKg?: number;
  capacityKg?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FleetTripTimelineEvent {
  status: FleetTripStatus | string;
  at?: string;
  note?: string;
  location?: string;
}

export interface FleetTripTracking {
  trip?: FleetTripSummary;
  status?: FleetTripStatus;
  currentLocation?: { lat?: number; lng?: number; label?: string };
  timeline?: FleetTripTimelineEvent[];
  buyers?: FleetTripBuyer[];
  transporter?: {
    _id?: string;
    name?: string;
    phone?: string;
    avatar?: string;
    company?: string;
  };
  fleet?: FleetTripFleet;
  packages?: FleetTripPackage[];
  fromLocation?: string;
  toLocation?: string;
  pickedAt?: string;
  onTransitAt?: string;
  deliveredAt?: string;
  estDeliveryDate?: string;
  [key: string]: unknown;
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

export interface UpdateFleetTripStatusPayload {
  status: FleetTripStatus;
  note?: string;
  location?: string;
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
