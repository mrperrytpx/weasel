import { Router } from "express";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import { prisma } from "@weasel/db";

const stripeRouter = Router();

stripeRouter.post("/checkout_session", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
    });

    if (!user) return res.status(404).end("User not found!");

    const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        mode: "payment",
        billing_address_collection: "auto",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    unit_amount: 1000,
                    product_data: {
                        name: "Weasel Albums Premium Membership",
                        description:
                            "Upgrading your Weasel Albums plan to Premium",
                    },
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.CLIENT_URL,
        invoice_creation: {
            enabled: true,
        },
        metadata: {
            user: req?.user?.id,
        },
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    res.status(200).json(checkoutSession);
});

export { stripeRouter };
