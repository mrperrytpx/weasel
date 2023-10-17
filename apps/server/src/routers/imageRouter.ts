import { prisma } from "@weasel/db";
import { utapi } from "@weasel/filehost";
import { Router } from "express";

const imageRouter = Router();

imageRouter.delete("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { imageId } = req.query;

    if (!imageId) return res.status(400).end("Provide an image ID!");

    const imageToDelete = await prisma.image.delete({
        where: {
            id: imageId as string,
            owner_id: req.user.id,
        },
    });

    if (!imageToDelete) return res.status(404).end("Image doesn't exist!");

    utapi.deleteFiles(imageToDelete.id);

    return res.status(200).end();
});

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
