import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { getStripe } from "../utils/getStripe";

export const useCompleteOrderMutation = () => {
    const postCompleteOrder = async () => {
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

    return useMutation(postCompleteOrder);
};
