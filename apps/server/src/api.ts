import { Router } from "express";
import { createUploadthingExpressHandler } from "uploadthing/express";
import {
    albumRouter,
    authRouter,
    imageRouter,
    profileRouter,
    stripeRouter,
} from "./routers";
import { uploadRouter } from "./lib/uploadthing";

const api = Router();

api.use("/auth", authRouter);
api.use("/albums", albumRouter);
api.use("/images", imageRouter);
api.use("/profile", profileRouter);
api.use("/stripe", stripeRouter);

api.use(
    "/uploadthing",
    createUploadthingExpressHandler({
        router: uploadRouter,
        config: {
            callbackUrl: process.env.UPLOADTHING_URL as string,
            uploadthingId: process.env.UPLOADTHING_APP_ID as string,
            uploadthingSecret: process.env.UPLOADTHING_SECRET as string,
        },
    })
);

api.get("/hello", (_req, res) => {
    res.status(200).json({ message: "world" });
});

export { api };
