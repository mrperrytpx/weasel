import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useTheme } from "../hooks/useTheme";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { apiInstance } from "../utils/axiosClients";
import { useQueryClient } from "@tanstack/react-query";
import WeaselImage from "../assets/weasel.webp";
import { BiLogOut } from "react-icons/bi";
import { useEffect, useState } from "react";
import { VscChromeClose, VscMenu } from "react-icons/vsc";
import { MobileMenu } from "./MobileMenu";
import { LoadingSpinner } from "./LoadingSpinner";

export const Navbar = () => {
    const user = useUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleTheme, darkmode } = useTheme();

    const [isMenuExpanded, setIsMenuExpanded] = useState(false);

    const logout = async () => {
        const data = await apiInstance.post("/api/auth/logout");

        if (data.statusText === "OK") {
            queryClient.clear();
            navigate(0);
        }
    };

    useEffect(() => setIsMenuExpanded(false), [location]);

    return (
        <header className="relative flex h-14 items-center border-b border-b-periwinkle-300 bg-white p-2 shadow-md shadow-periwinkle-100 dark:border-b-zinc-600 dark:bg-black dark:shadow-zinc-900">
            <div className="max-w-responsive-screen-2xl mx-auto flex w-full items-center justify-between px-2">
                <Link to="/">
                    <img
                        src={WeaselImage}
                        title="Go to homepage"
                        className="aspect-square w-8 select-none"
                        alt="A photo of a cartoonish orange weasel holding a black camera and looking slightly down into the camera's screen."
                    />
                </Link>
                <ul className="flex items-center gap-4">
                    {user?.isLoading ? (
                        <LoadingSpinner size={28} />
                    ) : (
                        <>
                            {user?.data?.id && (
                                <li className="hidden sm:inline">
                                    <Link
                                        className="hidden font-extrabold uppercase sm:inline"
                                        to="/albums"
                                    >
                                        Albums
                                    </Link>
                                </li>
                            )}
                            {user?.data?.id ? (
                                <li>
                                    <Link to="/profile">
                                        <img
                                            title="Go to profile"
                                            className="aspect-square w-8 select-none rounded-full"
                                            src={user?.data?.image as string}
                                            alt="Your profile image."
                                            referrerPolicy="no-referrer"
                                        />
                                    </Link>
                                </li>
                            ) : (
                                location.pathname !== "/sign-in" && (
                                    <Link to="/sign-in">Sign In</Link>
                                )
                            )}
                            {user?.data?.id && (
                                <li className="hidden items-center justify-center sm:flex">
                                    <button
                                        title="Logout"
                                        aria-label="Logout"
                                        className="p-2"
                                        onClick={logout}
                                    >
                                        <BiLogOut size={28} />
                                    </button>
                                </li>
                            )}
                        </>
                    )}
                    <li className="flex items-center justify-center">
                        <button
                            title={darkmode ? "Swap to light mode." : "Swap to darkmode."}
                            aria-label="Toggle theme change."
                            className="p-2"
                            onClick={toggleTheme}
                        >
                            {darkmode ? <BsSun size={24} /> : <BsMoonStars size={24} />}
                        </button>
                    </li>
                    <li className="flex items-center justify-center sm:hidden">
                        <button
                            aria-label="Menu"
                            onClick={() => setIsMenuExpanded((old) => !old)}
                            className="select-none text-3xl"
                        >
                            {isMenuExpanded ? <VscChromeClose /> : <VscMenu />}
                        </button>
                    </li>
                </ul>
            </div>
            {isMenuExpanded && (
                <MobileMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} />
            )}
        </header>
    );
};
