import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TUser } from "@weasel/types";

export const useTogglePremiumMutation = () => {
    const queryClient = useQueryClient();

    const togglePremium = async () => {
        const response = await apiInstance.patch<TUser>("/api/profile");
        return response.data;
    };

    return useMutation(togglePremium, {
        onSuccess: (data) => {
            queryClient.setQueryData<TUser>(["user"], { ...data });
        },
    });
};
