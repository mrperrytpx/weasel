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
    function (req, res) {
        res.redirect(process.env.WEBSITE_URL);
    }
);

authRouter.get("/user", (req, res) => {
    res.send(req.user);
});

export { authRouter };
