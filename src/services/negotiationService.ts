import api from "@/lib/axios";

export interface NegotiationRespondPayload {
  action: "accept" | "reject";
  amount?: number; // Depending on requirements if amount is always needed, but swagger shows it
}

export class NegotiationService {
  /**
   * List transporter negotiations
   * GET /api/transporters/negotiations
   */
  static async getNegotiations<T>(): Promise<T> {
    const response = await api.get("/api/transporters/negotiations");
    return response.data.data; // Assuming standardized response `{ data: [...] }`
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
}
