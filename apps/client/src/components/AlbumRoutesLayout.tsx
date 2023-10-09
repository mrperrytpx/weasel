import { Link, Outlet } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";

const AlbumRoutesLayout = () => {
    return (
        <>
            <div className="sticky top-0 border-b border-periwinkle-300 bg-white dark:border-zinc-600 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-4">
                    <span className="text-xl">Albums</span>
                    <Link to="/albums/create" className="flex items-center gap-2 py-1">
                        <AiOutlinePlusCircle size={20} />
                        <span>Create Album</span>
                    </Link>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default AlbumRoutesLayout;
