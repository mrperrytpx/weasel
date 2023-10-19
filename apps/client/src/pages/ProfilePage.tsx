import { useUser } from "../hooks/useUser";
import DefaultProfileSvg from "../assets/default-profile.webp";
import { useGetProfileStatsQuery } from "../hooks/useGetProfileStatsQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { roundBytesToMegabytes } from "../utils/roundBytestoMegabytes";

const ProfilePage = () => {
    const user = useUser();
    const profileStats = useGetProfileStatsQuery();

    if (!user?.data) return null;

    const largerProfileImageUrl = user.data?.image?.replace("s96-c", "s500-c");

    return (
        <main className="mx-auto flex w-full max-w-responsive-screen-2xl flex-1 flex-col gap-16 px-4 md:gap-32">
            <article className="mx-auto mt-8 grid w-full max-w-responsive-screen-md gap-8 rounded-lg py-2 md:grid-cols-2 lg:mt-20">
                <div className="grid grid-cols-1 place-content-start">
                    <img
                        src={largerProfileImageUrl || DefaultProfileSvg}
                        alt={"Your profile image."}
                        className="aspect-square w-64 select-none place-self-center rounded-full shadow"
                    />
                </div>
                {profileStats.isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <LoadingSpinner size={56} color="#637ff1" />
                        <p>Loading stats...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-1">
                            <span className="text-lg font-medium">Number of albums:</span>
                            <span>{profileStats.data?.numOfAlbums}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            <span className="text-lg font-medium">Number of images:</span>
                            <span>{profileStats.data?.numOfImages}</span>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <p className="text-lg font-medium">Album with most images:</p>
                            <div>
                                {profileStats.data?.albumWithMostImages ? (
                                    <div>
                                        <div className="space-x-2">
                                            <span className="text-lg font-medium">Name:</span>
                                            <Link
                                                className="hover:underline"
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
                                    </div>
                                ) : (
                                    <p>No albums!</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <p className="text-lg font-medium">Largest iamge:</p>
                            <div>
                                {profileStats.data?.largestImage ? (
                                    <div>
                                        <div className="space-x-2">
                                            <span className="text-lg font-medium">Name:</span>
                                            <a
                                                className="underline"
                                                href={profileStats.data?.largestImage.url}
                                            >
                                                {profileStats.data?.largestImage.name}
                                            </a>
                                        </div>
                                        <div className="space-x-2">
                                            <span className="text-lg font-medium">Size:</span>
                                            <span>
                                                {roundBytesToMegabytes(
                                                    profileStats.data?.largestImage.size,
                                                )}
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
            <button className="disabled:opacity-500 transition-color w-full select-none self-center rounded-md bg-white p-2  shadow duration-75 enabled:hover:bg-red-500 enabled:hover:text-white enabled:focus:bg-red-500 enabled:focus:text-white dark:bg-zinc-900 sm:max-w-[12rem]">
                DELETE ACCOUNT
            </button>
        </main>
    );
};

export default ProfilePage;
