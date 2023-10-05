import { Router } from "express";
import { asyncHandler } from "./handlers/asyncHandler";
import { authRouter } from "./routers/authRouter";
import { albumRouter } from "./routers/albumRouter";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { uploadRouter } from "./lib/uploadthing";

const api = Router();

api.use("/auth", asyncHandler(authRouter));
api.use("/albums", asyncHandler(albumRouter));

api.use(
    "/uploadthing",
    createUploadthingExpressHandler({
        router: uploadRouter,
        config: {
            callbackUrl: process.env.UPLOADTHING_URL,
            uploadthingId: process.env.UPLOADTHING_APP_ID,
            uploadthingSecret: process.env.UPLOADTHING_SECRET,
        },
    })
);

api.get("/hello", (_req, res) => {
    res.status(200).json({ message: "world" });
});

export { api };
