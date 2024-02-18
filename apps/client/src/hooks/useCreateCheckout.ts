import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";

export const useCreateCheckout = () => {
    const user = useUser();

    const createCheckout = async () => {
        if (!user?.data) return;

        const checkoutResponse = await apiInstance.post("/api/stripe/checkout_session");

        const checkoutSession = checkoutResponse.data;

        if (checkoutSession.statusCode === 500) {
            console.error(checkoutSession.message);
            return;
        }

        import("../utils/getStripe").then(async ({ getStripe }) => {
            const stripe = await getStripe();
            const { error } = await stripe!.redirectToCheckout({
                sessionId: checkoutSession.id,
            });
            console.warn(error.message);
        });
    };

    return useMutation(createCheckout);
};
