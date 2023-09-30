import express from "express";
import dotenv from "dotenv";
import { api } from "./api";
import helmet from "helmet";
import cors from "cors";
import { defaultErrorHandler } from "./handlers/defaultErrorHandler";
import { errorHandler } from "./handlers/errorHandler";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.WEBSITE_URL, credentials: true }));

app.use("/api", api);

app.use(defaultErrorHandler);
app.use(errorHandler);

export { app };
