// services/referenceService.ts
//
// Shared reference data (T11 / S3 / S4): Nigerian states and transporter
// fleet statuses. These endpoints back the AddFleet form dropdowns that were
// previously hardcoded. Consumers keep a local fallback list, so the form
// still works if the endpoint is missing (404) or errors.

import api from "@/lib/axios";

export interface StateOption {
  code: string;
  name: string;
}

export interface FleetStatusOption {
  value: string;
  label: string;
}

/**
 * Normalise one state record. Tolerates the documented shape (`{ code, name }`),
 * a bare string, or common variants (`state`, `label`, `id`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapState = (raw: any): StateOption => {
  if (typeof raw === "string") return { code: raw, name: raw };
  const name = raw?.name ?? raw?.state ?? raw?.label ?? raw?.code ?? "";
  return { code: String(raw?.code ?? raw?.id ?? name), name: String(name) };
};

/**
 * Normalise one fleet-status record. Tolerates the documented shape
 * (`{ value, label }`), a bare string, or common variants (`status`, `key`,
 * `name`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapFleetStatus = (raw: any): FleetStatusOption => {
  if (typeof raw === "string") return { value: raw, label: raw };
  const value = raw?.value ?? raw?.status ?? raw?.key ?? raw?.label ?? "";
  const label = raw?.label ?? raw?.name ?? raw?.title ?? value;
  return { value: String(value), label: String(label) };
};

export const referenceService = {
  /**
   * Nigerian states.
   * GET /api/states → [{ code, name }]
   */
  getStates: async (): Promise<StateOption[]> => {
    try {
      const response = await api.get("/api/states");
      const body = response.data;
      const payload = body?.data ?? body;
      const list = Array.isArray(payload)
        ? payload
        : payload?.states ?? payload?.items ?? [];
      return (Array.isArray(list) ? list : [])
        .map(mapState)
        .filter((s: StateOption) => !!s.name);
    } catch (error) {
      console.error("[ReferenceService] getStates error:", error);
      throw error;
    }
  },

  /**
   * Transporter fleet statuses.
   * GET /api/transporters/fleet-statuses
   *   → [{ value, label }] for available | under_maintenance | on_transit
   */
  getFleetStatuses: async (): Promise<FleetStatusOption[]> => {
    try {
      const response = await api.get("/api/transporters/fleet-statuses");
      const body = response.data;
      const payload = body?.data ?? body;
      const list = Array.isArray(payload)
        ? payload
        : payload?.statuses ?? payload?.items ?? [];
      return (Array.isArray(list) ? list : [])
        .map(mapFleetStatus)
        .filter((s: FleetStatusOption) => !!s.value);
    } catch (error) {
      console.error("[ReferenceService] getFleetStatuses error:", error);
      throw error;
    }
  },
};
