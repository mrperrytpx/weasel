import { prisma } from "@weasel/db";
import { TProfileStats } from "@weasel/types";
import { Router } from "express";
import { stripe } from "../lib/stripe";

const profileRouter = Router();

profileRouter.get("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const user = await prisma.user.findFirst({
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
            subscriptionId: true,
        },
    });

    if (!user) return res.status(404).end("User not found!");

    // stinky code :(
    const subscriptionDueDate = await (async () => {
        if (user.subscriptionId) {
            try {
                const subscription = await stripe.subscriptions.retrieve(
                    user.subscriptionId
                );

                return subscription.current_period_end;
            } catch (e) {
                return undefined;
            }
        }
    })();

    const albumWithMostImages = (() => {
        let mostImages = 0;
        let id = "";
        user.albums.forEach((album) => {
            if (album.images.length > mostImages) {
                mostImages = album.images.length;
                id = album.id;
            }
        });

        const album = user.albums.find((album) => album.id === id);

        if (!album) return;

        return album;
    })();

    const largestImage = (() => {
        let largestSize = 0;
        let id = "";
        user.images.forEach((image) => {
            if (image.size > largestSize) {
                largestSize = image.size;
                id = image.id;
            }
        });
        const image = user.images.find((image) => image.id === id);

        if (!image) return;

        return image;
    })();

    // 😥😪😭😭😢😢
    const profileStats = {
        numOfAlbums: user.albums.length,
        numOfImages: user.images.length,
        storageUsed: user.images.reduce((prev, curr) => curr.size + prev, 0),
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
        subscriptionDueDate: subscriptionDueDate ? subscriptionDueDate : null,
    } satisfies TProfileStats;

    return res.status(200).json(profileStats);
});

export { profileRouter };
