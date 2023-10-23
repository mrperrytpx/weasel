/// <reference types="stripe-event-types" />
import { Router } from "express";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import { prisma } from "@weasel/db";
import { buffer } from "micro";

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
            userId: req?.user?.id,
        },
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    res.status(200).json(checkoutSession);
});

stripeRouter.post("/webhooks", async (req, res) => {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const scrt = process.env.STRIPE_WEBHOOK_KEY;

    let event;

    try {
        if (!sig || !scrt) return res.status(400).end("No");
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            scrt
        ) as Stripe.DiscriminatedEvent;
    } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        console.log(error);
        return res.status(400).end(`"Webhook error:" ${message}`);
    }

    console.log("event", event);

    if (event.type === "checkout.session.completed") {
        const session = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
                expand: ["line_items"],
            }
        );

        if (!session?.line_items) {
            console.log("No line items");
            return res
                .status(500)
                .end("How did you place an order without items???");
        }

        if (!session) res.status(500).end();

        const userId = session.metadata?.userId;

        if (!userId) return res.status(404).end("No user ID provided?!");

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!user) return res.status(404).end("User not found!");

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isPremium: true,
            },
        });
    } else if (event.type === "invoice.sent") {
        console.log("invoice sent", event.data.object.id);
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }
});

export { stripeRouter };
