import { Album, Image, User } from "@weasel/db";

export type TAlbum = Album & {
    images: TNewImage[] | [];
    _count?: {
        images: number;
    };
};

export type TNewAlbum = Album & {
    images: [];
};

export type TNewImage = Image & {
    uploadStatus?: "failed" | "finished" | "uploading";
};

export type TUser = Pick<User, "id" | "image">;

export type TProfileStats = {
    numOfAlbums: number;
    numOfImages: number;
    albumWithMostImages: {
        name: string;
        numOfImages: number;
        id: string;
    } | null;
    largestImage: {
        name: string;
        size: number;
        url: string;
    } | null;
};

export { type User, type Image, type Album };
