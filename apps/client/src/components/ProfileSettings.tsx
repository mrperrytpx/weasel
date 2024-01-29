import { useState } from "react";
import { useDeleteUserMutation } from "../hooks/useDeleteUserMutation";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";
import { Portal } from "./Portal";
import WeaselCryingSmall from "../assets/weasel-crying-small.webp";
import WeaselCryingMedium from "../assets/weasel-crying-medium.webp";
import { useUser } from "../hooks/useUser";
import { useGetProfileStatsQuery } from "../hooks/useGetProfileStatsQuery";
import { Link } from "react-router-dom";

export const ProfileSettings = () => {
    const deleteUser = useDeleteUserMutation();
    const profileStats = useGetProfileStatsQuery();
    const user = useUser();

    const [isModalMounted, setIsModalMounted] = useState(false);

    const handleDeleteAccount = async () => {
        setIsModalMounted(false);
        await deleteUser.mutateAsync();
    };

    return (
        <ProfileSubrouteLayout>
            <h1 className="text-center text-2xl font-bold md:text-left">Settings</h1>
            {user?.data?.isSubscriptionActive && (
                <article className="w-full space-y-4 rounded-lg py-4">
                    <header className="flex items-center">
                        <hgroup className="flex flex-col gap-1">
                            <h2 className="break-normal text-lg font-medium sm:text-xl">
                                Subscription
                            </h2>
                            <p>Details about your subscription.</p>
                        </hgroup>
                    </header>
                    <div className="flex w-full flex-col items-start">
                        <div className="flex items-center gap-2">
                            <p>Current plan:</p>
                            <p>Premium Plan</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p>Next billing date:</p>
                            {profileStats.data ? (
                                <span>
                                    {new Intl.DateTimeFormat("en-GB", {
                                        dateStyle: "full",
                                    }).format(
                                        new Date(+profileStats.data.subscriptionDueDate! * 1000),
                                    )}
                                </span>
                            ) : (
                                <span className="mt-1 inline-block h-5 w-48 animate-pulse rounded-full bg-gray-400 align-sub opacity-25" />
                            )}
                        </div>
                    </div>
                    <Link
                        to="/profile/billing"
                        className="inline-block min-w-[10rem] rounded-md bg-white px-4 py-2 text-sm font-medium text-red-500 shadow transition-colors duration-75 hover:bg-red-500 hover:text-white focus-visible:bg-red-500 focus-visible:text-white dark:bg-zinc-800 dark:hover:bg-red-500 dark:focus-visible:bg-red-500"
                    >
                        Cancel your subscription
                    </Link>
                </article>
            )}
            <article className="rounded-lg border border-periwinkle-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <header className="flex items-center">
                    <hgroup className="flex flex-col gap-1">
                        <h2 className="break-normal text-lg font-medium sm:text-xl">Danger Zone</h2>
                        <p>Delete my Account - this action is unreversable!</p>
                    </hgroup>
                </header>
                <div className="mt-4 flex w-full flex-col items-start gap-4">
                    <button
                        onClick={() => setIsModalMounted((old) => !old)}
                        disabled={deleteUser.isLoading}
                        className="min-w-[10rem] rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors duration-75 hover:bg-red-700 hover:text-white focus-visible:bg-red-700 focus-visible:text-white disabled:pointer-events-none disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-700 dark:focus-visible:bg-red-700"
                    >
                        {deleteUser.isLoading ? "Goodbye..." : "Delete"}
                    </button>
                </div>
            </article>
            {isModalMounted && (
                <Portal>
                    <dialog className="relative inset-0 flex h-full w-full flex-col items-center bg-periwinkle-50 p-4 dark:bg-black dark:text-white">
                        <picture className="sm:mt-8">
                            <source media="(min-width:40rem)" srcSet={WeaselCryingMedium} />
                            <img
                                src={WeaselCryingSmall}
                                className="select-none"
                                alt="An orange weasel crying. It has its hands close to where the mouth is supposed to be."
                            />
                        </picture>

                        <div className="flex flex-col gap-4 text-center">
                            <p className="text-lg">We're sorry to see you go!</p>

                            <div>
                                <p>Are you sure you want to delete your account?</p>
                                <p>
                                    Deleting it will also delete{" "}
                                    <span className="font-extrabold uppercase">all</span> of your
                                    hosted images.
                                </p>
                                <p>This action is not reversable.</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteUser.isLoading}
                                tabIndex={0}
                                className="min-w-[10rem] rounded-md bg-white px-4 py-2 text-sm font-medium text-red-500 shadow transition-colors duration-75 hover:bg-red-500 hover:text-white focus-visible:bg-red-500 focus-visible:text-white disabled:pointer-events-none disabled:opacity-50  dark:bg-zinc-800 dark:hover:bg-red-500 dark:focus-visible:bg-red-500"
                            >
                                {deleteUser.isLoading ? "Goodbye..." : "Yes, Delete"}
                            </button>
                            <button
                                tabIndex={0}
                                onClick={() => setIsModalMounted(false)}
                                className="min-w-[10rem] rounded-md bg-white px-4 py-2 text-sm font-medium shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-white focus-visible:bg-periwinkle-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:hover:bg-periwinkle-400 dark:focus-visible:bg-periwinkle-400"
                            >
                                Go Back
                            </button>
                        </div>
                    </dialog>
                </Portal>
            )}
        </ProfileSubrouteLayout>
    );
};
