
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// Types
export interface ContentPayload {
    role?: string;
    name?: string;
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    lga?: string; // Local Government Area
    //   villageOrLocalMarket?: string; // Keeping for potential backward compatibility or if mapped
    //   nin?: string;
    //   businessName?: string;
    interests?: readonly string[];
}

export interface SwitchRolePayload {
    activeRole: string;
}

export interface AvailableRolesResponse {
    activeRole: string | null;
    availableRoles: string[];
}

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const { data } = await api.get("/api/profile");
            return data.user || data;
        },
        retry: (failureCount, error: any) => {
            if (error.response?.status === 401 || error.response?.status === 403) return false;
            return failureCount < 2;
        }
    });
};

export const useAvailableRoles = () => {
    return useQuery<AvailableRolesResponse>({
        queryKey: ["availableRoles"],
        queryFn: async () => {
            const { data } = await api.get("/api/profile/switch-role");
            return data;
        },
        retry: 1
    })
}

export const useSwitchRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: SwitchRolePayload) => {
            const { data } = await api.patch("/api/profile/switch-role", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["availableRoles"] });
        }
    })
}

export const useAddAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ContentPayload) => {
            const { data } = await api.post("/api/auth/add-account", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["availableRoles"] });
        }
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ContentPayload) => {
            const { data } = await api.patch("/api/profile", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        }
    })
}
