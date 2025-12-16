import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@store": path.resolve(__dirname, "./src/store"),
            "@api": path.resolve(__dirname, "./src/api"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@assets": path.resolve(__dirname, "./src/assets"),
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
            "/socket.io": {
                target: "ws://localhost:3001",
                ws: true,
            },
        },
    },
});
