import { Album, Image } from "@prisma/client";

export type TAlbum = Album & {
    images: Image[];
};
