import { useParams } from "react-router-dom";
import { z } from "zod";
import { useGetPublicAlbumQuery } from "../hooks/useGetPublicAlbumInfQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Fragment, useRef, useEffect } from "react";
import { randomString } from "../utils/randomString";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const PublicAlbumPage = () => {
    const endRef = useRef<HTMLButtonElement>(null);
    const params = useParams();
    const albumId = z.string().parse(params.albumId);
    const publicAlbum = useGetPublicAlbumQuery(albumId);

    const entry = useIntersectionObserver(endRef, {});

    useEffect(() => {
        if (entry?.isIntersecting) {
            publicAlbum.fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry?.isIntersecting]);

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
            <div className="mb-12 mt-4 w-full columns-1 space-y-8 md:mb-20">
                {publicAlbum.data?.pages[0].images.length && (
                    <div className="mx-auto mb-8 mt-4 grid w-full grid-cols-4 items-center gap-4 p-4 sm:gap-6">
                        {publicAlbum.data.pages.map((page) => (
                            <Fragment key={randomString(6)}>
                                {page.images.map((image) => (
                                    <figure className="flex h-min break-inside-avoid flex-col flex-wrap items-start justify-start">
                                        <a
                                            href={image.url}
                                            target="_blank"
                                            referrerPolicy="no-referrer"
                                            className="peer w-full rounded-lg border-2 border-periwinkle-50 hover:border-periwinkle-500 dark:border-zinc-950 dark:hover:border-periwinkle-400"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-full select-none rounded-md object-cover"
                                                loading="lazy"
                                            />
                                        </a>
                                        <figcaption className=" line-clamp-1 break-all pl-1 font-semibold text-black hover:line-clamp-none peer-focus:line-clamp-none dark:text-white">
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
        </main>
    );
};

export default PublicAlbumPage;
