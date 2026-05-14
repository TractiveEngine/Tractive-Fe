import api from "@/lib/axios";

export interface NegotiationRespondPayload {
  action: "accept" | "reject" | "counter";
  amount?: number;
  message?: string;
}

export interface TransporterBidRespondPayload {
  action: "accept" | "reject" | "counter";
  amount?: number;
  message?: string;
}

export interface FleetBidShipmentItem {
  orderId: string;
  productId: string;
  quantity: number;
}

export interface CreateFleetBidPayload {
  amount: number;
  shipmentItems: FleetBidShipmentItem[];
  message?: string;
}

export interface FleetBidResponse {
  _id: string;
  fleet: string | { _id: string; fleetName: string; images?: string[]; route?: { fromState: string; toState: string } };
  buyer: { _id: string; name: string; email: string };
  amount: number;
  counterAmount?: number;
  status: "pending" | "accepted" | "rejected" | "countered";
  shipmentItems: FleetBidShipmentItem[];
  message?: string;
  transporterMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFleetPaymentPayload {
  fleetBidId: string;
  paymentMethod: string;
  note?: string;
}

export interface DirectFleetShipmentItem {
  orderId: string;
  productId: string;
  quantityToShip: number;
}

export interface CreateDirectFleetPaymentPayload {
  paymentMethod: string;
  shipmentItems: DirectFleetShipmentItem[];
  note?: string;
}

export class NegotiationService {
  /**
   * List transporter negotiations
   * GET /api/transporters/negotiations
   */
  static async getNegotiations<T>(): Promise<T> {
    const response = await api.get("/api/transporters/negotiations");
    return response.data.data;
  }

  /**
   * Respond to negotiation
   * POST /api/transporters/negotiations/{id}/respond
   */
  static async respondToNegotiation<T>(
    id: string,
    payload: NegotiationRespondPayload
  ): Promise<T> {
    const response = await api.post(
      `/api/transporters/negotiations/${id}/respond`,
      payload
    );
    return response.data;
  }

  /**
   * Create a fleet bid (buyer role)
   * POST /api/transporters/fleet/{fleetId}/bids
   */
  static async createFleetBid<T>(
    fleetId: string,
    payload: CreateFleetBidPayload
  ): Promise<T> {
    const response = await api.post(
      `/api/transporters/fleet/${fleetId}/bids`,
      payload
    );
    return response.data;
  }

  /**
   * Get all fleet bids for the authenticated buyer
   * GET /api/buyers/fleet-bids
   */
  static async getBuyerFleetBids(): Promise<FleetBidResponse[]> {
    const response = await api.get("/api/buyers/fleet-bids");
    return response.data.data || response.data || [];
  }

  /**
   * Transporter lists all bids placed on one of their fleets.
   * GET /api/transporters/fleet/{fleetId}/bids
   */
  static async getFleetBidsForTransporter(fleetId: string): Promise<unknown> {
    const response = await api.get(
      `/api/transporters/fleet/${fleetId}/bids`
    );
    return response.data.data ?? response.data ?? [];
  }

  /**
   * Transporter responds to a buyer's bid on their fleet (accept/reject/counter).
   * POST /api/transporters/fleet/{fleetId}/bids/{bidId}/respond
   */
  static async respondToFleetBidAsTransporter(
    fleetId: string,
    bidId: string,
    payload: TransporterBidRespondPayload
  ): Promise<unknown> {
    const response = await api.post(
      `/api/transporters/fleet/${fleetId}/bids/${bidId}/respond`,
      payload
    );
    return response.data;
  }

  /**
   * Buyer responds to a transporter's counter-offer on a fleet bid
   * POST /api/transporters/fleet/{fleetId}/bids/{bidId}/buyer-respond
   */
  static async respondToFleetBid(
    fleetId: string,
    bidId: string,
    payload: NegotiationRespondPayload
  ): Promise<unknown> {
    const response = await api.post(
      `/api/transporters/fleet/${fleetId}/bids/${bidId}/buyer-respond`,
      payload
    );
    return response.data;
  }

  /**
   * Create a fleet payment (after accepted bid)
   * POST /api/transporters/fleet/payments
   */
  static async createFleetPayment(
    payload: CreateFleetPaymentPayload
  ): Promise<unknown> {
    const response = await api.post(
      `/api/transporters/fleet/payments`,
      payload
    );
    return response.data;
  }

  /**
   * Pay a transporter directly (no prior bid) for specific shipment items.
   * POST /api/transporters/fleet/{fleetId}/payments
   */
  static async createDirectFleetPayment(
    fleetId: string,
    payload: CreateDirectFleetPaymentPayload
  ): Promise<unknown> {
    const response = await api.post(
      `/api/transporters/fleet/${fleetId}/payments`,
      payload
    );
    return response.data;
  }
}
