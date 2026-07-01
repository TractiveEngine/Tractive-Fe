import { useQuery } from "@tanstack/react-query";
import { referenceService } from "@/services/referenceService";

// Query key factory
export const referenceKeys = {
  all: ["reference"] as const,
  states: () => [...referenceKeys.all, "states"] as const,
  fleetStatuses: () => [...referenceKeys.all, "fleet-statuses"] as const,
};

// Reference data changes rarely, so cache it aggressively and don't retry on
// a missing endpoint — consumers fall back to their local hardcoded list.
const referenceRetry = (
  failureCount: number,
  error: { response?: { status?: number } },
) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403 || status === 404) return false;
  return failureCount < 2;
};

/**
 * Nigerian states (AddFleet route From/To dropdowns).
 * Falls back to the hardcoded `nigerianStates` list when unavailable.
 */
export const useStates = () => {
  return useQuery({
    queryKey: referenceKeys.states(),
    queryFn: () => referenceService.getStates(),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: referenceRetry,
  });
};

/**
 * Transporter fleet statuses (AddFleet Fleet Status dropdown).
 * Falls back to the hardcoded status labels when unavailable.
 */
export const useFleetStatuses = () => {
  return useQuery({
    queryKey: referenceKeys.fleetStatuses(),
    queryFn: () => referenceService.getFleetStatuses(),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: referenceRetry,
  });
};
