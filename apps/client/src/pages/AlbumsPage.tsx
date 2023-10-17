import AlbumCard from "../components/AlbumCard";
import WeaselOnAShelfImage from "../assets/weasel-shelf.webp";
import { useGetAllAlbumsInfiniteQuery } from "../hooks/useGetAllAlbumsInfiniteQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Fragment, useEffect, useRef } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const AlbumsPage = () => {
    const userAlbums = useGetAllAlbumsInfiniteQuery();
    const { darkmode } = useTheme();

    const endRef = useRef<HTMLDivElement>(null);

    const isIntersecting = useIntersectionObserver(endRef);

    useEffect(() => {
        if (userAlbums.hasNextPage) {
            if (isIntersecting) {
                userAlbums.fetchNextPage();
            }
        }
    }, [isIntersecting, userAlbums]);

    return (
        <div className="flex flex-1 flex-col gap-2">
            <div className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-wrap justify-center gap-6 p-4 md:justify-start lg:gap-12">
                {userAlbums.isLoading ? (
                    <div className="mx-auto mt-20 space-y-4 p-4">
                        <LoadingSpinner color={darkmode ? "white" : "#4666e5"} size={60} />
                        <p className="text-lg font-medium text-periwinkle-900 dark:text-white">
                            Loading albums...
                        </p>
                    </div>
                ) : userAlbums.data?.pages.length ? (
                    userAlbums.data.pages.map((page, i) => (
                        <Fragment key={i}>
                            {page.map((album) => (
                                <AlbumCard key={album.id} album={album} />
                            ))}
                        </Fragment>
                    ))
                ) : (
                    <div className="mx-auto mb-8 w-full max-w-xs gap-1 p-4">
                        <div className="mt-8 flex w-full flex-col items-center justify-center gap-2 lg:mt-16 ">
                            <div className="aspect-square w-full">
                                <img
                                    src={WeaselOnAShelfImage}
                                    alt="Illustration of an orange weasel looking out of the frame to the left, sitting on a woooden bookshelf. The bookshelf has 5 books in it. White, orange, white with an orange stripe at the bottom, yellow with an orange stripe at the bottom, orange with 2 small yellow stripes near the top and near the bottom of the book cover."
                                />
                            </div>
                            <Link
                                to="/albums/create"
                                className="flex items-center justify-center gap-2 rounded-lg bg-white p-2 text-center shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-periwinkle-50 focus:outline-periwinkle-600 dark:text-periwinkle-950 dark:hover:text-periwinkle-50"
                            >
                                <AiOutlinePlusCircle size={20} />
                                <span>Create Album</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <div ref={endRef} />
        </div>
    );
};

export default AlbumsPage;
