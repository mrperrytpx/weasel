import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useNavigate } from "react-router-dom";

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteUser = async () => {
        const data = await apiInstance.delete("/api/auth/profile");
        return data;
    };

    return useMutation(deleteUser, {
        onSuccess: () => {
            queryClient.removeQueries(["user"]);
            navigate(0);
        },
    });
};
