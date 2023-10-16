import { useNavigate, useParams } from "react-router-dom";
import { useGetAlbumImagesQuery } from "../hooks/useGetAlbumImagesQuery";
import EmptyFolderImage from "../assets/empty-folder.webp";
import { UploadFilesForm } from "../components/UploadFilesForm";
import { z } from "zod";
import { BsTrash } from "react-icons/bs";
import { useDeleteAlbumMutation } from "../hooks/useDeleteAlbumMutation";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ImageCard } from "../components/ImageCard";

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
        <div className="max-w-responsive-screen-2xl mx-auto flex w-full flex-1 flex-col">
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
