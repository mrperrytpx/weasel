import { TAlbum } from "@weasel/types";
import { BsTrash } from "react-icons/bs";
import { useDeleteAlbumMutation } from "../hooks/useDeleteAlbumMutation";
import { Link } from "react-router-dom";
import SolidColorImage from "../assets/solid-color.jpeg";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { ComponentProps, useState } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";

type TAlbumCardProps = {
    album: TAlbum;
};

const AlbumCard = ({ album }: TAlbumCardProps) => {
    const [copied, setCopied] = useState(false);

    const deleteAlbum = useDeleteAlbumMutation();

    const handleDeleteAlbum: ComponentProps<"button">["onClick"] = async (e) => {
        e.stopPropagation();
        await deleteAlbum.mutateAsync({ albumId: album.id });
    };

    const handleCopyAlbumUrl: ComponentProps<"button">["onClick"] = async (e) => {
        e.stopPropagation();
        if (copied) return;

        if (typeof window != "undefined" && window.document) {
            if (!album) return;
            navigator.clipboard.writeText(
                `${import.meta.env.VITE_WEBSITE_URL}/public-album/${album.id}`,
            );
            setCopied(true);

            const turnBackTimeout = setTimeout(() => setCopied(false), 5000);

            return () => clearTimeout(turnBackTimeout);
        }
    };

    return (
        <article className="relative flex aspect-square w-full max-w-xs flex-col self-start rounded-md bg-white transition-all duration-75 hover:scale-[101%] dark:bg-zinc-900">
            <Link to={`/albums/${album.id}`}>
                <div className="flex aspect-square w-full items-center justify-center">
                    <img
                        className="aspect-square w-full select-none rounded-t-md object-cover"
                        src={album.images[0]?.url ? album.images[0]?.url : SolidColorImage}
                        alt="Placeholder"
                    />
                </div>
                <div className="space-y-1 rounded-b-md border-t-2 border-periwinkle-50 p-2 text-black dark:border-zinc-950 dark:text-periwinkle-50 dark:shadow-zinc-800">
                    <p title={album.name} className="break-word line-clamp-1 font-medium">
                        {album.name}
                    </p>
                    <p className="text-sm font-medium">Images: {album._count.images}</p>
                    <p className="line-clamp-1 break-all rounded-b-md pr-1 text-right text-xs font-semibold italic opacity-80">
                        {new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "long",
                        }).format(new Date(album.created_at))}
                    </p>
                </div>
            </Link>
            <button
                aria-label="Delete the album."
                onClick={handleDeleteAlbum}
                className="group absolute right-2 top-2 rounded-md bg-white p-2 shadow dark:bg-zinc-800"
            >
                <BsTrash
                    size={20}
                    className="fill-black group-hover:fill-red-500 dark:fill-white"
                />
            </button>
            {album.isPublic && (
                <button
                    aria-label="Copy album's public URL."
                    onClick={handleCopyAlbumUrl}
                    className="group absolute left-2 top-2 rounded-md bg-white p-2 shadow dark:bg-zinc-800"
                >
                    {copied ? (
                        <IoCheckmarkSharp
                            size={20}
                            className="stroke-black group-hover:stroke-periwinkle-600 dark:stroke-white dark:group-hover:stroke-periwinkle-400"
                        />
                    ) : (
                        <FaRegShareFromSquare
                            size={20}
                            className="fill-black group-hover:fill-periwinkle-600 dark:fill-white dark:group-hover:fill-periwinkle-400"
                        />
                    )}
                </button>
            )}
        </article>
    );
};

export default AlbumCard;
