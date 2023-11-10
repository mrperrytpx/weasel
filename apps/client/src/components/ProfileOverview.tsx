import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { VscInfo } from "react-icons/vsc";
import { FREE_TIER_STORAGE, PREMIUM__TIER_STORAGE } from "../utils/tierStorageSizes";
import { convertBytesToPalletableSize } from "../utils/convertBytesToPalletableSize";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";
import { useGetProfileStatsQuery } from "../hooks/useGetProfileStatsQuery";

type TStatCardProps = {
    text: string;
    span: string | number | undefined;
};

const StatCard = ({ text, span }: TStatCardProps) => {
    return (
        <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-4 shadow dark:bg-zinc-800">
            <h2 className="text-xl font-medium">{text}</h2>
            {span ? (
                <span>{span}</span>
            ) : (
                <span className="h-6 animate-pulse rounded-full bg-gray-300 px-6" />
            )}
        </article>
    );
};

export const ProfileOverview = () => {
    const user = useUser();
    const profileStats = useGetProfileStatsQuery();

    const percentageStorage = () =>
        profileStats.data?.storageUsed ||
        1 / (!user?.data?.isSubscriptionActive ? FREE_TIER_STORAGE : PREMIUM__TIER_STORAGE);

    const formattedPercentage = new Intl.NumberFormat("en-gb", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(percentageStorage());

    return (
        <ProfileSubrouteLayout>
            {!user?.data?.isSubscriptionActive && (
                <div className="rounded-md border-2 border-periwinkle-300 bg-white p-2 dark:border-zinc-600 dark:bg-zinc-800">
                    <VscInfo className="inline fill-orange-600 dark:fill-orange-400" size={24} />{" "}
                    You are currently using the <span className="font-medium">Free Plan</span> -
                    Head to {""}
                    <Link
                        to="billing"
                        className="font-medium hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400"
                    >
                        Billing and Plans
                    </Link>{" "}
                    to upgrade!
                </div>
            )}
            <h1 className="pl-2 text-center text-2xl font-bold md:text-left">Profile Overview</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-4 text-center shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Storage used</h2>
                    <div>
                        <p>
                            {profileStats.data?.storageUsed} out of
                            {!user?.data?.isSubscriptionActive
                                ? ` ${FREE_TIER_STORAGE} bytes`
                                : ` ${PREMIUM__TIER_STORAGE} bytes`}
                        </p>
                        <p className="font-medium">{formattedPercentage}</p>
                    </div>
                    <div className="relative w-full rounded-lg border-2 border-periwinkle-600/30 py-2">
                        <div
                            style={{
                                width: formattedPercentage,
                            }}
                            className="absolute -left-[1px] top-0 h-full w-full rounded-md bg-periwinkle-600"
                        />
                    </div>
                </article>
                <StatCard text="Albums created" span={profileStats.data?.numOfAlbums || 0} />
                <StatCard text="Images stored" span={profileStats.data?.numOfImages || 0} />
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-4 shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Largest Album</h2>
                    {profileStats.data?.albumWithMostImages ? (
                        <div className="space-y-2">
                            <Link
                                className="underline hover:text-periwinkle-600"
                                to={`${import.meta.env.VITE_WEBSITE_URL}/albums/${profileStats.data
                                    ?.albumWithMostImages.id}`}
                            >
                                {profileStats.data?.albumWithMostImages.name}
                            </Link>
                            <div className="space-x-2 text-center">
                                <span className="font-medium">Images:</span>
                                <span>{profileStats.data?.albumWithMostImages.numOfImages}</span>
                            </div>
                        </div>
                    ) : (
                        <p>No albums with images!</p>
                    )}
                </article>
                <article className="flex flex-col items-center justify-center gap-4 rounded-md bg-white p-2 shadow dark:bg-zinc-800">
                    <h2 className="text-xl font-medium">Largest Image</h2>
                    {profileStats.data?.largestImage ? (
                        <div className="space-y-2 text-center">
                            <a
                                className="underline hover:text-periwinkle-600"
                                href={profileStats.data?.largestImage.url}
                            >
                                {profileStats.data?.largestImage.name}
                            </a>
                            <div className="space-x-2">
                                <span className="text-lg font-medium">Size:</span>
                                <span>
                                    {convertBytesToPalletableSize(
                                        profileStats.data?.largestImage.size,
                                    )}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p>No images!</p>
                    )}
                </article>
            </div>
        </ProfileSubrouteLayout>
    );
};
