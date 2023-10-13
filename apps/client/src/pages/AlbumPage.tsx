import { useNavigate, useParams } from "react-router-dom";
import { useGetAlbumImagesQuery } from "../hooks/useGetAlbumImagesQuery";
import { Image } from "@weasel/types";
import EmptyFolderImage from "../assets/empty-folder.webp";
import { UploadFilesForm } from "../components/UploadFilesForm";
import { z } from "zod";
import { BsTrash } from "react-icons/bs";
import { useDeleteAlbumMutation } from "../hooks/useDeleteAlbumMutation";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useDeleteImageMutation } from "../hooks/useDeleteImageMutation";

type TImageCardProps = {
    image: Image;
};

const ImageCard = ({ image }: TImageCardProps) => {
    const deleteImage = useDeleteImageMutation();

    const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        await deleteImage.mutateAsync({ imageId: image.id, albumId: image.album_id });
    };

    return (
        <div className="relative my-8 flex aspect-square w-full max-w-sm break-inside-avoid flex-col items-start justify-start rounded-lg border-2 border-periwinkle-50 bg-white transition-all duration-75 hover:border-periwinkle-500 dark:border-zinc-950 dark:bg-zinc-900 dark:hover:border-periwinkle-500">
            <a
                href={image.url}
                target="_blank"
                aria-label="Open the image link in a new tab."
                referrerPolicy="no-referrer"
                className="aspect-square w-full self-center "
            >
                <img
                    src={image.url}
                    loading="lazy"
                    alt={`Image you uploaded with the name ${image.name}`}
                    className="aspect-square w-full select-none rounded-t-md object-cover"
                />
            </a>
            <div className="w-full space-y-2 rounded-b-md bg-white p-2 dark:bg-zinc-900 dark:text-periwinkle-50">
                <p className="line-clamp-1 self-center break-all rounded-b-md font-semibold">
                    {image.name}
                </p>
                <p className="line-clamp-1 break-all rounded-b-md pr-1 text-right text-xs font-semibold italic opacity-80">
                    {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                    }).format(new Date(image.created_at))}
                </p>
            </div>
            <button
                aria-label="Delete the album."
                onClick={handleDeleteImage}
                className="group absolute right-2 top-2 rounded-md bg-white p-2 shadow dark:bg-zinc-900"
            >
                <BsTrash
                    size={20}
                    className="fill-black group-hover:fill-red-500 dark:fill-white"
                />
            </button>
        </div>
    );
};

const AlbumPage = () => {
    const params = useParams();
    const navigate = useNavigate();

    const albumId = z.string().parse(params.albumId);
    const album = useGetAlbumImagesQuery(albumId);

    const deleteAlbum = useDeleteAlbumMutation();

    const handleDeleteAlbum = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        await deleteAlbum.mutateAsync({ albumId });
        navigate("/albums");
    };

    return (
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-1 border-b border-periwinkle-300 px-4 py-2 dark:border-zinc-600">
                <span className="peer line-clamp-1 flex-1 break-all text-lg font-bold hover:line-clamp-none">
                    {album.data?.name}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        aria-label="Delete album."
                        onClick={handleDeleteAlbum}
                        className="group p-2"
                    >
                        {deleteAlbum.isLoading ? (
                            <LoadingSpinner size={20} color="rgb(70 102 229)" />
                        ) : (
                            <BsTrash
                                size={20}
                                className="fill-black group-hover:fill-red-500 dark:fill-white dark:group-hover:fill-red-500"
                            />
                        )}
                    </button>
                    <span className="text-lg peer-hover:self-start">
                        {new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "long",
                        }).format(new Date(album.data!.created_at))}
                    </span>
                </div>
            </div>

            {album.data?.images?.length ? (
                <div className="mx-auto mb-8 mt-4 w-full columns-1 gap-4 p-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-8 xl:columns-4">
                    <UploadFilesForm />

                    {album.data?.images.map((image) => <ImageCard image={image} key={image.id} />)}
                </div>
            ) : (
                <div className="mb-8 flex flex-col items-center justify-center gap-1 p-4">
                    <div className="aspect-square w-full max-w-xs">
                        <img
                            src={EmptyFolderImage}
                            alt="Illustration of a male with black hair, glasses, light-green jumper and black pants looking into a big blue folder that is infront of him. The folder is empty and the man has a concerned look on his face. There's a question mark in a speech bubble right of his head."
                        />
                    </div>
                    <span className="mb-4 text-lg font-medium">
                        Looks like this album is empty!
                    </span>
                    <UploadFilesForm />
                </div>
            )}
        </div>
    );
};

export default AlbumPage;
