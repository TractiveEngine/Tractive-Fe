import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  paymentService,
  type ConfirmPaymentPayload,
} from "@/services/paymentService";

// Query key factory
export const paymentKeys = {
  all: ["payment"] as const,
  bankAccounts: () => [...paymentKeys.all, "bank-accounts"] as const,
};

/**
 * Admin-managed bank accounts buyers pay into (bidding + transport booking).
 * Cached long — the list is effectively static and shared across the two
 * BankAccounts panels.
 */
export const useBankAccounts = () => {
  return useQuery({
    queryKey: paymentKeys.bankAccounts(),
    queryFn: () => paymentService.getBankAccounts(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: { response?: { status?: number } }) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Confirm a manual bank-transfer payment for a given payment reference.
 * POST /api/payments/{paymentRef}/confirm
 */
export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: ({
      paymentRef,
      payload,
    }: {
      paymentRef: string;
      payload: ConfirmPaymentPayload;
    }) => paymentService.confirmPayment(paymentRef, payload),
    onSuccess: () => {
      toast.success("Payment confirmation submitted!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to confirm payment. Please try again.",
      );
    },
  });
};
