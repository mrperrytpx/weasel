import express from "express";
import dotenv from "dotenv";
import { api } from "./api";
import helmet from "helmet";
import cors from "cors";
import { defaultErrorHandler } from "./handlers/defaultErrorHandler";
import { errorHandler } from "./handlers/errorHandler";
import { passportSetup } from "./passport";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.WEBSITE_URL, credentials: true }));

app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
        cookie: {
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
        },
    })
);

// passport.serializeUser((user: any, done: any) => {
//     return done(null, user);
// });

// passport.deserializeUser((user: any, done: any) => {
//     return done(null, user);
// });

app.use(passport.initialize());
app.use(passport.session());

passportSetup.run();

app.use("/api", api);

app.use(defaultErrorHandler);
app.use(errorHandler);

export { app };
