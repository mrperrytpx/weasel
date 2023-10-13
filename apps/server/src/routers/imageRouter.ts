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

export { imageRouter };
