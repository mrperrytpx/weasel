import { Album, Image, User } from "@weasel/db";

export type TAlbum = Album & {
    images: [Pick<Image, "url"> | null];
};

export type TFullAlbum = Album & {
    images: Image[];
};

export type TBaseAlbum = Album;

export type TUser = Pick<User, "id" | "image">;
