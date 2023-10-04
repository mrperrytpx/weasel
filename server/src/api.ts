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
    asyncHandler(
        createUploadthingExpressHandler({
            router: uploadRouter,
        })
    )
);

api.get("/hello", (_req, res) => {
    res.status(200).json({ message: "world" });
});

export { api };
