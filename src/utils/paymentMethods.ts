/** Map frontend payment method IDs to backend API values */
export const paymentMethodMap: Record<string, string> = {
  card: "card",
  deposit: "deposit",
  transfer: "bank_transfer",
  cheque: "cheque",
};
