import React, { createContext, useContext, useState, useCallback } from "react";
import { useSocket } from "./SocketContext";
import { getNotifications } from "../services/notification.service";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {socket} = useSocket();

    // Thêm thông báo mới
    const addNotification = useCallback((notification) => {
        setNotifications((prev) => [
            {
                ...notification,
                is_read: notification.is_read ?? false,
            },
            ...prev,
        ]);
        if (!notification.is_read) {
            setUnreadCount((prev) => prev + 1);
        }
    }, []);

    // Cập nhật danh sách thông báo
    const updateNotifications = useCallback((data) => {
        setNotifications(data || []);
        setUnreadCount((data || []).filter((n) => !n.is_read).length);
    }, []);

    // Đánh dấu thông báo đã đọc
    const markAsRead = useCallback((notificationId) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.notification_id === notificationId
                    ? { ...n, is_read: true }
                    : n,
            ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    // Đánh dấu tất cả thông báo đã đọc
    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
    }, []);

    // Xóa thông báo
    const deleteNotification = useCallback((notificationId) => {
        setNotifications((prev) => {
            const notification = prev.find(
                (n) => n.notification_id === notificationId,
            );
            if (notification && !notification.is_read) {
                setUnreadCount((c) => Math.max(0, c - 1));
            }
            return prev.filter((n) => n.notification_id !== notificationId);
        });
    }, []);

    // Xóa tất cả thông báo
    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Fetch notifications từ API
    const fetchNotifications = useCallback(
        async (page = 1, limit = 100) => {
            try {
                setIsLoading(true);
                const response = await getNotifications(page, limit);
                if (response?.data) {
                    updateNotifications(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        },
        [updateNotifications],
    );

    // Setup socket listeners
    const setupSocketListeners = useCallback(() => {
        if (!socket) return;

        // Friend request notification
        socket.on("friend_request", (data) => {
            console.log(data);
            const notification = {
                notification_id: Date.now(),
                type: "friend_request",
                title: "Lời mời kết bạn",
                content: `${data.from_user?.full_name || "Ai đó"} đã gửi lời mời kết bạn`,
                from_user: data.from_user,
                reference_id: data.from_user?.user_id,
                reference_type: "user",
                is_read: false,
                created_at: new Date().toISOString(),
            };
            addNotification(notification);
        });

        // Friend accepted notification
        socket.on("friend_accepted", (data) => {
            console.log(data);
            const notification = {
                notification_id: Date.now(),
                type: "friend_accepted",
                title: "Đã chấp nhận lời mời kết bạn",
                content: `${data.from_user?.full_name || "Ai đó"} đã chấp nhận lời mời kết bạn`,
                from_user: data.from_user,
                reference_id: data.from_user?.user_id,
                reference_type: "user",
                is_read: false,
                created_at: new Date().toISOString(),
            };
            addNotification(notification);
        });

        socket.onAny((event, ...args) => {
            console.log("socket event:", event, args);
        });

        // Friend rejected notification
        socket.on("friend_rejected", (data) => {
            const notification = {
                notification_id: Date.now(),
                type: "friend_rejected",
                title: "Từ chối lời mời kết bạn",
                content: `${data.from_user?.full_name || "Ai đó"} đã từ chối lời mời kết bạn`,
                from_user: data.from_user,
                reference_id: data.from_user?.user_id,
                reference_type: "user",
                is_read: false,
                created_at: new Date().toISOString(),
            };
            addNotification(notification);
        });

        // Message notification
        socket.on("message_notification", (data) => {
            const notification = {
                notification_id: Date.now(),
                type: "message",
                title: data.title,
                content: data.content,
                from_user: data.from_user,
                reference_id: data.reference_id,
                reference_type: data.reference_type,
                is_read: false,
                created_at: new Date().toISOString(),
            };
            addNotification(notification);
        });

        // Message reaction notification
        socket.on("message_reaction", (data) => {
            console.log(data)
            const notification = {
                notification_id: Date.now(),
                type: "reaction",
                title: `${data.title}`,
                content: `${data.content}`,
                from_user: data.from_user,
                reference_id: data.reference_id,
                reference_type: "conversation",
                is_read: false,
                created_at: new Date().toISOString(),
            };
            addNotification(notification);
        });

        // Group invite notification
        socket.on("group_invite", (data) => {
            const notification = {
                notification_id: Date.now(),
                type: "group_invite",
                title: "Thêm vào nhóm",
                content: `${data.from_user?.full_name || "Ai đó"} đã thêm bạn vào nhóm "${data.group_name}"`,
                from_user: data.from_user,
                reference_id: data.conversation_id,
                reference_type: "conversation",
                is_read: false,
                created_at: new Date().toISOString(),
            };
            addNotification(notification);
        });

        // Notification marked as read
        socket.on("notification_read", (data) => {
            markAsRead(data.notification_id);
        });

        // Notification deleted
        socket.on("notification_deleted", (data) => {
            deleteNotification(data.notification_id);
        });

        return () => {
            socket.off("friend_request");
            socket.off("friend_accepted");
            socket.off("friend_rejected");
            socket.off("message_notification");
            socket.off("message_reaction");
            socket.off("mention");
            socket.off("group_invite");
            socket.off("group_deleted");
            socket.off("system_notification");
            socket.off("notification_read");
            socket.off("notification_deleted");
        };
    }, [socket, addNotification, markAsRead, deleteNotification]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                error,
                addNotification,
                updateNotifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAllNotifications,
                fetchNotifications,
                setupSocketListeners,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within NotificationProvider",
        );
    }
    return context;
};
