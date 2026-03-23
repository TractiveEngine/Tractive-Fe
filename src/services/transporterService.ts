import api from "@/lib/axios";

export interface Transporter {
  id: string; // the frontend currently expects `id`
  _id?: string;
  image?: string;
  transporterName?: string;
  businessName?: string;
  name?: string;
  rating?: number;
  rateStatus?: string;
  transporterYear?: string | number;
  customerNumber?: number;
  transporterBio?: string;
  locationFrom?: string;
  locationTo?: string;
  [key: string]: unknown;
}

export interface GetTransportersParams {
  search?: string;
  location?: string;
  rating?: number;
  yearsOfExperience?: number;
}

export const transporterService = {
  /**
   * Get all transporters
   * GET /api/transporters
   */
  getTransporters: async (params?: GetTransportersParams): Promise<Transporter[]> => {
    try {
      const response = await api.get("/api/transporters", { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("[TransporterService] getTransporters error:", error);
      throw error;
    }
  },

  /**
   * Get transporter by id
   * GET /api/transporters/{id}
   */
  getTransporterById: async (id: string): Promise<Transporter> => {
    try {
      const response = await api.get(`/api/transporters/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`[TransporterService] getTransporterById ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get transporter reviews
   * GET /api/transporters/{id}/reviews
   */
  getTransporterReviews: async (id: string): Promise<unknown> => {
    try {
      const response = await api.get(`/api/transporters/${id}/reviews`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`[TransporterService] getTransporterReviews ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get fleet details by id
   * GET /api/transporters/fleet/{id}
   */
  getFleetById: async (id: string): Promise<unknown> => {
    try {
      const response = await api.get(`/api/transporters/fleets/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`[TransporterService] getFleetById ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get transporter trucks
   * GET /api/transporters/trucks
   */
  getTransporterTrucks: async (params?: {
    status?: string;
    fromState?: string;
    toState?: string;
  }): Promise<unknown> => {
    try {
      const response = await api.get("/api/transporters/trucks", { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("[TransporterService] getTransporterTrucks error:", error);
      throw error;
    }
  },
};
