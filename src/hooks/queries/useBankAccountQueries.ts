"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  profileService,
  type BankAccountDetails,
} from "@/services/profileService";

export const bankAccountKeys = {
  all: ["profile-bank-account"] as const,
  detail: () => [...bankAccountKeys.all, "detail"] as const,
};

export const useBankAccount = (enabled: boolean = true) => {
  return useQuery({
    queryKey: bankAccountKeys.detail(),
    queryFn: () => profileService.getBankAccount(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      // Auth/permission/absent are terminal — retrying just delays the form.
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 1;
    },
  });
};

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BankAccountDetails) =>
      profileService.updateBankAccount(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(bankAccountKeys.detail(), data);
      queryClient.invalidateQueries({ queryKey: bankAccountKeys.all });
      toast.success("Bank account saved");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Could not save your bank account details"),
        { duration: 4000, position: "top-center" },
      );
    },
  });
};
