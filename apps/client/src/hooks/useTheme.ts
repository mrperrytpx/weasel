import { useCallback, useEffect, useState } from "react";

export const useTheme = () => {
    const [darkmode, setDarkmode] = useState(
        JSON.parse(localStorage.getItem("weasel-album-theme")!) ?? false,
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            darkmode
                ? document.documentElement.classList.add("dark")
                : document.documentElement.classList.remove("dark");
        }
    }, [darkmode]);

    const toggleTheme = useCallback(() => {
        if (typeof window !== "undefined") {
            const isDarkmode = document.documentElement.classList.contains("dark");

            if (isDarkmode) {
                document.documentElement.classList.remove("dark");
            } else {
                document.documentElement.classList.add("dark");
            }

            setDarkmode(!isDarkmode);
            localStorage.setItem("weasel-album-theme", JSON.stringify(!isDarkmode));
        }
    }, []);

    return { toggleTheme, darkmode };
};
