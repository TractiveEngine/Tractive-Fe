import api from "@/lib/axios";

export interface FleetRoute {
  fromState: string;
  toState: string;
}

export interface FleetPayload {
  fleetName: string;
  fleetNumber: string;
  iot: string;
  model: string;
  size: string;
  price: number;
  priceNegotiation: boolean;
  images: string[];
  fleetDescription: string;
  fleetStates: string;
  route: FleetRoute;
}

export interface FleetResponse extends FleetPayload {
  _id: string;
  userId: string;
  status: string; // Assuming there's a status field
  createdAt: string;
  updatedAt: string;
  capacity?: string;
  plateNumber?: string;
}

export const fleetService = {
  // POST /api/transporters/fleets - Add a new fleet
  createFleet: async (data: FleetPayload) => {
    try {
      const response = await api.post("/api/transporters/fleets", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create fleet");
    }
  },

  // GET /api/transporters/fleets - Get all fleets for the transporter
  getFleets: async (): Promise<FleetResponse[]> => {
    try {
      const response = await api.get("/api/transporters/fleets");
      const responseData = response.data;
      if (responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      } else if (Array.isArray(responseData)) {
        return responseData;
      }
      return [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch fleets");
    }
  },

  // PATCH /api/transporters/fleet/{id} - Update a fleet
  updateFleet: async (id: string, data: Partial<FleetPayload>) => {
    try {
      const response = await api.patch(`/api/transporters/fleet/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update fleet");
    }
  },

  // DELETE /api/transporters/fleet/{id} - Delete a fleet
  deleteFleet: async (id: string) => {
    try {
      const response = await api.delete(`/api/transporters/fleet/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete fleet");
    }
  },

  // PATCH /api/transporters/fleet/{id}/status - Update fleet status
  updateFleetStatus: async (id: string, status: string) => {
    try {
      const response = await api.patch(`/api/transporters/fleet/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update fleet status");
    }
  },
};
