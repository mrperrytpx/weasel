import { Router } from "express";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { uploadRouter } from "./lib/uploadthing";
import { asyncHandler } from "./handlers/asyncHandler";
import { authRouter } from "./routers/authRouter";
import { albumRouter } from "./routers/albumRouter";

const api = Router();

api.use("/auth", asyncHandler(authRouter));
api.use("/albums", asyncHandler(albumRouter));

api.use("/hello", (_req, res) => {
    res.status(200).json({ message: "world" });
});

api.use(
    "/uploadthing",
    asyncHandler(
        createUploadthingExpressHandler({
            router: uploadRouter,
        })
    )
);

export { api };
