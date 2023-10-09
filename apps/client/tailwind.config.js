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
        },
    },
    plugins: ["prettier-plugin-tailwindcss"],
};
