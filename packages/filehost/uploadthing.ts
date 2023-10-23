import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";
import { prisma } from "@weasel/db";
import { uploadInputSchema } from "@weasel/schemas";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

const STORAGE_PER_USER = 262144000;

const f = createUploadthing({
    errorFormatter: (err) => {
        return {
            message: err.message,
            file: err.data?.message,
            zodError:
                err.cause instanceof z.ZodError ? err.cause.flatten() : null,
        };
    },
});

export const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 10,
        },
    })
        .input(uploadInputSchema)
        .middleware(async ({ input }) => {
            const { albumId, userId, fileSize } = input;

            const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                },
                include: {
                    albums: true,
                    images: true,
                },
            });

            if (!user) throw new Error("Unauthorized!");

            const totalUserStorage = user.images.reduce(
                (prev, curr) => curr.size + prev,
                0
            );

            if (
                !user.isPremium &&
                totalUserStorage + fileSize > STORAGE_PER_USER
            ) {
                throw new Error(
                    "Storage limit reached! Upgrade to premium for more storage!"
                );
            }

            const userAlbum = user.albums.find((album) => album.id === albumId);

            if (!userAlbum) throw new Error("Album doesn't exist!");

            return {
                userId: user.id,
                albumId,
                fileSize: input.fileSize,
            };
        })
        .onUploadComplete(async ({ file, metadata }) => {
            const { key, name, size, url } = file;

            if (size !== metadata.fileSize) {
                utapi.deleteFiles(name);
            }

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
