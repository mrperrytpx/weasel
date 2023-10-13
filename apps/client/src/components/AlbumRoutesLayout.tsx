import { Link, Outlet } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";

const AlbumRoutesLayout = () => {
    return (
        <>
            <div className="sticky top-0 z-50 border-b border-periwinkle-300 bg-white dark:border-zinc-600 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-screen-2xl items-center justify-between bg-white p-2 dark:bg-zinc-950">
                    <Link to="/albums" className="py-2 text-xl hover:underline">
                        Albums
                    </Link>
                    <Link
                        to="/albums/create"
                        className="flex items-center justify-center gap-2 rounded-lg bg-white p-2 text-center shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-periwinkle-50 focus:outline-periwinkle-600 dark:text-periwinkle-950 dark:hover:text-periwinkle-50"
                    >
                        <AiOutlinePlusCircle size={20} />
                        <span className="group-hover:underline">Create Album</span>
                    </Link>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default AlbumRoutesLayout;
