import { useRef, useEffect, SetStateAction, Dispatch } from "react";
import { VscGithub } from "react-icons/vsc";
import { useUser } from "../hooks/useUser";
import { Link, useNavigate } from "react-router-dom";
import { apiInstance } from "../utils/axiosClients";
import { useQueryClient } from "@tanstack/react-query";

type TMobileMenuProps = {
    isMenuExpanded: boolean;
    setIsMenuExpanded: Dispatch<SetStateAction<boolean>>;
};

export const MobileMenu = ({ isMenuExpanded, setIsMenuExpanded }: TMobileMenuProps) => {
    const mobileRef = useRef<HTMLDivElement | null>(null);
    const user = useUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = async () => {
        const data = await apiInstance.post("/api/auth/logout");

        if (data.statusText === "OK") {
            queryClient.clear();
            navigate(0);
        }
    };

    useEffect(() => {
        if (typeof window != "undefined" && window.document) {
            if (isMenuExpanded) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "unset";
            }
        }

        const resizeWindow = () => {
            const html = document.querySelector("html");

            if (!html) return;
            const widthInRem = window.innerWidth / parseFloat(getComputedStyle(html).fontSize);

            if (widthInRem >= 40 && isMenuExpanded) {
                document.body.style.overflow = "unset";
                setIsMenuExpanded(false);
            }
        };

        window.addEventListener("resize", resizeWindow);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("resize", resizeWindow);
        };
    }, [isMenuExpanded, setIsMenuExpanded]);

    useEffect(() => {
        mobileRef.current = document.querySelector<HTMLDivElement>("#menu");
        setIsMenuExpanded(true);
    }, [setIsMenuExpanded]);

    return (
        <aside
            id="menu"
            ref={mobileRef}
            className="absolute inset-0 top-14 z-50 flex h-[100svh] w-full flex-col items-center gap-4 bg-periwinkle-50 px-4 py-8 dark:bg-zinc-950 sm:hidden"
        >
            {user?.data?.id && (
                <Link to="/profile">
                    <img
                        title="Go to profile"
                        className="aspect-square w-16 select-none rounded-full border-2 border-white group-hover:border-periwinkle-600 dark:border-zinc-950 dark:group-hover:border-periwinkle-500"
                        src={user?.data?.image as string}
                        alt="Your profile image."
                        referrerPolicy="no-referrer"
                    />
                </Link>
            )}
            {user?.data?.id ? (
                <>
                    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4">
                        <Link
                            className="p-2 text-center text-2xl transition-all duration-75 hover:text-periwinkle-600 hover:underline focus:text-periwinkle-600 focus:underline dark:hover:text-periwinkle-400 dark:focus:text-periwinkle-400"
                            to="/profile"
                        >
                            Profile
                        </Link>
                        <Link
                            className="p-2 text-center text-2xl transition-all duration-75 hover:text-periwinkle-600 hover:underline focus:text-periwinkle-600 focus:underline dark:hover:text-periwinkle-400 dark:focus:text-periwinkle-400"
                            to="/albums"
                        >
                            My Albums
                        </Link>

                        <button
                            onClick={logout}
                            className="p-2 text-center text-2xl transition-all duration-75 hover:text-periwinkle-600 hover:underline focus:text-periwinkle-600 focus:underline dark:hover:text-periwinkle-400 dark:focus:text-periwinkle-400"
                        >
                            Sign Out
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4">
                    <Link
                        className="p-2 text-center text-2xl transition-all duration-75 hover:text-periwinkle-600 hover:underline focus:text-periwinkle-600 focus:underline dark:hover:text-periwinkle-400 dark:focus:text-periwinkle-400"
                        to="/sign-in"
                    >
                        Sign In
                    </Link>
                </div>
            )}
            <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/mrperrytpx/weasel/"
                aria-label="Github"
                className="group mt-auto select-none rounded-full "
            >
                <VscGithub className="h-10 w-10 group-hover:scale-105 group-hover:fill-periwinkle-600 group-focus:scale-105 group-focus:fill-periwinkle-600 group-hover:dark:fill-periwinkle-400 dark:group-focus:fill-periwinkle-400" />
            </a>
            <div className="h-14" />
        </aside>
    );
};
