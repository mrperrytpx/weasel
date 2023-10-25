import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { getStripe } from "../utils/getStripe";
import { useUser } from "./useUser";
import { useNavigate } from "react-router-dom";

export const useCreateCheckout = () => {
    const user = useUser();
    const navigate = useNavigate();

    if (!user?.data) {
        navigate("/sign-in");
    }

    const createCheckout = async () => {
        const checkoutResponse = await apiInstance.post("/api/stripe/checkout_session");

        const checkoutSession = checkoutResponse.data;

        if (checkoutSession.statusCode === 500) {
            console.error(checkoutSession.message);
            return;
        }

        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
            sessionId: checkoutSession.id,
        });
        console.warn(error.message);
    };

    return useMutation(createCheckout);
};
