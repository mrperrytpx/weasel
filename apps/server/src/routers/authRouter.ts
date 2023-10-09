import { prisma } from "@weasel/db";
import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
    "/callback/google",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: true,
    }),
    function (_req, res) {
        res.redirect(process.env.WEBSITE_URL as string);
    }
);

authRouter.get("/user", (req, res) => {
    res.send(req.user);
});

authRouter.post("/logout", (req, res, next) => {
    if (req.user) {
        req.logout((err) => {
            if (err) return next(err);
        });
        res.sendStatus(200);
    }
});

authRouter.delete("/profile", async (req, res) => {
    if (!req.user?.id) return res.status(403).end("Forbidden");

    await prisma.user.delete({
        where: {
            id: req.user.id,
        },
    });

    res.status(200).end();
});

export { authRouter };
