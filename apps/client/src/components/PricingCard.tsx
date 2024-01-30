import { FcCheckmark } from "react-icons/fc";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useCreateCheckout } from "../hooks/useCreateCheckout";

type TPricingCardProps = {
    plan?: "premium" | "ultimate";
};

export const PricingCard = ({ plan }: TPricingCardProps) => {
    const user = useUser();
    const createCheckout = useCreateCheckout();

    if (plan === "premium") {
        return (
            <article
                style={{
                    border: user?.data && user.data.isSubscriptionActive ? "2px solid #4666e5" : "",
                }}
                className="relative flex w-full flex-col gap-8 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900"
            >
                <h3 className="text-2xl font-semibold">Premium Plan</h3>
                <p className="text-xl">5€ / month</p>
                <ul className="space-y-2">
                    <li className="flex items-center gap-4">
                        <FcCheckmark size={20} /> <span>Unlimited Albums</span>
                    </li>

                    <li className="flex items-center gap-4">
                        <FcCheckmark size={20} />
                        <span>50 Gigabytes of storage</span>
                    </li>
                    <li className="flex items-center gap-4">
                        <FcCheckmark size={20} />
                        <span>Shareable albums</span>
                    </li>

                    <li className="flex items-center gap-4"></li>
                </ul>
                {!user?.data ? (
                    <Link
                        to="/sign-in"
                        className="mt-auto inline-block w-full select-none rounded-full bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 hover:bg-periwinkle-700 hover:text-white"
                    >
                        Get Started
                    </Link>
                ) : !user.data.isSubscriptionActive ? (
                    <button
                        disabled={createCheckout.isLoading}
                        onClick={async () => await createCheckout.mutateAsync()}
                        className="mt-auto inline-block w-full select-none rounded-full bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 enabled:hover:bg-periwinkle-700 enabled:hover:text-white disabled:pointer-events-none disabled:opacity-50"
                    >
                        {createCheckout.isLoading ? "Upgrading..." : "Upgrade"}
                    </button>
                ) : (
                    <Link
                        to="/profile/billing"
                        className="mt-auto inline-block w-full select-none rounded-full bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 hover:bg-periwinkle-700 hover:text-white"
                    >
                        Current Plan
                    </Link>
                )}

                {user?.data?.isSubscriptionActive && (
                    <p className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-md bg-periwinkle-600 px-2 py-1 text-sm font-bold text-white">
                        Current Plan
                    </p>
                )}
            </article>
        );
    }

    if (plan === "ultimate") {
        return (
            <article className="relative rounded-lg bg-gradient-to-tr  from-blue-500 via-red-500 to-yellow-500 p-[1px] ">
                <div className="rounded-lg bg-white dark:bg-zinc-900">
                    <div className="flex w-full flex-col gap-8 rounded-lg bg-white p-6 shadow-md first-of-type:opacity-60 dark:bg-zinc-900">
                        <h3 className="text-2xl font-semibold">Ultimate Plan</h3>
                        <p className="text-xl">10€ / month</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-4">
                                <FcCheckmark size={20} /> <span>Unlimited Albums</span>
                            </li>

                            <li className="flex items-center gap-4">
                                <FcCheckmark size={20} />
                                <span>Unlimited Storage</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <FcCheckmark size={20} />
                                <span>Shareable albums</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <FcCheckmark size={20} />
                                <span>Editable albums by other users</span>
                            </li>

                            <li className="flex items-center gap-4"></li>
                        </ul>
                        <button
                            disabled={true}
                            className="mt-auto inline-block w-full select-none rounded-full bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 enabled:hover:bg-periwinkle-700 enabled:hover:text-white disabled:pointer-events-none disabled:opacity-50"
                        >
                            Coming Soon!
                        </button>
                    </div>
                </div>
                <p className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-md bg-green-500 px-2 py-1 text-sm font-bold text-white">
                    Coming Soon!
                </p>
            </article>
        );
    }

    return (
        <article
            style={{
                opacity: user?.data && user.data.isSubscriptionActive ? "0.5" : "1",
            }}
            className="relative flex w-full flex-col gap-8 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900"
        >
            <h3 className="text-2xl font-semibold">Free Plan</h3>
            <p className="text-xl">0€ / month</p>
            <ul className="space-y-2">
                <li className="flex items-center gap-4">
                    <FcCheckmark size={20} /> <span>Unlimited Albums</span>
                </li>

                <li className="flex items-center gap-4">
                    <FcCheckmark size={20} />
                    <span>250 Megabytes of storage</span>
                </li>
                <li className="flex items-center gap-4">
                    <AiOutlineClose className="fill-red-500" size={20} />
                    <span>Shareable albums</span>
                </li>

                <li className="flex items-center gap-4"></li>
            </ul>
            <Link
                style={{
                    pointerEvents: user?.data && user.data.isSubscriptionActive ? "none" : "auto",
                }}
                to="/profile/billing"
                className="mt-auto inline-block w-full select-none rounded-full bg-periwinkle-600 px-4 py-2 text-white shadow transition-colors duration-75 hover:bg-periwinkle-700 enabled:hover:text-white disabled:pointer-events-none disabled:opacity-50 "
            >
                {user?.data && !user.data.isSubscriptionActive ? "Current Plan" : "Get Started"}
            </Link>
            {user?.data && !user?.data?.isSubscriptionActive && (
                <p className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-md bg-periwinkle-600 px-2 py-1 text-sm font-bold text-white">
                    Current Plan
                </p>
            )}
        </article>
    );
};
