import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useNavigate } from "react-router-dom";

export const useDeleteUserSubscriptionMutation = () => {
    const navigate = useNavigate();

    const deleteSubscription = async () => {
        const response = await apiInstance.delete("/api/stripe/subscription");

        return response;
    };

    return useMutation(deleteSubscription, {
        onSuccess: () => {
            navigate(0);
        },
    });
};
