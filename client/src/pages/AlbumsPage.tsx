import { AiOutlinePlusCircle } from "react-icons/ai";
import AlbumCard from "../components/AlbumCard";

const AlbumsPage = () => {
    return (
        <div className="mx-auto flex  flex-col gap-2 ">
            <div className="sticky top-0 border-b border-periwinkle-300 bg-white dark:border-zinc-600 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-4">
                    <span className="text-xl">Albums</span>
                    <button className="flex items-center gap-2 py-1">
                        <AiOutlinePlusCircle size={20} />
                        <span>Create Album</span>
                    </button>
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
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
            </ul>
        </div>
    );
};

export default AlbumsPage;
