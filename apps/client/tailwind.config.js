/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    future: {
        hoverOnlyWhenSupported: true,
    },
    theme: {
        extend: {
            colors: {
                periwinkle: {
                    50: "#eef1ff",
                    100: "#e0e6ff",
                    200: "#c7d2fe",
                    300: "#a5b6fc",
                    400: "#8199f8",
                    500: "#637ff1",
                    600: "#4666e5",
                    700: "#3855ca",
                    800: "#3047a3",
                    900: "#2e3f81",
                    950: "#1b254b",
                },
            },
            maxWidth: {
                "responsive-screen-sm": "40rem",
                "responsive-screen-md": "48rem",
                "responsive-screen-lg": "64rem",
                "responsive-screen-xl": "80rem",
                "responsive-screen-2xl": "96rem",
            },
        },
        screens: {
            sm: "40rem",
            // => @media (min-width: 640px) { ... }

            md: "48rem",
            // => @media (min-width: 768px) { ... }

            lg: "64rem",
            // => @media (min-width: 1024px) { ... }

            xl: "80rem",
            // => @media (min-width: 1280px) { ... }

            "2xl": "96rem",
            // => @media (min-width: 1536px) { ... }
        },
    },
    plugins: ["prettier-plugin-tailwindcss"],
};
