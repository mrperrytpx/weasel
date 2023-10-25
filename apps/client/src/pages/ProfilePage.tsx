import { useUser } from "../hooks/useUser";
import DefaultProfileSvg from "../assets/default-profile.webp";
import { useGetProfileStatsQuery } from "../hooks/useGetProfileStatsQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { roundBytesToKilobytes } from "../utils/roundBytesToKilobytes";
import { useDeleteUserMutation } from "../hooks/useDeleteUserMutation";
import { useCompleteOrderMutation } from "../hooks/useCompleteOrderMutation";

const STORAGE_PER_USER = 262_144_000;

const ProfilePage = () => {
    const user = useUser();
    const profileStats = useGetProfileStatsQuery();
    const deleteUser = useDeleteUserMutation();
    const completeOrder = useCompleteOrderMutation();

    if (!user?.data) return null;

    const largerProfileImageUrl = user.data?.image?.replace("s96-c", "s500-c");

    return (
        <main className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-col gap-4 px-4 md:gap-32">
            <article className="mx-auto mt-8 grid w-full max-w-responsive-screen-md gap-4 rounded-lg md:grid-cols-2 lg:mt-20">
                <div className="grid grid-cols-1 place-content-start">
                    <img
                        src={largerProfileImageUrl || DefaultProfileSvg}
                        alt={"Your profile image."}
                        className="aspect-square w-48 select-none place-self-center rounded-full shadow md:w-64"
                    />
                </div>
                {profileStats.isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <LoadingSpinner size={56} color="#637ff1" />
                        <p>Loading stats...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {!user.data.isSubscriptionActive && (
                            <button
                                disabled={completeOrder.isLoading}
                                onClick={async () => completeOrder.mutateAsync()}
                                className="rounded-md bg-white px-4 py-2 shadow"
                            >
                                {completeOrder.isLoading
                                    ? "Changing plans..."
                                    : "Activate premium!"}
                            </button>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-1 md:justify-normal">
                            <span className="text-lg font-medium">Current plan:</span>
                            <span>
                                {user.data.isSubscriptionActive ? "Premium plan" : "Free plan"}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1 md:justify-normal">
                            <span className="text-lg font-medium">Storage used:</span>
                            <span>
                                {profileStats.data?.storage} bytes
                                {!user.data.isSubscriptionActive &&
                                    ` out of ${STORAGE_PER_USER} bytes`}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1 md:justify-normal">
                            <span className="text-lg font-medium">Number of albums:</span>
                            <span>{profileStats.data?.numOfAlbums}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1 md:justify-normal">
                            <span className="text-lg font-medium">Number of images:</span>
                            <span>{profileStats.data?.numOfImages}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:items-start">
                            <p className="text-lg font-medium">Album with most images:</p>
                            <div>
                                {profileStats.data?.albumWithMostImages ? (
                                    <>
                                        <div className="space-x-2">
                                            <span className="text-lg font-medium">Name:</span>
                                            <Link
                                                className="hover:text-periwinkle-600 hover:underline"
                                                to={`/albums/${profileStats.data?.albumWithMostImages.id}`}
                                            >
                                                {profileStats.data?.albumWithMostImages.name}
                                            </Link>
                                        </div>
                                        <div className="space-x-2">
                                            <span className="text-lg font-medium">Images:</span>
                                            <span>
                                                {profileStats.data?.albumWithMostImages.numOfImages}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p>No albums with images!</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:items-start">
                            <p className="text-lg font-medium">Largest image:</p>
                            <div>
                                {profileStats.data?.largestImage ? (
                                    <div>
                                        <div className="space-x-2">
                                            <span className="text-lg font-medium">Name:</span>
                                            <a
                                                className="underline hover:text-periwinkle-600"
                                                href={profileStats.data?.largestImage.url}
                                            >
                                                {profileStats.data?.largestImage.name}
                                            </a>
                                        </div>
                                        <div className="space-x-2">
                                            <span className="text-lg font-medium">Size:</span>
                                            <span>
                                                {roundBytesToKilobytes(
                                                    profileStats.data?.largestImage.size,
                                                )}{" "}
                                                Kilobytes
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No images!</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </article>
            <button
                disabled={deleteUser.isLoading}
                onClick={async () => await deleteUser.mutateAsync()}
                className="disabled:opacity-500 transition-color mb-8 mt-auto w-full select-none self-center rounded-md bg-white p-2 font-medium shadow duration-75 enabled:hover:bg-red-500 enabled:hover:text-white enabled:focus:bg-red-500 enabled:focus:text-white disabled:opacity-50 dark:bg-zinc-800 sm:max-w-[12rem] md:mt-0"
            >
                {deleteUser.isLoading ? "Goodbye..." : "DELETE ACCOUNT"}
            </button>
        </main>
    );
};

export default ProfilePage;
