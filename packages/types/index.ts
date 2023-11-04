import { Album, Image, User } from "@weasel/db";
import { OurFileRouter } from "@weasel/filehost";

export type TInfiniteAlbums = {
    albums: TAlbum[];
    count: number;
};

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

export type TStrippedImage = Omit<Image, "album_id" | "owner_id"> & {
    album: {
        name: string;
    };
};

export type TInfiniteFiles = {
    files: TStrippedImage[];
    count: number;
    nextId: string;
};

export type TUser = Pick<User, "id" | "image" | "isSubscriptionActive">;

// ---------------------------------
type TAlbumWithMostImages = {
    name: string;
    numOfImages: number;
    id: string;
};

type TLargestImage = {
    name: string;
    size: number;
    url: string;
};

export type TProfileStats = {
    numOfAlbums: number;
    numOfImages: number;
    albumWithMostImages: TAlbumWithMostImages | null;
    largestImage: TLargestImage | null;
    storageUsed: number;
    subscriptionDueDate: number | null;
};

export { type User, type Image, type Album, type OurFileRouter };
