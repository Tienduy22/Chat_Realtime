// components/ConversationList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { listConversation } from "../../../services/conversation.service";
import { useSocket } from "../../../context/SocketContext"; // ← Thêm import này

const ConversationList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Trạng thái online/offline
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [lastSeen, setLastSeen] = useState(new Map());

    const { socket } = useSocket();

    const navigate = useNavigate();
    const location = useLocation();

    const currentConversationId = location.pathname.startsWith("/chat/")
        ? location.pathname.split("/chat/")[1]
        : null;

    // Fetch danh sách cuộc trò chuyện
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await listConversation();
                if (response.success) {
                    setConversations(response.data);
                } else {
                    setError("Không thể tải danh sách cuộc trò chuyện");
                }
            } catch (err) {
                setError("Lỗi kết nối đến server");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    // Socket: online/offline/activity + initial sync
    useEffect(() => {
        if (!socket) return;

        const handleUserOnline = (data) => {
            setOnlineUsers((prev) => new Set(prev).add(data.user_id));
            setLastSeen((prev) => new Map(prev).set(data.user_id, Date.now()));
        };

        const handleUserActivity = (data) => {
            setLastSeen((prev) => new Map(prev).set(data.user_id, Date.now()));
            setOnlineUsers((prev) => new Set(prev).add(data.user_id));
        };

        const handleUserOffline = (data) => {
            setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(data.user_id);
                return newSet;
            });
        };

        const handleInitialOnline = (users) => {
            setOnlineUsers(new Set(users.map((u) => u.user_id)));
            setLastSeen(new Map(users.map((u) => [u.user_id, u.last_seen])));
        };

        socket.on("user_online", handleUserOnline);
        socket.on("user_activity", handleUserActivity);
        socket.on("user_offline", handleUserOffline);
        socket.on("initial_online_users", handleInitialOnline);

        return () => {
            socket.off("user_online", handleUserOnline);
            socket.off("user_activity", handleUserActivity);
            socket.off("user_offline", handleUserOffline);
            socket.off("initial_online_users", handleInitialOnline);
        };
    }, [socket]);

    // Format thời gian
    const formatTime = (dateString) => {
        if (!dateString) return "Chưa có tin nhắn";
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: vi,
            });
        } catch {
            return "Vừa xong";
        }
    };

    // Preview tin nhắn cuối
    const getLastMessagePreview = (messages, participants) => {
        if (!messages || messages.length === 0) return "Chưa có tin nhắn";

        const lastMsg = messages[0];
        console.log(messages);
        const sender = lastMsg.sender;

        let senderName = "Ai đó";
        if (sender && sender.full_name) {
            senderName = sender.full_name;
        } else if (participants) {
            const found = participants.find(
                (p) => p.user.user_id === lastMsg.sender_id
            );
            if (found) senderName = found.user.full_name;
        }

        switch (lastMsg.message_type) {
            case "text":
                return lastMsg.content || "Đã gửi một tin nhắn";
            case "image":
                return `${senderName} đã gửi 1 ảnh`;
            case "video":
                return `${senderName} đã gửi 1 video`;
            case "document":
                return `${senderName} đã gửi 1 tài liệu`;
            default:
                return `${senderName} đã gửi một tệp`;
        }
    };

    // Lấy tên và avatar hiển thị
    const getConversationDisplay = (conv) => {
        if (conv.conversation_type === "group") {
            return {
                name: conv.name || "Nhóm chat",
                avatar: conv.avatar_url,
                isGroup: true,
                otherUserId: null,
            };
        }

        if (!conv.participants || conv.participants.length === 0) {
            return {
                name: "Người dùng ẩn danh",
                avatar: null,
                isGroup: false,
                otherUserId: null,
            };
        }

        const otherUser =
            conv.participants.find(
                (p) => p.user.user_id !== conv.current_user_id
            )?.user || conv.participants[0].user;

        return {
            name: otherUser.full_name || "Người dùng ẩn danh",
            avatar: otherUser.avatar_url,
            isGroup: false,
            otherUserId: otherUser.user_id,
        };
    };

    // Lấy trạng thái online (chỉ cho chat cá nhân)
    const getUserStatusText = (userId) => {
        if (!userId) return null;

        // Ưu tiên cao nhất: nếu đang online → luôn "Đang hoạt động"
        if (onlineUsers.has(userId)) {
            return "Đang hoạt động";
        }

        // Chỉ khi offline mới tính thời gian từ lastSeen
        const lastActive = lastSeen.get(userId);
        if (!lastActive) return null;

        const diffMin = Math.floor((Date.now() - lastActive) / 60000);
        if (diffMin < 1) return "Vừa mới hoạt động";
        if (diffMin < 60) return `Hoạt động ${diffMin} phút trước`;
        if (diffMin < 1440)
            return `Hoạt động ${Math.floor(diffMin / 60)} giờ trước`;
        return `Hoạt động ${Math.floor(diffMin / 1440)} ngày trước`;
    };

    // Xử lý click vào cuộc trò chuyện
    const handleConversationClick = (conversationId) => {
        navigate(`/chat/${conversationId}`);
    };

    if (loading) {
        return (
            <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
                <div className="p-6 text-center text-gray-500">Đang tải...</div>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
                <div className="p-6 text-center text-red-500">{error}</div>
            </aside>
        );
    }

    return (
        <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex flex-shrink-0">
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Messages
                    </h2>
                    <button className="text-gray-400 hover:text-primary transition-colors">
                        <span className="material-icons text-xl">
                            edit_square
                        </span>
                    </button>
                </div>

                <div className="relative mb-6">
                    <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-lg">
                        search
                    </span>
                    <input
                        className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-200 placeholder-gray-400 transition-all"
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        type="text"
                    />
                </div>

                <div className="flex gap-2 mb-4">
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-medium rounded-lg">
                        Tất cả
                    </button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white text-xs font-medium rounded-lg transition-colors">
                        Chưa đọc
                    </button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white text-xs font-medium rounded-lg transition-colors">
                        Nhóm
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {conversations.map((item) => {
                    const conv = item.conversation;
                    const display = getConversationDisplay(conv);
                    const preview = getLastMessagePreview(
                        conv.messages,
                        conv.participants
                    );
                    const time =
                        conv.messages && conv.messages.length > 0
                            ? formatTime(conv.messages[0].created_at)
                            : "Chưa có tin nhắn";

                    const hasUnread = item.unread_count > 0;
                    const isActive =
                        conv.conversation_id.toString() ===
                        currentConversationId;
                    const statusText = !display.isGroup
                        ? getUserStatusText(display.otherUserId)
                        : null;
                    const isOnline =
                        !display.isGroup &&
                        onlineUsers.has(display.otherUserId);

                    return (
                        <div
                            key={item.participant_id}
                            onClick={() =>
                                handleConversationClick(conv.conversation_id)
                            }
                            className={`group p-3 rounded-xl cursor-pointer transition-all
                ${
                    isActive
                        ? "bg-primary/10 border border-primary/30 shadow-sm"
                        : hasUnread
                          ? "bg-white dark:bg-gray-800/60 shadow-sm border border-gray-100 dark:border-gray-700/50"
                          : "hover:bg-white dark:hover:bg-gray-800/40 border border-transparent hover:border-gray-100 dark:hover:border-gray-700/30"
                }`}
                        >
                            <div className="flex gap-3">
                                <div className="relative">
                                    {display.avatar ? (
                                        <img
                                            alt={display.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={display.avatar}
                                        />
                                    ) : display.isGroup ? (
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700">
                                            <span className="material-icons text-base text-gray-600 dark:text-gray-300">
                                                groups
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm">
                                            {display.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    {/* Chấm online chỉ hiện cho chat cá nhân */}
                                    {!display.isGroup && (
                                        <span
                                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                                                isOnline
                                                    ? "bg-green-500"
                                                    : "bg-gray-400"
                                            }`}
                                        />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Dòng trên: Tên + Thời gian tin nhắn cuối */}
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3
                                            className={`text-sm font-${hasUnread || isActive ? "semibold" : "medium"} 
                ${isActive ? "text-primary" : "text-gray-800 dark:text-gray-200"} truncate`}
                                        >
                                            {display.name}
                                        </h3>
                                        <span className="text-xs text-gray-400 shrink-0">
                                            {time}
                                        </span>
                                    </div>

                                    {/* Dòng dưới: Preview tin nhắn cắt ngắn + thời gian ở cuối nếu cần, nhưng theo ảnh thì chỉ preview + ... */}
                                    <div className="flex items-center justify-between">
                                        <p
                                            className={`text-xs truncate ${
                                                hasUnread || isActive
                                                    ? "text-gray-900 dark:text-white font-medium"
                                                    : "text-gray-500 dark:text-gray-500"
                                            }`}
                                        >
                                            {preview.length > 50
                                                ? `${preview.substring(0, 47)}...`
                                                : preview}
                                        </p>

                                        {hasUnread && (
                                            <span className="bg-primary text-white text-[10px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shrink-0">
                                                {item.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default ConversationList;
