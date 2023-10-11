import { Album, Image, User } from "@weasel/db";

export type TAlbum = Album & {
    images: [Image] | [];
};

export type TNewAlbum = Album & {
    images: [];
};

export type TFullAlbum = Album & {
    images: Image[] | [];
};

export type TUser = Pick<User, "id" | "image">;

export { type User, type Image, type Album };
