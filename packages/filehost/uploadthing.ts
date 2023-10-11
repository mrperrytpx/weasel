import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";
import { prisma } from "@weasel/db";
import { uploadInputSchema } from "@weasel/schemas";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

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
        .input(uploadInputSchema)
        .middleware(async ({ input }) => {
            const { albumId, userId } = input;

            const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                },
                include: {
                    albums: true,
                },
            });

            if (!user) throw new Error("Unauthorized");

            const userAlbum = user.albums.find((album) => album.id === albumId);

            if (!userAlbum) throw new Error("Album exists!");

            return {
                userId: user.id,
                albumId,
            };
        })
        .onUploadComplete(async ({ file, metadata }) => {
            const { key, name, size, url } = file;

            const newImage = await prisma.image.create({
                data: {
                    id: key,
                    name,
                    size,
                    url,
                    owner: {
                        connect: {
                            id: metadata.userId,
                        },
                    },
                    album: {
                        connect: {
                            id: metadata.albumId,
                        },
                    },
                },
            });

            console.log(newImage);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
