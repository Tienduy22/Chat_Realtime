import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// ✅ Socket instance ở NGOÀI component - không bị ảnh hưởng bởi React lifecycle
let socketInstance = null;
let currentUserId = null;

const createSocketConnection = (userId) => {
    if (socketInstance && currentUserId === userId) {
        console.log("✅ Reusing existing socket for user:", userId);
        return socketInstance;
    }

    // Disconnect socket cũ nếu có và user khác
    if (socketInstance && currentUserId !== userId) {
        console.log("🔄 User changed, recreating socket");
        socketInstance.disconnect();
        socketInstance = null;
    }

    console.log("🆕 Creating NEW socket for user:", userId);
    currentUserId = userId;

    socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    return socketInstance;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }
    return context.socket;
};

export const SocketProvider = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    const user_id = useSelector((state) => state.user?.user_id);

    useEffect(() => {
        if (!user_id) {
            console.log("⏭️ No user_id");
            if (socketInstance) {
                console.log("🚪 Disconnecting socket (user logged out)");
                socketInstance.disconnect();
                socketInstance = null;
                currentUserId = null;
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // ✅ Tạo hoặc reuse socket
        const sock = createSocketConnection(user_id);

        // ✅ Remove old listeners trước khi add mới (tránh duplicate)
        sock.off("connect");
        sock.off("disconnect");
        sock.off("connect_error");

        // ✅ Add event listeners
        sock.on("connect", () => {
            console.log("✅ Socket connected:", sock.id);
            setIsConnected(true);
        });

        sock.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected. Reason:", reason);
            setIsConnected(false);
        });

        sock.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error);
            setIsConnected(false);
        });

        // ✅ Update state để trigger re-render
        setSocket(sock);
        setIsConnected(sock.connected);

        // ✅ Cleanup: CHỈ remove listeners, KHÔNG disconnect socket
        return () => {
            console.log("🧹 Cleanup: Removing event listeners (NOT disconnecting)");
            // Không disconnect, chỉ cleanup listeners
        };
    }, [user_id]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            <Outlet />
        </SocketContext.Provider>
    );
};