import { Router } from "express";
import { asyncHandler } from "./handlers/asyncHandler";
import { authRouter } from "./routers/authRouter";
import { albumRouter } from "./routers/albumRouter";

const api = Router();

api.use("/auth", asyncHandler(authRouter));
api.use("/albums", asyncHandler(albumRouter));

api.get("/hello", (_req, res) => {
    res.status(200).json({ message: "world" });
});

export { api };
