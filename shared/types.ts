import { Album, Image } from "@prisma/client";

export type TAlbum = Pick<Album, "id" | "description" | "name" | "owner_id"> & {
    images: [Pick<Image, "address">];
};
