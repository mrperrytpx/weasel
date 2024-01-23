import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";
import { prisma } from "@weasel/db";
import { uploadInputSchema } from "@weasel/schemas";
import { UTApi } from "uploadthing/server";

const FREE_TIER_STORAGE = 262_144_000; // 250MB
const PREMIUM__TIER_STORAGE = 53_687_091_200; // 50GB

export const utapi = new UTApi();

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

            console.log("fileSize in middleware", fileSize);

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

            if (!user.isSubscriptionActive) {
                if (totalUserStorage + fileSize > FREE_TIER_STORAGE) {
                    throw new Error(
                        "Storage limit reached! Upgrade to premium for more storage!"
                    );
                }
            }

            if (user.isSubscriptionActive) {
                if (totalUserStorage + fileSize > PREMIUM__TIER_STORAGE) {
                    throw new Error("Storage limit reached! o_o");
                }
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

            console.log("file in onUploadComplete", file);

            if (size !== metadata.fileSize) {
                utapi.deleteFiles(name);
                return;
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
