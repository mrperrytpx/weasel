import { Router } from "express";
import { albumNameSchema } from "../../../shared/createAlbumSchema";
import { prisma } from "../lib/prisma";
import { TUser } from "../passport/googleStrategy";

const albumRouter = Router();

albumRouter.get("/", async (req, res) => {
    const reqUser = req.user as TUser;

    if (!reqUser.id) return res.status(401).end("You must be logged in!");

    const user = await prisma.user.findFirst({
        where: {
            id: reqUser.id,
        },
        include: {
            albums: {
                include: {
                    images: {
                        take: 1,
                    },
                },
            },
        },
    });

    if (!user) return res.status(401).end("No user!");

    res.status(200).json(user.albums);
});

albumRouter.post("/", async (req, res) => {
    const reqUser = req.user as TUser;

    if (!reqUser.id) return res.status(401).end("You must be logged in!");

    const result = albumNameSchema.safeParse(req.body);

    if (result.success === false) {
        let zodErrors = {};

        result.error.issues.forEach((iss) => {
            zodErrors = { ...zodErrors, [iss.path[0]]: iss.message };
        });

        return res.status(400).json({ errors: zodErrors });
    }

    const { data } = result;

    console.log("data", data);

    const user = await prisma.user.findFirst({
        where: {
            id: reqUser.id,
        },
    });

    if (!user) return res.status(401).end("You must be logged in");

    const newAlbum = await prisma.album.create({
        data: {
            description: data.description,
            name: data.name,
            owner: {
                connect: {
                    id: reqUser.id,
                },
            },
        },
    });

    res.status(200).json(newAlbum);
});

export { albumRouter };
