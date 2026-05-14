import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService, CreateTransactionPayload } from "@/services/transactionService";
import { toast } from "sonner";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionService.createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wonBidsCheckout"] });
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to create transaction. Please try again.",
        { duration: 4000, position: "top-center" },
      );
    },
  });
};
