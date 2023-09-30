import { Router } from "express";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { uploadRouter } from "./lib/uploadthing";
import { asyncHandler } from "./handlers/asyncHandler";

const api = Router();

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
