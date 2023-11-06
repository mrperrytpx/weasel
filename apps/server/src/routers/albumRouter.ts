import { prisma } from "@weasel/db";
import { utapi } from "@weasel/filehost";
import { albumNameSchema } from "@weasel/schemas";
import { TAlbum, TInfiniteAlbums } from "@weasel/types";
import { Router } from "express";

const albumRouter = Router();

albumRouter.get("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { cursorId } = req.query;

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
        include: {
            albums: {
                orderBy: {
                    last_accessed_at: "desc",
                },
            },
        },
    });

    if (!user) return res.status(401).end("No user!");

    if (!user.albums.length) {
        return res.status(200).json({
            albums: [],
            count: 0,
        });
    }

    const data = await prisma.user.findFirst({
        where: {
            id: user.id,
        },
        include: {
            albums: {
                include: {
                    images: {
                        take: 1,
                        orderBy: {
                            created_at: "desc",
                        },
                    },
                    _count: true,
                },
                take: 2,
                skip: cursorId === "0" ? 0 : 1,
                cursor: {
                    id:
                        cursorId === "0"
                            ? user.albums[0].id
                            : (cursorId as string),
                },
                orderBy: {
                    last_accessed_at: "desc",
                },
            },
        },
    });

    const albums = {
        albums: data!.albums,
        count: user.albums.length,
    } satisfies TInfiniteAlbums;

    res.status(200).json(albums);
});

albumRouter.post("/", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const result = albumNameSchema.safeParse(req.body);

    if (result.success === false) {
        let zodErrors = {};

        result.error.issues.forEach((iss) => {
            zodErrors = { ...zodErrors, [iss.path[0]]: iss.message };
        });

        return res.status(400).json({ errors: zodErrors });
    }

    const { data } = result;

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
    });

    if (!user) return res.status(401).end("You must be logged in");

    const newAlbum = await prisma.album.create({
        data: {
            name: data.name,
            owner: {
                connect: {
                    id: req.user.id,
                },
            },
        },
        include: {
            images: true,
        },
    });

    res.status(200).json(newAlbum);
});

albumRouter.get("/:albumId", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { albumId } = req.params;

    if (!albumId) return res.status(400).end("Provide an album ID!");

    const album = (await prisma.album.findFirst({
        where: {
            id: albumId,
            owner_id: req.user.id,
        },
        include: {
            images: {
                orderBy: {
                    created_at: "desc",
                },
                take: 0,
            },
            _count: true,
        },
    })) satisfies TAlbum | null;

    if (!album) return res.status(404).end("Album doesn't exist!");

    const date = new Date();

    await prisma.album.update({
        where: {
            id: album.id,
        },
        data: {
            last_accessed_at: date,
        },
    });

    return res
        .status(200)
        .json({ ...album, last_accessed_at: date } satisfies TAlbum);
});

albumRouter.patch("/:albumId", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { albumId } = req.params;

    if (!albumId) return res.status(400).end("Provide an album ID!");

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
        include: {
            albums: {
                where: {
                    id: albumId,
                },
            },
        },
    });

    if (!user?.isSubscriptionActive)
        return res
            .status(403)
            .end("You must be subscribed to make albums public!");

    if (!user.albums[0]) return res.status(404).end("Album doesn't exist!");

    await prisma.album.update({
        where: {
            id: albumId,
        },
        data: {
            isPublic: !user.albums[0].isPublic,
        },
    });

    return res.status(200).end();
});

albumRouter.delete("/:albumId", async (req, res) => {
    if (!req.user?.id) return res.status(401).end("You must be logged in!");

    const { albumId } = req.params;

    if (!albumId) return res.status(400).end("Provide an album ID!");

    const albumToDelete = await prisma.album.delete({
        where: {
            id: albumId,
            owner_id: req.user.id,
        },
        include: {
            images: true,
        },
    });

    if (!albumToDelete) return res.status(404).end("Album doesn't exist!");

    if (albumToDelete.images.length) {
        utapi.deleteFiles(albumToDelete.images.map((image) => image.id));
    }

    return res.status(200).end();
});

albumRouter.get("/public/:albumId", async (req, res) => {
    const { albumId } = req.params;

    if (!albumId) return res.status(400).end("Provide an album ID!");

    const { offset } = req.query;

    if (!offset) return res.status(400).end("I don't know where to start :(");

    const album = await prisma.album.findFirst({
        where: {
            id: albumId,
            isPublic: true,
        },
        include: {
            images: {
                take: 2,
                skip: offset ? +offset : 0,
            },
            _count: true,
        },
    });

    return res.status(200).json(album);
});

export { albumRouter };
