import { Album, Image, User } from "@weasel/db";

export type TAlbum = Album & {
    images: [Image] | [];
};

export type TNewAlbum = Album & {
    images: [];
};

export type TNewImage = Image & { isUploaded?: boolean };

export type TFullAlbum = Album & {
    images: TNewImage[] | [];
};

export type TUser = Pick<User, "id" | "image">;

export { type User, type Image, type Album };
