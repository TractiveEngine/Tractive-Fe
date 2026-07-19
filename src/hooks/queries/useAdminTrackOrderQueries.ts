import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  adminTrackOrderService,
  AgentTrackParams,
  AgentTrackResponse,
} from "@/services/adminTrackOrderService";

/**
 * Query hook for the admin "Track Orders → Agent" list (A7 in
 * BACKEND_API_REQUIREMENTS.md). Re-fetches per tab/filter and keeps the
 * previous rows on screen while the next status loads. The Buyer/Seller Info
 * popups (A9) read straight from the list rows, so they need no query of their
 * own.
 */

export const adminTrackOrderKeys = {
  agentList: (params: AgentTrackParams) =>
    ["admin-track-orders", "agent", params] as const,
};

export const useAgentTrackOrders = (params: AgentTrackParams = {}) =>
  useQuery<AgentTrackResponse>({
    queryKey: adminTrackOrderKeys.agentList(params),
    queryFn: () => adminTrackOrderService.getAgentTrackOrders(params),
    placeholderData: keepPreviousData,
  });
