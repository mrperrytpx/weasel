import { Router } from "express";
import passport from "passport";
import { TUser } from "../passport/googleStrategy";
import { prisma } from "../lib/prisma";

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
        res.redirect(process.env.WEBSITE_URL);
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
    const reqUser = req.user as TUser;

    if (!reqUser.id) return res.status(403).end("Forbidden");

    await prisma.user.delete({
        where: {
            id: reqUser.id,
        },
    });

    res.status(200).end();
});

export { authRouter };
