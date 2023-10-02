import { useCallback, useState } from "react";

export const useTheme = () => {
    const [darkmode, setDarkmode] = useState(false);

    const toggleTheme = useCallback(() => {
        if (typeof window !== "undefined" && document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            setDarkmode(false);
        } else {
            document.documentElement.classList.add("dark");
            setDarkmode(true);
        }
    }, []);

    return { toggleTheme, darkmode };
};
