import { prisma } from "@weasel/db";
import { utapi } from "@weasel/filehost";
import { TInfiniteFiles, TStrippedImage } from "@weasel/types";
import { Router } from "express";

const imageRouter = Router();

imageRouter.get("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { cursorId } = req.query;
    if (!cursorId) return res.status(400).end("Provide an image ID!");

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
        include: {
            images: true,
        },
    });

    if (!user) return res.status(401).end("You must be logged in");

    const images = (await prisma.image.findMany({
        where: {
            owner_id: user.id,
        },
        select: {
            album: {
                select: {
                    name: true,
                },
            },
            created_at: true,
            id: true,
            name: true,
            size: true,
            url: true,
        },
        take: 2,
        skip: cursorId === "0" ? 0 : 1,
        cursor: {
            id: cursorId === "0" ? user.images[0]?.id : (cursorId as string),
        },
        orderBy: {
            created_at: "desc",
        },
    })) satisfies TStrippedImage[];

    const data = {
        count: user.images.length,
        files: images,
        nextId: images[images.length - 1].id,
    } satisfies TInfiniteFiles;

    return res.status(200).json(data);
});

imageRouter.delete("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { imageId } = req.query;

    if (!imageId) return res.status(400).end("Provide an image ID!");

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
    });

    if (!user) return res.status(401).end("You must be logged in");

    const imageToDelete = await prisma.image.delete({
        where: {
            id: imageId as string,
            owner_id: user.id,
        },
    });

    if (!imageToDelete) return res.status(404).end("Image doesn't exist!");

    utapi.deleteFiles(imageToDelete.id);

    return res.status(200).end();
});

// public album
imageRouter.get("/:albumId", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { albumId } = req.params;
    const { offset } = req.query;

    if (!albumId) return res.status(400).end("Provide an album ID!");

    const images = await prisma.image.findMany({
        where: {
            album_id: albumId,
        },
        take: 20,
        skip: offset ? +offset : 0,
        orderBy: {
            created_at: "asc",
        },
    });

    return res.status(200).json(images);
});

export { imageRouter };
