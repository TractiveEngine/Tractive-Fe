// services/paymentService.ts

import api from "@/lib/axios";

export interface BankAccount {
  id: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  logoUrl?: string;
  sortOrder?: number;
}

export interface ConfirmPaymentPayload {
  bankUsed: string;
  narration?: string;
  screenshotUrl?: string;
}

/**
 * Normalise one bank-account record. Tolerates the documented shape
 * (`bank`, `accountName`, `accountNumber`, `logoUrl`, `sortOrder`) as well as
 * common backend variants (`bankName`, `name`, `number`, `logo`, `image`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBankAccount = (raw: any): BankAccount => {
  const accountNumber =
    raw?.accountNumber ?? raw?.number ?? raw?.acctNo ?? raw?.account_no ?? "";
  return {
    id: String(raw?.id ?? raw?._id ?? accountNumber),
    bank: raw?.bank ?? raw?.bankName ?? raw?.name ?? "",
    accountName:
      raw?.accountName ?? raw?.acctName ?? raw?.owner ?? raw?.account_name ?? "",
    accountNumber: String(accountNumber),
    logoUrl: raw?.logoUrl ?? raw?.logo ?? raw?.image ?? undefined,
    sortOrder: raw?.sortOrder ?? raw?.order ?? undefined,
  };
};

/**
 * Payment / bank-account reference data (Buyer bidding + transport booking).
 *
 * Uses the shared `@/lib/axios` instance (injects the auth token, handles 401).
 * The response envelope is unwrapped defensively so `{ data: [...] }`,
 * `{ accounts: [...] }`, or a bare array all work.
 */
export const paymentService = {
  /**
   * GET /api/payment/bank-accounts
   * Expected: [{ id, bank, accountName, accountNumber, logoUrl, sortOrder }]
   */
  getBankAccounts: async (): Promise<BankAccount[]> => {
    try {
      const response = await api.get("/api/payment/bank-accounts");
      const body = response.data;
      const payload = body?.data ?? body;
      const list = Array.isArray(payload)
        ? payload
        : payload?.accounts ?? payload?.bankAccounts ?? payload?.items ?? [];

      const mapped = (Array.isArray(list) ? list : []).map(mapBankAccount);
      // Honour sortOrder when the backend provides it.
      return mapped.sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      );
    } catch (error) {
      console.error("[PaymentService] getBankAccounts error:", error);
      throw error;
    }
  },

  /**
   * Confirm a manual bank-transfer payment.
   * POST /api/payments/{paymentRef}/confirm
   * Body: { bankUsed, narration?, screenshotUrl? }
   */
  confirmPayment: async (
    paymentRef: string,
    payload: ConfirmPaymentPayload,
  ): Promise<unknown> => {
    try {
      const response = await api.post(
        `/api/payments/${paymentRef}/confirm`,
        payload,
      );
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("[PaymentService] confirmPayment error:", error);
      throw error;
    }
  },
};
