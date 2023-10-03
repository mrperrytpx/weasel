import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";

export const useDeleteUserMutation = () => {
    const deleteUser = async () => {
        const data = await apiInstance.delete("/api/auth/profile");
        return data;
    };

    return useMutation(deleteUser);
};
