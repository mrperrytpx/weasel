import { AiOutlinePlusCircle } from "react-icons/ai";
import AlbumCard from "../components/AlbumCard";
import { Link } from "react-router-dom";
import { useGetAllAlbumsQuery } from "../hooks/useGetAllAlbumsQuery";

const AlbumsPage = () => {
    const userAlbums = useGetAllAlbumsQuery();

    return (
        <div className="flex flex-col gap-2">
            {userAlbums.data && <div>{JSON.stringify(userAlbums.data.data, null, 2)}</div>}
            <div className="sticky top-0 border-b border-periwinkle-300 bg-white dark:border-zinc-600 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-4">
                    <span className="text-xl">Albums</span>
                    <Link to="/albums/create" className="flex items-center gap-2 py-1">
                        <AiOutlinePlusCircle size={20} />
                        <span>Create Album</span>
                    </Link>
                </div>
            </div>
            <ul className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-center gap-6 p-4 xl:justify-between xl:gap-16">
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
            </ul>
        </div>
    );
};

export default AlbumsPage;
