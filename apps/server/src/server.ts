import express from "express";
import dotenv from "dotenv";
import { api } from "./api";
import helmet from "helmet";
import cors from "cors";
import { defaultErrorHandler } from "./handlers/defaultErrorHandler";
import { errorHandler } from "./handlers/errorHandler";
import { passportStrategies } from "./passport";
import session from "express-session";
import passport from "passport";
import { asyncHandler } from "./handlers/asyncHandler";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use((req, res, next) => {
    const uploadHook = req.header("uploadthing-hook");
    const stripe = req.headers["stripe-signature"];
    if (uploadHook === "callback" || stripe) {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(
    session({
        secret: process.env.COOKIE_SECRET as string,
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            signed: true,
            maxAge: 60 * 60 * 24 * 7 * 1000,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passportStrategies.run();

app.use("/api", asyncHandler(api));

app.use(defaultErrorHandler);
app.use(errorHandler);

process.on("uncaughtException", function (err) {
    console.log(err);
});

export { app };
