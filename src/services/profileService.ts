import axios from "axios";
import api from "@/lib/axios";

/** The logged-in user's own payout account — where Tractive pays them out. */
export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBankAccount = (raw: any): BankAccountDetails => ({
  bankName: raw?.bankName ?? raw?.bank ?? "",
  accountNumber: String(raw?.accountNumber ?? raw?.account_number ?? ""),
  accountName: raw?.accountName ?? raw?.account_name ?? "",
});

export const profileService = {
  /**
   * GET /api/profile/bank-account
   * Returns null when the user has not saved payout details yet — that is a
   * normal empty state, not an error, so a 404 resolves rather than throws.
   */
  async getBankAccount(): Promise<BankAccountDetails | null> {
    try {
      const response = await api.get("/api/profile/bank-account");
      const body = response.data;
      const payload = body?.data ?? body;
      const raw = payload?.bankAccount ?? payload;
      if (!raw || typeof raw !== "object") return null;

      const mapped = mapBankAccount(raw);
      return mapped.accountNumber || mapped.bankName ? mapped : null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error("[ProfileService] getBankAccount error:", error);
      throw error;
    }
  },

  /**
   * PATCH /api/profile/bank-account
   */
  async updateBankAccount(
    payload: BankAccountDetails,
  ): Promise<BankAccountDetails> {
    try {
      const response = await api.patch("/api/profile/bank-account", payload);
      const body = response.data;
      const data = body?.data ?? body;
      const raw = data?.bankAccount ?? data;
      const mapped = raw && typeof raw === "object" ? mapBankAccount(raw) : null;
      // Some endpoints answer with just `{ success, message }` — fall back to
      // what we sent so the cache still holds the saved values.
      return mapped?.accountNumber ? mapped : payload;
    } catch (error) {
      console.error("[ProfileService] updateBankAccount error:", error);
      throw error;
    }
  },
};
