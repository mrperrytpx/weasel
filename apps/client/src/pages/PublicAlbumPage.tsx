import { useParams } from "react-router-dom";
import { z } from "zod";
import { useGetPublicAlbumQuery } from "../hooks/useGetPublicAlbumInfQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useState, Fragment, useRef, useEffect } from "react";
import { Portal } from "../components/Portal";
import { TNewImage } from "@weasel/types";
import { AiOutlineClose } from "react-icons/ai";
import { randomString } from "../utils/randomString";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const PublicAlbumPage = () => {
    const endRef = useRef<HTMLButtonElement>(null);
    const params = useParams();
    const [selectedImage, setSelectedImage] = useState<TNewImage | null>();
    const albumId = z.string().parse(params.albumId);
    const publicAlbum = useGetPublicAlbumQuery(albumId);

    const entry = useIntersectionObserver(endRef, {});

    useEffect(() => {
        if (entry?.isIntersecting) {
            publicAlbum.fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry?.isIntersecting]);

    const handleFullScreenImageToggle = (image: TNewImage) => {
        setSelectedImage(image);
    };

    if (publicAlbum.isLoading)
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
                <LoadingSpinner color="#637ff1" size={60} />
                <p className="text-center text-lg font-medium text-periwinkle-900 dark:text-white">
                    Loading album...
                </p>
            </div>
        );

    if (!publicAlbum.data)
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-center text-lg font-medium text-periwinkle-900 dark:text-white">
                    This album doesn't exist or isn't public! 😥
                </p>
            </div>
        );

    if (!publicAlbum.data.pages[0]?.images.length)
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-center text-lg font-medium text-periwinkle-900 dark:text-white">
                    This album doesn't have any images yet! 😅
                </p>
            </div>
        );

    return (
        <main className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-col">
            <header className="flex flex-wrap items-center justify-between gap-1 border-b border-periwinkle-300 px-4 py-2 dark:border-zinc-600">
                <span className="peer line-clamp-1 flex-1 break-all text-lg font-bold hover:line-clamp-none">
                    {publicAlbum.data.pages[0].name}
                </span>

                <span className="text-lg peer-hover:self-start">
                    {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                    }).format(new Date(publicAlbum.data.pages[0].created_at!))}
                </span>
            </header>
            <div className="mb-12 mt-4 w-full columns-1 space-y-8 md:mb-20 md:columns-2 lg:columns-3">
                {publicAlbum.data?.pages[0].images.length && (
                    <div className="mx-auto mb-8 mt-4 w-full items-center gap-4 p-4 sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8 xl:columns-4">
                        {publicAlbum.data.pages.map((page) => (
                            <Fragment key={randomString(6)}>
                                {page.images.map((image) => (
                                    <figure className="flex h-min break-inside-avoid flex-col flex-wrap items-start justify-start">
                                        <button
                                            onClick={() => handleFullScreenImageToggle(image)}
                                            className="peer w-full rounded-lg border-2 border-periwinkle-50 hover:border-periwinkle-500 dark:border-zinc-950 dark:hover:border-periwinkle-400"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-full select-none rounded-md object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                        <figcaption className="line-clamp-1 break-all pl-1 font-semibold text-black hover:line-clamp-none peer-focus:line-clamp-none">
                                            {image.name}
                                        </figcaption>
                                    </figure>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={() => publicAlbum.fetchNextPage()}
                disabled={!publicAlbum.hasNextPage}
                ref={endRef}
                className="mb-4 px-4 py-2 text-center text-sm font-bold disabled:hidden"
            >
                {publicAlbum.hasNextPage
                    ? publicAlbum.isFetchingNextPage
                        ? "Loading more albums..."
                        : "Load more albums"
                    : null}
            </button>
            {selectedImage && (
                <Portal>
                    <div className="relative inset-0 flex h-full w-full items-center justify-center bg-black/90">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.name}
                            className="max-h-[95%] select-none object-cover px-2"
                            loading="eager"
                        />

                        <button
                            aria-label="Delete album."
                            onClick={() => setSelectedImage(null)}
                            className="group absolute right-4 top-4 z-30 rounded bg-periwinkle-50 p-2 dark:bg-zinc-800"
                        >
                            <AiOutlineClose
                                size={28}
                                className="fill-black group-hover:fill-red-500 dark:fill-white dark:group-hover:fill-red-500"
                            />
                        </button>
                    </div>
                </Portal>
            )}
        </main>
    );
};

export default PublicAlbumPage;
