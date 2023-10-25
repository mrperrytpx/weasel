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
        mode: "subscription",
        customer: user.customerId,
        billing_address_collection: "auto",
        payment_method_types: ["card"],
        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID as string,
                quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.CLIENT_URL,
        metadata: {
            userId: req?.user?.id,
        },
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    res.status(200).json(checkoutSession);
});

stripeRouter.delete("/subscription", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
    });

    if (!user) return res.status(404).end("User not found!");
    if (!user.subscriptionId)
        return res.status(400).end("User isn't subscribed!");

    const subscription = await stripe.subscriptions.update(
        user.subscriptionId,
        {
            cancel_at_period_end: true,
        }
    );

    console.log("subscription", subscription);

    return res.status(200);
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

    switch (event.type) {
        case "customer.subscription.created": {
            const { id, customer } = event.data.object;

            console.log("create sub", id, customer);

            await prisma.user.update({
                where: {
                    customerId: customer as string,
                },
                data: {
                    isSubscriptionActive: true,
                    subscriptionId: id,
                },
            });
            break;
        }

        case "customer.deleted": {
            const { id } = event.data.object;

            const user = await prisma.user.findFirst({
                where: { customerId: id },
            });

            if (user?.subscriptionId) {
                await stripe.subscriptions.cancel(user.subscriptionId);
            }

            break;
        }

        case "customer.subscription.deleted": {
            const { customer } = event.data.object;

            console.log("delete sub", customer);

            const user = await prisma.user.findFirst({
                where: {
                    customerId: customer as string,
                },
            });

            if (!user) {
                console.log("User not found");
                break;
            }

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    isSubscriptionActive: false,
                },
            });
            break;
        }
        default: {
            console.log(`Unhandled event type ${event.type}`);
            break;
        }
    }
});

export { stripeRouter };
