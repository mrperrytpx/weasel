import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile"] })
);

authRouter.get(
    "/callback/google",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        console.log(req.user);
        res.redirect(process.env.WEBSITE_URL);
    }
);

export { authRouter };
