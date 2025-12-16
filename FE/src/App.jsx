import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter, { getRouteMeta } from "./routes";

function App() {
    const location = useLocation();

    // Auto update document title khi đổi route
    useEffect(() => {
        const meta = getRouteMeta(location.pathname);
        if (meta?.title) {
            document.title = `${meta.title} - Chat App`;
        } else {
            document.title = "Chat App";
        }
    }, [location]);

    return (
        <>
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#333",
                        color: "#fff",
                    },
                    success: {
                        iconTheme: {
                            primary: "#10b981",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />

            {/* Main Router */}
            <AppRouter />
        </>
    );
}

export default App;
