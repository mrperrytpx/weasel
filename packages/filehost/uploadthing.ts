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

            if (!user) throw new Error("Unauthorized!");

            const userAlbum = user.albums.find((album) => album.id === albumId);

            if (!userAlbum) throw new Error("Album doesn't exist!");

            return {
                userId: user.id,
                albumId,
            };
        })
        .onUploadComplete(async ({ file, metadata }) => {
            const { key, name, size, url } = file;
            console.log("filekey", key);

            const album = await prisma.album.findFirst({
                where: {
                    id: metadata.albumId,
                    owner_id: metadata.userId,
                },
            });

            if (!album && name) {
                try {
                    await utapi.deleteFiles(key);
                    console.log("album got deleted before image got uploaded.");
                } catch (e) {
                    console.log(e);
                }
                return;
            }

            await prisma.image.create({
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
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
