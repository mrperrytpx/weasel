import { useParams } from "react-router-dom";
import { useGetAlbumImagesQuery } from "../hooks/useGetAlbumImagesQuery";
import { Image } from "@weasel/types";
import EmptyFolderImage from "../assets/empty-folder.webp";
import { UploadFilesForm } from "../components/UploadFilesForm";
import { z } from "zod";

type TAlbumImageProps = {
    image: Image;
};

const AlbumImage = ({ image }: TAlbumImageProps) => {
    return (
        <div className="my-8 flex aspect-square w-full max-w-sm break-inside-avoid flex-col items-start justify-start">
            <a
                href={image.url}
                target="_blank"
                referrerPolicy="no-referrer"
                className="h-full w-full self-center border-2 border-periwinkle-50 bg-white hover:border-periwinkle-500 dark:border-zinc-950 dark:bg-zinc-900 dark:hover:border-white"
            >
                <img
                    src={image.url}
                    loading="lazy"
                    alt="image"
                    className="h-full w-full select-none object-cover"
                />
            </a>
            <span className="line-clamp-1 self-center break-all pl-0.5 font-semibold text-black hover:line-clamp-none dark:text-periwinkle-50">
                {image.name}
            </span>
        </div>
    );
};

const AlbumPage = () => {
    const params = useParams();

    const albumId = z.string().parse(params.albumId);
    const album = useGetAlbumImagesQuery(albumId);

    return (
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col">
            <div className="flex flex-wrap items-center justify-between border-b border-periwinkle-300 px-4 py-2 dark:border-zinc-600">
                <span className="text-xl font-bold">{album.data?.name}</span>
                <span>
                    {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                    }).format(new Date(album.data!.created_at))}
                </span>
            </div>

            {album.data?.images?.length ? (
                <div className="mb-8 columns-1 gap-4 p-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-8 xl:columns-4">
                    <UploadFilesForm />

                    {album.data?.images.map((image) => <AlbumImage image={image} key={image.id} />)}
                </div>
            ) : (
                <div className="mb-8 flex flex-col items-center justify-center gap-1 p-4">
                    <div className="w-full max-w-md">
                        <img
                            src={EmptyFolderImage}
                            alt="Illustration of a male with black hair, glasses, light-green jumper and black pants looking into a big blue folder that is infront of him. The folder is empty and the man has a concerned look on his face. There's a question mark in a speech bubble right of his head."
                        />
                    </div>
                    <span className="text-lg font-medium">Looks like this album is empty!</span>
                    <UploadFilesForm />
                </div>
            )}
        </div>
    );
};

export default AlbumPage;
