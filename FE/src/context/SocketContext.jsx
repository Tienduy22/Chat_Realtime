import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
// import { useAuthStore } from "../store/authStore";

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }
    return context;
};

export const SocketProvider = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    let user, token

    useEffect(() => {
        if (!user || !token) return;

        // Khởi tạo socket connection
        const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
            auth: {
                token: token,
            },
            transports: ["websocket"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        // Connection events
        socketInstance.on("connect", () => {
            console.log("✅ Socket connected:", socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            setIsConnected(false);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
        });

        setSocket(socketInstance);

        // Cleanup
        return () => {
            console.log("🔌 Closing socket connection");
            socketInstance.disconnect();
        };
    }, [user, token]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            <Outlet />
        </SocketContext.Provider>
    );
};
