import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

let socketInstance = null;
let currentUserId = null;

const createSocketConnection = (userId) => {
    if (socketInstance && currentUserId === userId) {
        return socketInstance;
    }

    if (socketInstance && currentUserId !== userId) {
        socketInstance.disconnect();
        socketInstance = null;
    }

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
    return context;
};

export const SocketProvider = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // ✅ Online state quản lý tập trung ở đây
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [lastSeen, setLastSeen] = useState(new Map());

    const user_id = useSelector((state) => state.user?.user_id);

    useEffect(() => {
        if (!user_id) {
            if (socketInstance) {
                socketInstance.disconnect();
                socketInstance = null;
                currentUserId = null;
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const sock = createSocketConnection(user_id);

        // ✅ Đăng ký online listeners TRƯỚC - không bị miss event
        const handleInitialOnline = (users) => {
            setOnlineUsers(new Set(users.map((u) => u.user_id)));
            setLastSeen(new Map(users.map((u) => [u.user_id, u.last_seen])));
        };
        const handleUserOnline = (data) => {
            setOnlineUsers((prev) => new Set(prev).add(data.user_id));
            setLastSeen((prev) => new Map(prev).set(data.user_id, Date.now()));
        };
        const handleUserOffline = (data) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.delete(data.user_id);
                return next;
            });
            setLastSeen((prev) => new Map(prev).set(data.user_id, Date.now()));
        };
        const handleUserActivity = (data) => {
            setOnlineUsers((prev) => new Set(prev).add(data.user_id));
            setLastSeen((prev) => new Map(prev).set(data.user_id, Date.now()));
        };

        sock.off("initial_online_users");
        sock.off("user_online");
        sock.off("user_offline");
        sock.off("user_activity");
        sock.off("connect");
        sock.off("disconnect");
        sock.off("connect_error");

        sock.on("initial_online_users", handleInitialOnline);
        sock.on("user_online", handleUserOnline);
        sock.on("user_offline", handleUserOffline);
        sock.on("user_activity", handleUserActivity);

        sock.on("connect", () => {
            console.log("✅ Socket connected:", sock.id);
            setIsConnected(true);
            // ✅ Emit sau khi đã đăng ký listener rồi → không bao giờ miss
            sock.emit("get_online_users");
        });

        sock.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
            setIsConnected(false);
        });

        sock.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error);
            setIsConnected(false);
        });

        // ✅ Nếu socket đã connected sẵn (reuse), emit luôn
        if (sock.connected) {
            sock.emit("get_online_users");
        }

        setSocket(sock);
        setIsConnected(sock.connected);

        return () => {
            sock.off("initial_online_users", handleInitialOnline);
            sock.off("user_online", handleUserOnline);
            sock.off("user_offline", handleUserOffline);
            sock.off("user_activity", handleUserActivity);
        };
    }, [user_id]);

    return (
        <SocketContext.Provider
            value={{ socket, isConnected, onlineUsers, lastSeen }}
        >
            <Outlet />
        </SocketContext.Provider>
    );
};
