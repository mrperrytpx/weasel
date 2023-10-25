import { FcCheckmark } from "react-icons/fc";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";

type TPricingCardProps = {
    premium?: boolean;
};

export const PricingCard = ({ premium }: TPricingCardProps) => {
    return (
        <article
            className={`w-full space-y-8 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900 ${
                premium && "border-2 border-periwinkle-600"
            }`}
        >
            <h3 className="text-2xl font-semibold">{premium ? "Premium Plan" : "Free Plan"}</h3>
            <p className="text-xl">{premium ? "€10" : "€0"} / month</p>
            <ul className="space-y-2">
                <li className="flex items-center gap-4">
                    <FcCheckmark size={20} /> <span>Unlimited Albums</span>
                </li>

                <li className="flex items-center gap-4">
                    <FcCheckmark size={20} />
                    <span>{premium ? "50 Gigabytes of" : "250 Megabytes of"} storage</span>
                </li>
                <li className="flex items-center gap-4">
                    {premium ? (
                        <FcCheckmark size={20} />
                    ) : (
                        <AiOutlineClose className="fill-red-500" size={20} />
                    )}
                    <span>Shareable albums</span>
                </li>

                <li className="flex items-center gap-4"></li>
            </ul>
            <Link
                to="/profile"
                className="transition-color mt-auto inline-block w-full rounded-full bg-periwinkle-600 px-4 py-2 text-white shadow duration-75 enabled:hover:bg-periwinkle-700 enabled:hover:text-white disabled:opacity-50 "
            >
                Get Started
            </Link>
        </article>
    );
};
