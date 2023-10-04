import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";

const f = createUploadthing({
    errorFormatter: (err) => {
        return {
            message: err.message,
            zodError:
                err.cause instanceof z.ZodError ? err.cause.flatten() : null,
        };
    },
});

export const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 4,
        },
    })
        .middleware(({ req }) => {
            // console.log(req);
            return {};
        })
        .onUploadComplete((data) => {
            // console.log("upload completed", data);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
