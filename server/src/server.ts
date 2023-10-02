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

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.WEBSITE_URL, credentials: true }));

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passportStrategies.run();

app.use("/api", api);

app.use(defaultErrorHandler);
app.use(errorHandler);

export { app };
