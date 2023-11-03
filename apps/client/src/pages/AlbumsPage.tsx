import AlbumCard from "../components/AlbumCard";
import WeaselOnAShelfImage from "../assets/weasel-shelf.webp";
import { useGetAllAlbumsInfQuery } from "../hooks/useGetAllAlbumsInfQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useRef } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { randomString } from "../utils/randomString";

const AlbumsPage = () => {
    const userInfiniteAlbums = useGetAllAlbumsInfQuery();
    const endRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(endRef, {});

    useEffect(() => {
        if (entry?.isIntersecting) {
            userInfiniteAlbums.fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry?.isIntersecting]);

    if (userInfiniteAlbums.isLoading) {
        return (
            <main className="flex flex-1 flex-col gap-2">
                <div className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-wrap justify-center gap-6 p-4 md:justify-start lg:gap-16">
                    <div className="mx-auto mt-20 space-y-4 p-4">
                        <LoadingSpinner color="#637ff1" size={60} />
                        <p className="text-lg font-medium text-periwinkle-900 dark:text-white">
                            Loading albums...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!userInfiniteAlbums.data?.pages[0].albums.length) {
        return (
            <main className="flex flex-1 flex-col gap-2">
                <div className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-wrap justify-center gap-6 p-4 md:justify-start lg:gap-16">
                    <div className="mx-auto mb-8 w-full max-w-xs gap-1 p-4">
                        <div className="mt-8 flex w-full flex-col items-center justify-center gap-2 lg:mt-16">
                            <div className="aspect-square w-full">
                                <img
                                    src={WeaselOnAShelfImage}
                                    alt="Illustration of an orange weasel looking out of the frame to the left, sitting on a woooden bookshelf. The bookshelf has 5 books in it. White, orange, white with an orange stripe at the bottom, yellow with an orange stripe at the bottom, orange with 2 small yellow stripes near the top and near the bottom of the book cover."
                                />
                            </div>
                            <Link
                                to="/albums/create"
                                className="flex items-center justify-center gap-2 rounded-lg bg-white p-2 text-center shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-periwinkle-50 focus:outline-periwinkle-600 dark:bg-zinc-800 dark:text-white hover:dark:bg-periwinkle-600 dark:hover:text-periwinkle-50"
                            >
                                <AiOutlinePlusCircle size={20} />
                                <span>Create Album</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col gap-2">
            <div className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-wrap justify-center gap-6 p-4 md:justify-start lg:gap-16">
                {userInfiniteAlbums.data.pages.map((page) => (
                    <Fragment key={randomString(6)}>
                        {page.albums.map((album) => (
                            <AlbumCard key={album.id} album={album} />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div className="mb-4 px-4 py-2 text-center text-sm font-bold" ref={endRef}>
                {userInfiniteAlbums.hasNextPage
                    ? userInfiniteAlbums.isFetchingNextPage
                        ? "Loading more albums..."
                        : "Load more albums"
                    : null}
            </div>
        </main>
    );
};

export default AlbumsPage;
