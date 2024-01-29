import { useCreateCheckout } from "../hooks/useCreateCheckout";
import { useGetProfileStatsQuery } from "../hooks/useGetProfileStatsQuery";
import { useUser } from "../hooks/useUser";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";
import { convertBytesToPalletableSize } from "../utils/convertBytesToPalletableSize";
import { useState } from "react";
import { Portal } from "./Portal";
import { useDeleteUserSubscriptionMutation } from "../hooks/useDeleteUserSubscriptionMutation";

export const ProfileBilling = () => {
    const user = useUser();
    const profileStats = useGetProfileStatsQuery();
    const createCheckout = useCreateCheckout();
    const deleteSub = useDeleteUserSubscriptionMutation();

    const [isCancelMounted, setIsCancelMounted] = useState(false);

    const handleDeleteSub = () => {
        setIsCancelMounted(false);
        deleteSub.mutate();
    };

    return (
        <ProfileSubrouteLayout>
            <hgroup>
                <h1 className="text-center text-2xl font-bold md:text-left">Billing & Plans</h1>
                <p className="text-center md:text-left">
                    Manage your subscription for this account.
                </p>
            </hgroup>
            <article className="rounded-lg border border-periwinkle-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="grid gap-4 md:grid-cols-[2fr,3fr,minmax(0,8rem)]">
                    <h2 className="flex-1 self-start text-center text-lg font-bold md:text-left">
                        Current Plan
                    </h2>
                    <div className="flex-1 self-start text-center md:text-left ">
                        <p className="text-lg">
                            <strong>{user?.data?.isSubscriptionActive ? "Premium" : "Free"}</strong>{" "}
                            <span>({user?.data?.isSubscriptionActive ? "50GB" : "250MB"})</span>
                        </p>
                        <p>
                            Current usage:{" "}
                            {profileStats.data ? (
                                <span>
                                    {convertBytesToPalletableSize(profileStats.data?.storageUsed)}
                                </span>
                            ) : (
                                <span className="inline-block h-5 w-20 animate-pulse self-end rounded-full bg-gray-400 align-sub opacity-25" />
                            )}
                        </p>
                    </div>
                    {user?.data?.isSubscriptionActive ? (
                        <div className="flex flex-col items-end">
                            <p className="text-lg font-medium">Next billing date</p>
                            {profileStats.data ? (
                                <span className="text-right">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        dateStyle: "full",
                                    }).format(
                                        new Date(+profileStats.data.subscriptionDueDate! * 1000),
                                    )}
                                </span>
                            ) : (
                                <span className="mt-1 inline-block h-5 w-48 animate-pulse self-end rounded-full bg-gray-400 align-sub opacity-25" />
                            )}
                            <button
                                disabled={deleteSub.isLoading}
                                onClick={() => setIsCancelMounted((old) => !old)}
                                className="mt-2 min-w-[7.5rem] max-w-[7.5rem] rounded-md bg-white px-4 py-2 text-sm font-medium text-red-500 shadow transition-colors duration-75 hover:bg-red-500 hover:text-white focus-visible:bg-red-500 focus-visible:text-white disabled:pointer-events-none disabled:opacity-50  dark:bg-zinc-800 dark:hover:bg-red-500 dark:focus-visible:bg-red-500"
                            >
                                {deleteSub.isLoading ? "Cancelling..." : "Cancel"}
                            </button>
                        </div>
                    ) : (
                        <button
                            disabled={createCheckout.isLoading}
                            onClick={async () => await createCheckout.mutateAsync()}
                            className="min-w-[7.5rem] max-w-[7.5rem] select-none place-self-center rounded-md bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 enabled:hover:bg-periwinkle-700 enabled:hover:text-white disabled:pointer-events-none disabled:opacity-50 md:place-self-start"
                        >
                            {createCheckout.isLoading ? "Upgrading..." : "Upgrade"}
                        </button>
                    )}
                </div>
            </article>
            {/*  */}
            <article>
                <h2 className="flex-1 self-start text-center text-lg font-bold md:text-left">
                    Available plans
                </h2>
                <div className="mt-2 flex flex-col gap-4">
                    <div className="grid w-full gap-4 self-center rounded-lg border border-periwinkle-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 md:max-w-none md:grid-cols-[2fr,3fr,minmax(0,8rem)]">
                        <h3 className="text-center text-lg font-medium md:text-left">Free</h3>
                        <div className="flex justify-center md:justify-start">
                            <ul className="list-disc pl-4">
                                <li>Unlimited number of albums</li>
                                <li>250MB of available storage</li>
                            </ul>
                        </div>
                        <button
                            disabled={createCheckout.isLoading}
                            onClick={async () => await createCheckout.mutateAsync()}
                            className="min-w-[7.5rem] max-w-[7.5rem] select-none place-self-center rounded-md bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 enabled:hover:bg-periwinkle-700 enabled:hover:text-white disabled:pointer-events-none disabled:opacity-50 md:place-self-start"
                        >
                            {createCheckout.isLoading ? "Upgrading..." : "Upgrade"}
                        </button>
                    </div>
                    <div className="grid w-full gap-4 self-center rounded-lg border border-periwinkle-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 md:max-w-none md:grid-cols-[2fr,3fr,minmax(0,8rem)]">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-medium">Premium</h3>
                            <p>5€ / month</p>
                        </div>
                        <div className="flex justify-center md:justify-start">
                            <ul className="list-disc pl-4">
                                <li>Unlimited number of albums</li>
                                <li>50GB of available storage</li>
                                <li>Option to make albums public</li>
                            </ul>
                        </div>
                        <button
                            disabled={createCheckout.isLoading}
                            onClick={async () => await createCheckout.mutateAsync()}
                            className="min-w-[7.5rem] max-w-[7.5rem] select-none place-self-center rounded-md bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 enabled:hover:bg-periwinkle-700 enabled:hover:text-white disabled:pointer-events-none disabled:opacity-50 md:place-self-start"
                        >
                            {createCheckout.isLoading ? "Upgrading..." : "Upgrade"}
                        </button>
                    </div>
                    <div className="rounded-lg bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 p-[1px]">
                        <div className="relative grid w-full gap-4 self-center rounded-lg bg-white p-4 dark:bg-zinc-900 md:max-w-none md:grid-cols-[2fr,3fr,minmax(0,8rem)]">
                            <div className="text-center md:text-left">
                                <h3 className="bg-gradient-to-b from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-lg font-bold text-transparent">
                                    UNLIMITED
                                </h3>
                                <p>10€ / month</p>
                            </div>
                            <div className="flex justify-center md:justify-start">
                                <ul className="list-disc pl-4">
                                    <li>Unlimited number of albums</li>
                                    <li>Unlimited storage</li>
                                    <li>Option to make albums public</li>
                                    <li>Option for other users to upload to your albums</li>
                                </ul>
                            </div>
                            <button
                                disabled={true}
                                className="min-w-[7.5rem] select-none place-self-center rounded-md bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 enabled:hover:bg-periwinkle-700 enabled:hover:text-white disabled:pointer-events-none disabled:opacity-50 md:max-w-[7.5rem] md:place-self-start"
                            >
                                Soon!
                            </button>
                        </div>
                    </div>
                </div>
            </article>
            {/*  */}
            {isCancelMounted && (
                <Portal>
                    <dialog className="relative inset-0 flex h-full w-full flex-col items-center bg-periwinkle-50/10 p-4 pt-20 dark:bg-black/10 dark:text-white md:justify-center md:pt-0">
                        <div className="rounded-lg bg-white p-8 dark:bg-zinc-900">
                            <div className="flex flex-col gap-4 text-center">
                                <p className="text-lg">
                                    Are you sure you want to cancel your subscription?
                                </p>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                                <button
                                    onClick={handleDeleteSub}
                                    disabled={deleteSub.isLoading}
                                    tabIndex={0}
                                    className="min-w-[10rem] rounded-md bg-white px-4 py-2 text-sm font-medium text-red-500 shadow transition-colors duration-75 hover:bg-red-500 hover:text-white focus-visible:bg-red-500 focus-visible:text-white disabled:pointer-events-none disabled:opacity-50  dark:bg-zinc-800 dark:hover:bg-red-500 dark:focus-visible:bg-red-500"
                                >
                                    Yes, Cancel
                                </button>
                                <button
                                    tabIndex={0}
                                    onClick={() => setIsCancelMounted(false)}
                                    className="min-w-[10rem] rounded-md bg-white px-4 py-2 text-sm font-medium shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-white focus-visible:bg-periwinkle-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:hover:bg-periwinkle-400 dark:focus-visible:bg-periwinkle-400"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </dialog>
                </Portal>
            )}
        </ProfileSubrouteLayout>
    );
};
