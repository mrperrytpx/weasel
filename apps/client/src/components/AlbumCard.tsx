import { Link } from "react-router-dom";
import DefaultAlbum from "../assets/weasel.webp";
import { TAlbum } from "@weasel/types";
import { BsTrash } from "react-icons/bs";
import { useDeleteAlbumMutation } from "../hooks/useDeleteAlbumMutation";

type TAlbumCardProps = {
    album: TAlbum;
};

const AlbumCard = ({ album }: TAlbumCardProps) => {
    const deleteAlbum = useDeleteAlbumMutation();

    const handleDeleteAlbum = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        await deleteAlbum.mutateAsync({ albumId: album.id });
    };

    return (
        <li className="relative flex aspect-square w-full max-w-xs flex-col self-start rounded-md bg-zinc-200 transition-all duration-75 hover:scale-[101%] hover:bg-zinc-300 dark:bg-zinc-700  dark:hover:bg-zinc-600">
            <Link to={`/albums/${album.id}`}>
                <div className="flex aspect-square w-full items-center justify-center border-b-2 border-black">
                    <img
                        className="aspect-square w-full rounded-t-md object-cover"
                        src={album.images[0]?.url ? album.images[0]?.url : DefaultAlbum}
                        alt="Placeholder"
                    />
                </div>
                <div className="space-y-1 rounded-b-md p-2 text-black shadow-md shadow-periwinkle-200 dark:text-periwinkle-50 dark:shadow-zinc-800">
                    <p className="break-word line-clamp-2 font-medium">{album.name}</p>
                    <p className="text-xs font-bold uppercase text-zinc-600 dark:text-periwinkle-400">
                        {album.description}
                    </p>
                </div>
            </Link>
            <button
                aria-label="Delete the album."
                onClick={handleDeleteAlbum}
                className="group absolute right-2 top-2 rounded-md bg-white p-2 shadow"
            >
                <BsTrash size={20} className="fill-black group-hover:fill-red-500" />
            </button>
        </li>
    );
};

export default AlbumCard;
