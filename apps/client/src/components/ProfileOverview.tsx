import { Link, useOutletContext } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { VscInfo } from "react-icons/vsc";
import { FREE_TIER_STORAGE, PREMIUM__TIER_STORAGE } from "../utils/tierStorageSizes";
import { roundBytesToKilobytes } from "../utils/roundBytesToKilobytes";
import { TProfileStats } from "@weasel/types";

export const ProfileOverview = () => {
    const user = useUser();
    const profileStats = useOutletContext<TProfileStats>();

    return (
        <main className="space-y-4 border-l-2 border-l-periwinkle-300 px-4 dark:border-l-zinc-600">
            {user?.data?.isSubscriptionActive && (
                <div className="rounded-md border-2 border-periwinkle-300 bg-white p-2 dark:border-zinc-600 dark:bg-zinc-800">
                    <VscInfo className="inline fill-orange-600 dark:fill-orange-400" size={24} />{" "}
                    You are currently using the <span className="font-medium">Free Plan</span> -
                    Head to the{" "}
                    <Link
                        to="billing"
                        className="font-medium hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400"
                    >
                        Billing and Plans
                    </Link>{" "}
                    to upgrade!
                </div>
            )}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-2 text-center shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Storage used</h2>
                    <p>
                        {profileStats.storage} out of
                        {!user?.data?.isSubscriptionActive
                            ? ` ${FREE_TIER_STORAGE} bytes`
                            : ` ${PREMIUM__TIER_STORAGE} bytes`}
                    </p>
                </article>
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-2 shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Albums created</h2>
                    <span>{profileStats.numOfAlbums}</span>
                </article>
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-2 shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Images stored</h2>
                    <span>{profileStats.numOfImages}</span>
                </article>
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-2 shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Largest Album</h2>
                    {profileStats.albumWithMostImages ? (
                        <div className="space-y-2">
                            <Link
                                className="underline hover:text-periwinkle-600"
                                to={`${import.meta.env.VITE_WEBSITE_URL}/albums/${
                                    profileStats.albumWithMostImages.id
                                }`}
                            >
                                {profileStats.albumWithMostImages.name}
                            </Link>
                            <div className="space-x-2 text-center">
                                <span className="font-medium">Images:</span>
                                <span>{profileStats.albumWithMostImages.numOfImages}</span>
                            </div>
                        </div>
                    ) : (
                        <p>No albums with images!</p>
                    )}
                </article>
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-2 shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Largest Image</h2>
                    {profileStats.largestImage ? (
                        <div className="space-y-2 text-center">
                            <a
                                className="underline hover:text-periwinkle-600"
                                href={profileStats.largestImage.url}
                            >
                                {profileStats.largestImage.name}
                            </a>
                            <div className="space-x-2">
                                <span className="text-lg font-medium">Size:</span>
                                <span>
                                    {roundBytesToKilobytes(profileStats.largestImage.size)}{" "}
                                    Kilobytes
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p>No images!</p>
                    )}
                </article>
            </div>
        </main>
    );
};
