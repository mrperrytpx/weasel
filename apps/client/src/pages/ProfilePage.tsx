import { Link, Outlet } from "react-router-dom";
import { VscAccount, VscFolder, VscGear } from "react-icons/vsc";
import { CiMoneyBill } from "react-icons/ci";
import { useUser } from "../hooks/useUser";
import { useGetProfileStatsQuery } from "../hooks/useGetProfileStatsQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";

const ProfilePage = () => {
    const user = useUser();
    const profileStats = useGetProfileStatsQuery();

    if (!user?.data) return null;

    return (
        <main className="mx-auto grid w-full max-w-responsive-screen-2xl flex-col gap-4 p-4 md:flex-1 md:grid-cols-[minmax(0,12rem),minmax(20rem,1fr)] md:grid-rows-none">
            <aside>
                <ul className="space-y-4 text-sm font-medium">
                    <Link
                        className="transition-color group flex flex-wrap items-center gap-4 rounded-md bg-white px-4 py-2 shadow duration-75 hover:bg-periwinkle-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-periwinkle-600"
                        to=""
                    >
                        {user.data.image ? (
                            <img
                                src={user.data.image}
                                className="aspect-square w-6 select-none rounded-full"
                                alt="Your profile image."
                            />
                        ) : (
                            <VscAccount className="group-hover:fill-white" size={24} />
                        )}{" "}
                        Overview
                    </Link>
                    <Link
                        className="transition-color group flex flex-wrap items-center gap-4 rounded-md bg-white px-4 py-2 shadow duration-75 hover:bg-periwinkle-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-periwinkle-600"
                        to="files"
                    >
                        <VscFolder className="group-hover:fill-white" size={24} /> Files
                    </Link>
                    <Link
                        className="transition-color group flex flex-wrap items-center gap-4 rounded-md bg-white px-4 py-2 shadow duration-75 hover:bg-periwinkle-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-periwinkle-600"
                        to="billing"
                    >
                        <CiMoneyBill className="group-hover:fill-white" size={24} />
                        Billing & Plans
                    </Link>
                    <Link
                        className="transition-color group flex flex-wrap items-center gap-4 rounded-md bg-white px-4 py-2 shadow duration-75 hover:bg-periwinkle-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-periwinkle-600"
                        to="settings"
                    >
                        <VscGear className="group-hover:fill-white" size={24} /> Settings
                    </Link>
                </ul>
            </aside>
            {profileStats.data ? (
                <Outlet context={profileStats.data} />
            ) : (
                <div className="mt-8 flex flex-1 items-center justify-center border-l-2 border-l-periwinkle-300 md:mt-0">
                    <LoadingSpinner color="#637ff1" size={60} />
                </div>
            )}
        </main>
    );
};

export default ProfilePage;
