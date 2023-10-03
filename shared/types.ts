import { Album, Image } from "@prisma/client";

export type TAllAlbums = Pick<
    Album,
    "id" | "description" | "name" | "owner_id"
> & {
    images: [Pick<Image, "address">];
};

export type TAlbum = Album & Image[];
