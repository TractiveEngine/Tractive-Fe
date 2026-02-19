import api from "@/lib/axios";

export interface CreateDriverPayload {
  name: string;
  licenseNumber: string;
}

export interface UpdateDriverPayload {
  phone: string;
}

export interface AssignFleetPayload {
  truckId: string;
}

export class DriverService {
  /**
   * Get all drivers
   * GET /api/transporters/drivers
   */
  static async getDrivers<T>(): Promise<T> {
    const response = await api.get("/api/transporters/drivers");
    console.log("[DriverService] getDrivers response:", response.data);
    return response.data.data; // Extract the actual array
  }

  /**
   * Create a driver
   * POST /api/transporters/drivers
   */
  static async createDriver<T>(payload: CreateDriverPayload): Promise<T> {
    const response = await api.post("/api/transporters/drivers", payload);
    return response.data;
  }

  /**
   * Update a driver
   * PATCH /api/transporters/drivers/{id}
   */
  static async updateDriver<T>(id: string, payload: UpdateDriverPayload): Promise<T> {
    const response = await api.patch(`/api/transporters/drivers/${id}`, payload);
    return response.data;
  }

  /**
   * Delete a driver
   * DELETE /api/transporters/drivers/{id}
   */
  static async deleteDriver(id: string): Promise<void> {
    await api.delete(`/api/transporters/drivers/${id}`);
  }

  /**
   * Assign fleet to a driver
   * POST /api/transporters/drivers/{id}/assign-fleet
   */
  static async assignFleet<T>(id: string, payload: AssignFleetPayload): Promise<T> {
    const response = await api.post(`/api/transporters/drivers/${id}/assign-fleet`, payload);
    return response.data;
  }
}
