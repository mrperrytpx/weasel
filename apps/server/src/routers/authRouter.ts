import { prisma } from "@weasel/db";
import { Router } from "express";
import passport from "passport";
import { utapi } from "@weasel/filehost";
import { stripe } from "../lib/stripe";

const authRouter = Router();

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
    "/callback/google",
    passport.authenticate("google", {
        failureRedirect: "/sign-in",
        session: true,
    }),
    function (_req, res) {
        res.redirect(process.env.WEBSITE_URL as string);
    }
);

authRouter.get("/user", (req, res) => {
    res.send(req.user);
});

authRouter.delete("/user", async (req, res) => {
    if (!req.user?.id) return res.status(403).end("Forbidden");

    const deletedUser = await prisma.user.delete({
        where: {
            id: req.user.id,
        },
        include: {
            images: true,
        },
    });

    if (deletedUser.images.length) {
        utapi.deleteFiles(deletedUser.images.map((image) => image.id));
    }

    if (deletedUser.subscriptionId) {
        stripe.subscriptions.cancel(deletedUser.subscriptionId);
    }

    stripe.customers.del(deletedUser.customerId);

    res.status(200).end();
});

authRouter.post("/logout", (req, res, next) => {
    if (req.user) {
        req.logout((err) => {
            if (err) return next(err);
        });
        res.sendStatus(200);
    }
});

export { authRouter };
