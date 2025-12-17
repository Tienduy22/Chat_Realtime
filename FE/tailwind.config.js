export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#3b82f6", // A nice bright blue like the lightning icon
                "background-light": "#f3f4f6",
                "background-dark": "#111827", // A deep dark blue/gray
                "sidebar-dark": "#0B0E14", // Darker sidebar
                "sidebar-panel-dark": "#151923", // Slightly lighter panel for message list
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                xl: "1rem",
                "2xl": "1.5rem",
            },
        },
    },
    plugins: [],
};
