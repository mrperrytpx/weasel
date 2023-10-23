import { prisma } from "@weasel/db";
import { TProfileStats } from "@weasel/types";
import { Router } from "express";

const profileRouter = Router();

profileRouter.get("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const data = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
        select: {
            _count: true,
            albums: {
                include: {
                    images: true,
                },
            },
            images: true,
        },
    });

    if (!data) return res.status(404).end("User not found!");

    const albumWithMostImages = (() => {
        let mostImages = 0;
        let id = "";
        data.albums.forEach((album) => {
            if (album.images.length > mostImages) {
                mostImages = album.images.length;
                id = album.id;
            }
        });

        const album = data.albums.find((album) => album.id === id);

        if (!album) return;

        return album;
    })();

    const largestImage = (() => {
        let largestSize = 0;
        let id = "";
        data.images.forEach((image) => {
            if (image.size > largestSize) {
                largestSize = image.size;
                id = image.id;
            }
        });
        const image = data.images.find((image) => image.id === id);

        if (!image) return;

        return image;
    })();

    const profileStats = {
        numOfAlbums: data.albums.length,
        numOfImages: data.images.length,
        storage: data.images.reduce((prev, curr) => curr.size + prev, 0),
        albumWithMostImages: albumWithMostImages
            ? {
                  name: albumWithMostImages.name,
                  numOfImages: albumWithMostImages.images.length,
                  id: albumWithMostImages.id,
              }
            : null,
        largestImage: largestImage
            ? {
                  name: largestImage.name,
                  size: largestImage.size,
                  url: largestImage.url,
              }
            : null,
    } satisfies TProfileStats;

    return res.status(200).json(profileStats);
});

profileRouter.patch("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const user = await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: {
            isPremium: !req.user.isPremium,
        },
        select: { id: true, image: true, isPremium: true },
    });

    return res.status(200).json(user);
});

export { profileRouter };
