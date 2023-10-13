import { useEffect, useState, useCallback } from "react";

export const useTheme = () => {
    const [darkmode, setDarkmode] = useState<boolean>(
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
            setDarkmode((old) => !old);
            localStorage.setItem("weasel-album-theme", JSON.stringify(!darkmode));
        }
    }, [darkmode]);

    return { toggleTheme, darkmode };
};
