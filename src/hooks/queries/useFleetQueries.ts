import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fleetService, FleetPayload, GetFleetsParams } from "@/services/fleetService";
import { toast } from "sonner";

export const fleetKeys = {
  all: ["fleets"] as const,
  list: (params?: GetFleetsParams) => [...fleetKeys.all, "list", params] as const,
};

export const useAddFleet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FleetPayload) => fleetService.createFleet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      toast.success("Fleet added successfully", { duration: 3000 });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add fleet", { duration: 3000 });
    },
  });
};

export const useGetFleets = (params?: GetFleetsParams) => {
  return useQuery({
    queryKey: fleetKeys.list(params),
    queryFn: () => fleetService.getFleets(params),
  });
};

export const useUpdateFleet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FleetPayload> }) => 
      fleetService.updateFleet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      toast.success("Fleet updated successfully", { duration: 3000 });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update fleet", { duration: 3000 });
    },
  });
};

export const useDeleteFleet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fleetService.deleteFleet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      toast.success("Fleet deleted successfully", { duration: 3000 });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete fleet", { duration: 3000 });
    },
  });
};

export const useUpdateFleetStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      fleetService.updateFleetStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      toast.success("Fleet status updated successfully", { duration: 3000 });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update fleet status", { duration: 3000 });
    },
  });
};
