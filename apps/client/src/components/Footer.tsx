import { VscGithub } from "react-icons/vsc";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="w-full border-t border-t-periwinkle-300 bg-white dark:border-t-zinc-600 dark:bg-zinc-900">
            <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center gap-4 px-4 py-16">
                <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between">
                    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
                        <Link
                            className="rounded-md text-center transition-all duration-75 hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400 sm:inline-block"
                            to="/tos"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            className="rounded-md text-center transition-all duration-75 hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400 sm:inline-block"
                            to="/contact"
                        >
                            Contact
                        </Link>
                        <Link
                            className="rounded-md text-center transition-all duration-75 hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400 sm:inline-block"
                            to="/privacy"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://github.com/mrperrytpx/weasel/"
                        aria-label="Github"
                        className="group mt-auto select-none rounded-full "
                    >
                        <VscGithub className="h-10 w-10 group-hover:scale-105 group-hover:fill-periwinkle-600 group-focus:scale-105 group-focus:fill-periwinkle-600 group-hover:dark:fill-periwinkle-400 dark:group-focus:fill-periwinkle-400" />
                    </a>
                </div>
                <div className="w-full text-center md:text-left">
                    <strong>©</strong> {new Date().getFullYear()} Weasel Albums
                </div>
            </div>
        </footer>
    );
};
