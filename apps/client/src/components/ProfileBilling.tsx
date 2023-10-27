import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export const ProfileBilling = () => {
    const user = useUser();

    return (
        <main className="border-l-2 border-l-periwinkle-300 px-4 dark:border-l-zinc-600">
            {!user?.data?.isSubscriptionActive && (
                <div className="rounded-md border-2 border-periwinkle-600 bg-white p-2 dark:bg-zinc-800">
                    You are currently using the Free Plan - Head to the{" "}
                    <Link to="billing" className="hover:text-periwinkle-600 hover:underline">
                        Billing and Plans
                    </Link>{" "}
                    to upgrade!
                </div>
            )}
        </main>
    );
};
