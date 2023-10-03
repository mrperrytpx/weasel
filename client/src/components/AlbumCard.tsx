import { Link } from "react-router-dom";
import DefaultAlbum from "../assets/weasel.webp";
import { TAllAlbums } from "../../../shared/types";

type TAlbumCardProps = {
    album: TAllAlbums;
};

const AlbumCard = ({ album }: TAlbumCardProps) => {
    return (
        <li className="flex aspect-square w-full max-w-xs flex-col self-start rounded-md bg-gray-200 transition-all duration-75 hover:scale-[101%] hover:bg-gray-300 dark:bg-gray-700  dark:hover:bg-gray-600">
            <Link to={`/albums/${album.id}`}>
                <div className="flex aspect-square w-full items-center justify-center border-b-2 border-black">
                    <img
                        className="aspect-square w-full rounded-t-md object-cover"
                        src={DefaultAlbum}
                        alt="Placeholder"
                    />
                </div>
                <div className="space-y-1 rounded-b-md  p-2 text-black shadow-md shadow-periwinkle-200 dark:text-periwinkle-50 dark:shadow-zinc-800">
                    <p className="break-word line-clamp-2 font-medium">{album.name}</p>
                    <p className="text-xs font-bold uppercase text-gray-600 dark:text-periwinkle-400">
                        {album.description}
                    </p>
                </div>
            </Link>
        </li>
    );
};

export default AlbumCard;
