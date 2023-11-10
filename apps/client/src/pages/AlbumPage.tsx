import { useLocation, useParams } from "react-router-dom";
import { useGetAlbumImagesInfQuery } from "../hooks/useGetAlbumImagesInfQuery";
import EmptyFolderImage from "../assets/empty-folder.webp";
import { UploadFilesForm } from "../components/UploadFilesForm";
import { z } from "zod";
import { BsTrash } from "react-icons/bs";
import { useDeleteAlbumMutation } from "../hooks/useDeleteAlbumMutation";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ImageCard } from "../components/ImageCard";
import { Fragment, useEffect, useRef } from "react";
import { useGetAlbumQuery } from "../hooks/useGetAlbumQuery";
import { TogglePublicityButton } from "../components/TogglePublicityButton";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { randomString } from "../utils/randomString";

const AlbumPage = () => {
    const endRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(endRef, {});

    const params = useParams();
    const location = useLocation();

    const albumId = z.string().parse(params.albumId);
    const album = useGetAlbumQuery(albumId);
    const albumInfiniteImages = useGetAlbumImagesInfQuery(albumId);
    const deleteAlbum = useDeleteAlbumMutation();

    useEffect(() => {
        if (entry?.isIntersecting) {
            albumInfiniteImages.fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry?.isIntersecting]);

    const handleDeleteAlbum = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        await deleteAlbum.mutateAsync({ albumId });
    };

    if (album.isLoading)
        return (
            <div className="mx-auto mt-20 space-y-4 p-4">
                <LoadingSpinner size={60} />
                <p className="text-lg font-medium text-periwinkle-900 dark:text-white">
                    Loading album...
                </p>
            </div>
        );

    return (
        <main className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-col">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-periwinkle-300 px-4 py-2 dark:border-zinc-600">
                <span className="peer line-clamp-1 flex-1 break-all text-lg font-bold hover:line-clamp-none">
                    {album.data?.name}
                </span>
                <div className="flex items-center gap-2 peer-hover:self-start">
                    {location.pathname !== "/albums" && <TogglePublicityButton />}
                    <button
                        aria-label="Delete album."
                        onClick={handleDeleteAlbum}
                        className="group p-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {deleteAlbum.isLoading ? (
                            <LoadingSpinner size={20} color="#637ff1" />
                        ) : (
                            <BsTrash
                                size={20}
                                className="fill-black group-hover:fill-red-500 dark:fill-white dark:group-hover:fill-red-500"
                            />
                        )}
                    </button>
                    <span className="text-sm peer-hover:self-start">
                        {new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "long",
                        }).format(new Date(album.data!.created_at!))}
                    </span>
                </div>
            </header>

            {albumInfiniteImages.isLoading ? (
                <div className="mx-auto mt-20 space-y-4 p-4">
                    <LoadingSpinner size={60} />
                    <p className="text-lg font-medium text-periwinkle-900 dark:text-white">
                        Loading images...
                    </p>
                </div>
            ) : albumInfiniteImages.data?.pages.reduce(
                  (acc, curr) => acc + curr.images.length,
                  0,
              ) ? (
                <div className="mx-auto mb-8 mt-4 w-full items-center gap-4 p-4 sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8 xl:columns-4">
                    <UploadFilesForm />
                    {albumInfiniteImages.data?.pages.map((page) => (
                        <Fragment key={randomString(6)}>
                            {page.images.map((image) => (
                                <ImageCard image={image} key={image.id} />
                            ))}
                        </Fragment>
                    ))}
                </div>
            ) : (
                <div className="mb-8 flex flex-col items-center justify-center gap-1 p-4">
                    <div className="aspect-square w-full max-w-xs">
                        <img
                            src={EmptyFolderImage}
                            className="select-none"
                            alt="Illustration of a man with black hair, glasses, light-green jumper and black pants looking into a big blue folder that is infront of him. The folder is empty and the man has a concerned look on his face. There's a question mark in a speech bubble right of his head."
                        />
                    </div>
                    <span className="mb-4 text-lg font-medium">
                        Looks like this album is empty!
                    </span>
                    <UploadFilesForm />
                </div>
            )}

            {}
            <div className="mb-4 px-4 py-2 text-center text-sm font-bold" ref={endRef}>
                {albumInfiniteImages.hasNextPage
                    ? albumInfiniteImages.isFetchingNextPage
                        ? "Loading more images..."
                        : "Load more images"
                    : null}
            </div>
        </main>
    );
};

export default AlbumPage;
